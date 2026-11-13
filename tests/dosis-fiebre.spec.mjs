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
  await fijar(page, 5, 3);
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
  await fijar(page, 6, 4);
  expect(await txt(page, '#para-warn')).toContain('menores de 3 años');
  expect(await txt(page, '#para-warn')).toContain('supositorios');
  expect(await txt(page, '#ibu-warn')).toContain('menores de 2 años');
  expect(await txt(page, '#ibu-warn')).toContain('24 horas');
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
  ];
  for (const u of FUENTES) expect(await page.locator(`a[href="${u}"]`).count(), u).toBe(1);
  const body = (await page.locator('body').innerText()).replace(/\s+/g, ' ');
  expect(body).toContain('Última revisión: 12 de noviembre de 2026');
  expect(body).toContain('No se recomienda alternarlos de forma rutinaria');
  expect(body).not.toMatch(/Sí, puedes alternar|práctica segura|mín\. 4h|Actron|250 mg|basados en la AEP|fichas técnicas oficiales|72 horas|39,5|febrícula/);
  await expect(page.locator('.alt-pill')).toHaveCount(0);
});

test('mantener pulsado el selector de peso lo acelera', async ({ page }) => {
  await open(page);
  const box = await page.locator('#kg-p').boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(1500);
  await page.mouse.up();
  expect(parseFloat(await page.locator('#kg-v').innerText())).toBeGreaterThan(9);
});
