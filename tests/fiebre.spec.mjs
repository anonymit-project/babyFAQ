import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const URL_PAGE = pathToFileURL(path.resolve('fiebre.html')).href;
const AEP = 'https://static.aeped.es/11_lactante_febril_4b1d3aeef7.pdf';
const AEMPS = 'https://cima.aemps.es/cima/dochtml/ft/76028/FT_76028.html';

async function open(page) {
  // Bloquea Analytics y fuentes: los tests no deben contar como visitas en GA4.
  await page.route(/googletagmanager\.com|google-analytics\.com|fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.goto(URL_PAGE, { waitUntil: 'domcontentloaded' });
}

// Fija edad (meses) y temperatura (°C) y vuelve a pintar.
const fijar = (page, meses, t) =>
  page.evaluate(([m, tt]) => { ageMonths = m; tempIdx = TEMP_VALUES.indexOf(tt); render(); }, [meses, t]);
const txt = async (page, sel) => (await page.locator(sel).innerText()).replace(/\s+/g, ' ').trim();

test('umbral de 38,0 °C en todas las edades: 37,9 no es fiebre y 38,0 sí', async ({ page }) => {
  await open(page);
  for (const meses of [0, 2, 3, 4, 12, 24, 30]) {
    await fijar(page, meses, 37.9);
    expect(await txt(page, '#verdict-title'), `${meses} m, 37,9`).toBe('Menos de 38 °C');
    await fijar(page, meses, 38.0);
    expect(await txt(page, '#verdict-title'), `${meses} m, 38,0`).toBe('Tiene fiebre');
  }
});

test('menores de 3 meses (hasta 3 m incluido) con 38 °C: urgencias, pruebas, ingreso y observación (AEP)', async ({ page }) => {
  await open(page);
  for (const meses of [0, 1, 2, 3]) {
    await fijar(page, meses, 38.0);
    await expect(page.locator('#verdict-block')).toHaveClass(/urgent/);
    await expect(page.locator('#action-block')).toHaveClass(/action-er/);
    const t = await txt(page, '#action-text');
    expect(await txt(page, '#action-title')).toContain('Urgencias');
    expect(t).toContain('21 días');
    expect(t).toContain('antibiótico e ingreso');
    expect(t).toContain('observación en el hospital');
  }
});

test('menores de 3 meses por debajo de 38 °C: aviso de mal aspecto y termómetro rectal', async ({ page }) => {
  await open(page);
  await fijar(page, 2, 37.5);
  const t = await txt(page, '#action-text');
  expect(t).toContain('mal aspecto');
  expect(t).toContain('termómetro rectal');
});

test('3–24 meses: 38,5 °C vigila; 39,0 °C consulta y orina; 48 horas y mal aspecto siempre presentes', async ({ page }) => {
  await open(page);
  await fijar(page, 8, 38.5);
  await expect(page.locator('#verdict-block')).not.toHaveClass(/urgent/);
  await expect(page.locator('#action-block')).toHaveClass(/action-watch/);
  let t = await txt(page, '#action-text');
  expect(t).toContain('39 °C');
  expect(t).toContain('48 horas');
  expect(t).toContain('mal aspecto');
  await fijar(page, 8, 39.0);
  await expect(page.locator('#action-block')).toHaveClass(/action-call/);
  t = await txt(page, '#action-text');
  expect(t).toContain('análisis de orina');
  expect(t).toContain('niñas menores de 24 meses');
  expect(t).toContain('niños menores de 12 meses');
  expect(t).toContain('sepsis');
});

test('más de 24 meses: la guía no da pautas y no se inventan umbrales', async ({ page }) => {
  await open(page);
  await fijar(page, 30, 40.5);
  const t = await txt(page, '#action-text');
  expect(t).toContain('hasta los 24 meses');
  expect(t).not.toMatch(/40 °C|39,5/);
});

test('conversor °C/°F', async ({ page }) => {
  await open(page);
  for (const [c, f] of [[37.0, '98.6'], [38.0, '100.4'], [39.0, '102.2'], [40.0, '104.0']]) {
    await fijar(page, 6, c);
    expect(await txt(page, '#disp-f'), `${c} °C`).toBe(f);
  }
});

test('nota de medicación: paracetamol <6 meses y ficha AEMPS <3 años solo con fiebre', async ({ page }) => {
  await open(page);
  await fijar(page, 4, 38.5);
  let n = await txt(page, '#context-note');
  expect(n).toContain('menores de 6 meses el protocolo indica paracetamol');
  expect(n).toContain('menores de 3 años solo por recomendación médica');
  expect(n).toContain('no es recomendable alternar');
  await fijar(page, 8, 38.5);
  n = await txt(page, '#context-note');
  expect(n).not.toContain('menores de 6 meses');
  expect(n).toContain('menores de 3 años');
  await fijar(page, 36, 38.5);
  expect(await txt(page, '#context-note')).not.toContain('menores de 3 años');
  await fijar(page, 4, 37.0);
  expect(await txt(page, '#context-note')).not.toContain('paracetamol');
});

test('página: fuentes enlazadas, fecha de revisión, FAQ idéntica al JSON-LD y textos retirados', async ({ page }) => {
  await open(page);
  expect(await page.locator(`a[href="${AEP}"]`).count()).toBe(1);
  expect(await page.locator(`a[href="${AEMPS}"]`).count()).toBe(1);
  const body = (await page.locator('body').innerText()).replace(/\s+/g, ' ');
  expect(body).toContain('Última revisión: 15 de noviembre de 2026');
  expect(body).not.toMatch(/subfebril|37,5|40,5|39,5|daño cerebral|42 ?°C|petequias/i);
  expect(body).not.toMatch(/\bAAP\b|\bOMS\b/);
  await expect(page.locator('#btn-rectal')).toHaveCount(0);
  const faq = await page.evaluate(() => {
    const d = [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => JSON.parse(s.textContent)).find(x => x['@type'] === 'FAQPage');
    return d.mainEntity.map(q => ({ q: q.name, a: q.acceptedAnswer.text }));
  });
  const visibles = await page.locator('.faq-item').evaluateAll(els => els.map(e => ({ q: e.querySelector('h3').innerText.trim(), a: e.querySelector('p').innerText.trim() })));
  expect(visibles).toEqual(faq);
});

test('mantener pulsado el selector de temperatura lo acelera', async ({ page }) => {
  await open(page);
  const box = await page.locator('#temp-p').boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  // Paso de 0,1 °C: a ritmo constante (150 ms) serían ~18 pasos = 39,8 °C; con aceleración (60 ms desde el paso 10), ~31 = 41,1 °C.
  await page.waitForTimeout(3000);
  await page.mouse.up();
  expect(parseFloat(await page.locator('#temp-v').innerText())).toBeGreaterThan(40.5);
});
