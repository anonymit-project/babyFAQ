import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const URL_PAGE = pathToFileURL(path.resolve('dosis-fiebre.html')).href;

async function open(page) {
  // Bloquea Analytics y fuentes: los tests no deben contar como visitas en GA4.
  await page.route(/googletagmanager\.com|google-analytics\.com|fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.goto(URL_PAGE, { waitUntil: 'domcontentloaded' });
}

// Fija peso (kg), edad (meses) y concentración de ibuprofeno ('A' = 20 mg/mL, 'B' = 40 mg/mL) y vuelve a pintar.
const fijar = (page, kg, meses, conc = 'A') =>
  page.evaluate(([k, m, c]) => { kgIdx = KG_VALUES.indexOf(k); ageVal = m; setIbuConc(c); }, [kg, meses, conc]);
const txt = async (page, sel) => (await page.locator(sel).innerText()).replace(/\s+/g, ' ').trim();
const visible = async (page, sel) => !(await page.locator(sel).evaluate(e => e.classList.contains('hidden')));

// ── Tablas de la ficha técnica de Dalsy (AEMPS): [mínimo, máximo] mL por toma, 3 tomas al día ──
const DALSY_20 = { 5: [1.8, 2.4], 6: [2, 3], 7: [2.4, 3.4], 8: [2.8, 4], 9: [3, 4.4], 10: [3.4, 5], 12: [4, 6], 14: [4.8, 7], 16: [5.4, 8], 18: [6, 9], 20: [6.8, 10], 22: [7.4, 11], 24: [8, 12], 26: [8.8, 13], 28: [9.4, 14], 30: [10, 15] };
const DALSY_40 = { 5: [0.8, 1.2], 6: [1, 1.4], 7: [1.2, 1.6], 8: [1.4, 2], 9: [1.6, 2.2], 10: [1.8, 2.4], 12: [2, 3], 14: [2.4, 3.4], 16: [2.8, 4], 18: [3, 4.4], 20: [3.4, 5], 22: [3.8, 5.4], 24: [4, 6], 26: [4.4, 6.4], 28: [4.8, 7], 30: [5, 7.4] };
// Única celda que no reproduce la fórmula: 40 mg/mL a 5 kg (ficha 0,8–1,2; la página 1,0–1,2, dentro del rango y marcada como estimación).
const EXCEPCION = '40/5';

for (const [conc, tabla] of [[20, DALSY_20], [40, DALSY_40]]) {
  test(`ibuprofeno ${conc} mg/mL: todas las filas de la ficha de Dalsy`, async ({ page }) => {
    await open(page);
    const fallos = [];
    for (const [kg, [lo, hi]] of Object.entries(tabla)) {
      const r = await page.evaluate(([k, c]) => calcIbuprofeno(k, 12, c), [Number(kg), conc]);
      const igual = r.lo === lo && r.hi === hi;
      if (`${conc}/${kg}` === EXCEPCION) {
        if (!(r.lo >= lo && r.hi <= hi && r.estimacion)) fallos.push(`${conc} mg/mL, ${kg} kg: debería quedar dentro de ${lo}–${hi} y marcada como estimación, dio ${r.lo}–${r.hi}`);
      } else if (!igual) fallos.push(`${conc} mg/mL, ${kg} kg: ficha ${lo}–${hi}, página ${r.lo}–${r.hi}`);
      else if (r.estimacion) fallos.push(`${conc} mg/mL, ${kg} kg: fila de la ficha marcada como estimación`);
      if (r.maxMl !== Math.round(hi * 3 * 10) / 10 && `${conc}/${kg}` !== EXCEPCION) fallos.push(`${conc} mg/mL, ${kg} kg: máximo diario ${r.maxMl}`);
    }
    expect(fallos, fallos.join('\n')).toEqual([]);
  });
}

test('ibuprofeno: entre filas es estimación y se avisa en pantalla', async ({ page }) => {
  await open(page);
  await fijar(page, 8.4, 8);
  await expect(page.locator('#ibu-est')).toHaveClass(/show/);
  await fijar(page, 9, 8);
  await expect(page.locator('#ibu-est')).not.toHaveClass(/show/);
});

// ── Paracetamol 100 mg/mL (Apiretal): 0,15 mL por kg, redondeado a la baja a 0,1 mL ──
const GUIA = { 3: 0.4, 6: 0.9, 9: 1.3, 12: 1.8, 15: 2.2, 18: 2.7, 21: 3.1, 24: 3.6, 27: 4, 30: 4.5 }; // tabla de la guía (mL)
test('paracetamol: filas de la guía de dosificación y límite de 32 kg', async ({ page }) => {
  await open(page);
  for (const [kg, ml] of Object.entries(GUIA)) {
    expect((await page.evaluate(k => calcParacetamol(k).ml, Number(kg))), `${kg} kg`).toBe(ml);
  }
  expect(await page.evaluate(() => calcParacetamol(32).ml)).toBe(4.8);
  expect(await page.evaluate(() => calcParacetamol(32.1).estado)).toBe('sin-calculo');
});

test('paracetamol: nunca más que los tramos de la ficha de Apiretal (como mucho 0,1 mL menos)', async ({ page }) => {
  await open(page);
  const TRAMOS = { 4: 0.6, 7: 1.0, 8: 1.2, 10.5: 1.6, 13: 2.0, 18.5: 2.8, 24: 3.6, 32: 4.8 };
  for (const [kg, ml] of Object.entries(TRAMOS)) {
    const web = await page.evaluate(k => calcParacetamol(k).ml, Number(kg));
    expect(web, `${kg} kg`).toBeLessThanOrEqual(ml);
    expect(ml - web, `${kg} kg`).toBeLessThan(0.15);
  }
});

// ── Interfaz ──
test('interfaz: 8,4 kg y 8 meses', async ({ page }) => {
  await open(page);
  await fijar(page, 8.4, 8);
  expect(await txt(page, '#para-ml')).toBe('1.2');
  expect(await txt(page, '#para-mg')).toBe('= 120 mg');
  expect(await txt(page, '#ibu-lo')).toBe('2.8');
  expect(await txt(page, '#ibu-hi')).toBe('4.2');
  await fijar(page, 8.4, 8, 'B');
  expect(await txt(page, '#ibu-lo')).toBe('1.4');
  expect(await txt(page, '#ibu-hi')).toBe('2.0');
});

test('límites del ibuprofeno: menos de 3 meses, menos de 5 kg y más de 30 kg', async ({ page }) => {
  await open(page);
  await fijar(page, 6, 2);
  expect(await visible(page, '#ibu-blocked')).toBe(true);
  expect(await txt(page, '#ibu-blocked-reason')).toContain('menores de 3 meses');
  await fijar(page, 4.9, 12);
  expect(await txt(page, '#ibu-blocked-reason')).toContain('menos de 5 kg');
  await fijar(page, 30.1, 60);
  expect(await txt(page, '#ibu-blocked-reason')).toContain('Por encima de 30 kg');
  await fijar(page, 6, 3);
  expect(await visible(page, '#ibu-blocked')).toBe(true);
  expect(await txt(page, '#ibu-blocked-reason')).toContain('AEP');
  expect(await txt(page, '#ibu-blocked-reason')).toContain('menores de 6 meses');
  await fijar(page, 6, 5);
  expect(await visible(page, '#ibu-blocked')).toBe(true);
  await fijar(page, 5, 6);
  expect(await visible(page, '#ibu-content')).toBe(true);
});

test('límite del paracetamol: más de 32 kg no calcula', async ({ page }) => {
  await open(page);
  await fijar(page, 40, 120);
  expect(await visible(page, '#para-blocked')).toBe(true);
  expect(await visible(page, '#para-content')).toBe(false);
  expect(await txt(page, '#para-blocked-reason')).toContain('hasta 32 kg');
});

test('avisos por edad y peso (fichas de Apiretal y Dalsy)', async ({ page }) => {
  await open(page);
  await fijar(page, 6, 8);
  expect(await txt(page, '#para-warn')).toContain('menores de 3 años');
  expect(await txt(page, '#para-warn')).toContain('supositorios');
  expect(await txt(page, '#ibu-warn')).toContain('menores de 2 años');
  await fijar(page, 6, 5);
  await expect(page.locator('#ibu-warn')).not.toHaveClass(/show/);
  await fijar(page, 14, 40);
  await expect(page.locator('#para-warn')).not.toHaveClass(/show/);
  await expect(page.locator('#ibu-warn')).not.toHaveClass(/show/);
});

test('página: fuentes enlazadas, fecha de revisión y textos retirados', async ({ page }) => {
  await open(page);
  const FUENTES = [
    'https://cima.aemps.es/cima/dochtml/ft/76028/FT_76028.html',
    'https://cima.aemps.es/cima/dochtml/p/76028/P_76028.html',
    'https://cima.aemps.es/cima/dochtml/ft/69726/FichaTecnica_69726.html',
    'https://cima.aemps.es/cima/dochtml/ft/59166/FichaTecnica_59166.html',
    'https://cima.aemps.es/cima/dochtml/ft/67875/FichaTecnica_67875.html',
    'https://www.aepap.org/sites/default/files/documento/archivos-adjuntos/20120530_guia_pediatria.pdf',
    'https://static.aeped.es/11_lactante_febril_4b1d3aeef7.pdf',
    'https://cdn.who.int/media/docs/default-source/child-growth/child-growth-standards/indicators/weight-for-age/wfa-girls-0-5-percentiles.pdf?sfvrsn=1a008a84_11',
    'https://cdn.who.int/media/docs/default-source/child-growth/child-growth-standards/indicators/weight-for-age/wfa-boys-0-5-percentiles.pdf?sfvrsn=488e74e6_11',
  ];
  for (const u of FUENTES) expect(await page.locator(`a[href="${u}"]`).count(), u).toBe(1);
  const body = (await page.locator('body').innerText()).replace(/\s+/g, ' ');
  expect(body).toContain('Última revisión: 15 de noviembre de 2026');
  expect(body).toContain('No se recomienda alternarlos de forma rutinaria');
  expect(body).not.toMatch(/Sí, puedes alternar|práctica segura|mín\. 4h|Actron|250 mg|basados en la AEP|fichas técnicas oficiales|72 horas|39,5|febrícula/);
  await expect(page.locator('.alt-pill')).toHaveCount(0);
});

test('mantener pulsado el selector de peso lo acelera', async ({ page }) => {
  await open(page);
  const box = await page.locator('#kg-p').boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  // Paso de 0,1 kg: a ritmo constante (150 ms) serían ~20 pasos = 10,0 kg; con aceleración (60 ms desde el paso 10), ~31 = 11,1 kg.
  await page.waitForTimeout(3000);
  await page.mouse.up();
  expect(parseFloat(await page.locator('#kg-v').innerText())).toBeGreaterThan(10.5);
});


// ── Peso para la edad: patrones OMS 2006, 0–60 meses (opción C, D7) ──
// Anclas copiadas de las tablas «Weight-for-age, birth to 5 years (percentiles)». mes: [niñas P3, P50, P97, niños P3, P50, P97] (kg)
const OMS_ANCLAS = {
  0:  [2.4, 3.2, 4.2, 2.5, 3.3, 4.3],
  6:  [5.8, 7.3, 9.2, 6.4, 7.9, 9.7],
  12: [7.1, 8.9, 11.3, 7.8, 9.6, 11.8],
  18: [8.2, 10.2, 13.0, 8.9, 10.9, 13.5],
  24: [9.2, 11.5, 14.6, 9.8, 12.2, 15.1],
  30: [10.1, 12.7, 16.2, 10.7, 13.3, 16.6],
  36: [11.0, 13.9, 17.8, 11.4, 14.3, 18.0],
  42: [11.8, 15.0, 19.5, 12.2, 15.3, 19.4],
  48: [12.5, 16.1, 21.1, 12.9, 16.3, 20.9],
  54: [13.2, 17.2, 22.8, 13.6, 17.3, 22.3],
  60: [14.0, 18.2, 24.4, 14.3, 18.3, 23.8],
};

test('OMS: 61 meses por tabla, valores crecientes y P3 < P50 < P97', async ({ page }) => {
  await open(page);
  const fallos = await page.evaluate(() => {
    const f = [];
    for (const [nombre, t] of [['niñas', OMS_NINAS], ['niños', OMS_NINOS]]) {
      for (const k of ['p3', 'p50', 'p97']) {
        if (t[k].length !== 61) f.push(`${nombre} ${k}: ${t[k].length} valores`);
        for (let m = 1; m < t[k].length; m++) if (t[k][m] < t[k][m - 1]) f.push(`${nombre} ${k}: baja en el mes ${m}`);
      }
      for (let m = 0; m < 61; m++) if (!(t.p3[m] < t.p50[m] && t.p50[m] < t.p97[m])) f.push(`${nombre}: P3 < P50 < P97 roto en el mes ${m}`);
    }
    return f;
  });
  expect(fallos, fallos.join('\n')).toEqual([]);
});

test('OMS: anclas cada 6 meses coinciden con las tablas', async ({ page }) => {
  await open(page);
  const fallos = [];
  for (const [mes, esperado] of Object.entries(OMS_ANCLAS)) {
    const real = await page.evaluate(m => [OMS_NINAS.p3[m], OMS_NINAS.p50[m], OMS_NINAS.p97[m], OMS_NINOS.p3[m], OMS_NINOS.p50[m], OMS_NINOS.p97[m]], Number(mes));
    if (JSON.stringify(real) !== JSON.stringify(esperado)) fallos.push(`mes ${mes}: tabla ${esperado}, página ${real}`);
  }
  expect(fallos, fallos.join('\n')).toEqual([]);
});

test('OMS: rango sin distinguir sexo, peso medio = menor P50 y sin datos fuera de 0–60 meses', async ({ page }) => {
  await open(page);
  // [mes, mínimo (menor P3), máximo (mayor P97), medio (menor P50)]. A 42 meses el mayor P97 es el de las niñas.
  const CASOS = [[0, 2.4, 4.3, 3.2], [6, 5.8, 9.7, 7.3], [42, 11.8, 19.5, 15.0], [60, 14.0, 24.4, 18.2]];
  for (const [m, lo, hi, med] of CASOS) {
    expect(await page.evaluate(x => omsPesoEdad(x), m), `${m} meses`).toEqual({ lo, hi, med });
  }
  expect(await page.evaluate(() => omsPesoEdad(61))).toBeNull();
  const sinFila = await page.evaluate(() => {
    const f = [];
    for (let m = 0; m <= 60; m++) if (KG_VALUES.indexOf(omsPesoEdad(m).med) < 0) f.push(m);
    return f;
  });
  expect(sinFila, 'meses cuyo peso medio no existe en el selector de kg').toEqual([]);
});

test('OMS: la página enseña el rango y avisa si los kg quedan fuera (12 meses: 7,1–11,8 kg)', async ({ page }) => {
  await open(page);
  await fijar(page, 9, 12);
  expect(await txt(page, '#oms-range')).toContain('7,1–11,8 kg');
  expect(await txt(page, '#oms-range')).toContain('percentiles 3 a 97');
  await expect(page.locator('#oms-warn')).not.toHaveClass(/show/);
  for (const kg of [7.1, 11.8]) {
    await fijar(page, kg, 12);
    await expect(page.locator('#oms-warn'), `${kg} kg`).not.toHaveClass(/show/);
  }
  await fijar(page, 7.0, 12);
  await expect(page.locator('#oms-warn')).toHaveClass(/show/);
  expect(await txt(page, '#oms-warn')).toContain('por debajo');
  await fijar(page, 11.9, 12);
  expect(await txt(page, '#oms-warn')).toContain('por encima');
  // El aviso no bloquea la dosis: sigue yendo por peso (11,9 kg × 0,15 mL, a la baja)
  expect(await txt(page, '#para-ml')).toBe('1.7');
});

test('OMS: el botón fija el peso medio y las dos tarjetas avisan de que no es el peso real', async ({ page }) => {
  await open(page);
  await fijar(page, 20, 12);
  await page.click('#oms-btn');
  expect(await txt(page, '#kg-v')).toBe('8.9');
  await expect(page.locator('#oms-warn')).not.toHaveClass(/show/);
  expect(await txt(page, '#para-warn')).toContain('peso medio de la OMS');
  expect(await txt(page, '#ibu-warn')).toContain('peso medio de la OMS');
  // Al mover los kg deja de ser el peso medio
  await page.click('#kg-p');
  expect(await txt(page, '#para-warn')).not.toContain('peso medio de la OMS');
  // Al cambiar la edad también
  await page.click('#oms-btn');
  expect(await txt(page, '#para-warn')).toContain('peso medio de la OMS');
  await page.click('#age-p');
  expect(await txt(page, '#para-warn')).not.toContain('peso medio de la OMS');
});

test('OMS: a partir de 61 meses no hay rango ni botón y la dosis sigue yendo por peso', async ({ page }) => {
  await open(page);
  await fijar(page, 20, 61);
  await expect(page.locator('#oms-btn')).toHaveClass(/hidden/);
  expect(await txt(page, '#oms-range')).toContain('hasta los 5 años');
  await expect(page.locator('#oms-warn')).not.toHaveClass(/show/);
  expect(await txt(page, '#para-ml')).toBe('3.0');
  await fijar(page, 20, 60);
  await expect(page.locator('#oms-btn')).not.toHaveClass(/hidden/);
});

test('OMS: la edad no cambia la cifra de la dosis, solo el peso', async ({ page }) => {
  await open(page);
  const dosis = [];
  for (const m of [12, 40, 100]) {
    await fijar(page, 14, m);
    dosis.push([await txt(page, '#para-ml'), await txt(page, '#ibu-lo'), await txt(page, '#ibu-hi')]);
  }
  expect(dosis[1]).toEqual(dosis[0]);
  expect(dosis[2]).toEqual(dosis[0]);
});
