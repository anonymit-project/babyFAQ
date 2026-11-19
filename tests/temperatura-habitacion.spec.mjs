import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const URL_PAGE = pathToFileURL(path.resolve('temperatura-habitacion.html')).href;
const FUENTES = [
  'https://aepap.org/wp-content/uploads/2024/02/PSI-Consejos-generales-por-tramos-de-edad.pdf',
  'https://www.aap.org/en/patient-care/safe-sleep/',
  'https://publications.aap.org/pediatrics/article/150/1/e2022057990/188304/Sleep-Related-Infant-Deaths-Updated-2022?autologincheck=redirected',
  'https://www.lullabytrust.org.uk/baby-safety/baby-product-information/dress-your-baby-for-sleep/',
];

async function open(page) {
  // Bloquea Analytics y fuentes: los tests no deben contar como visitas en GA4.
  await page.route(/googletagmanager\.com|google-analytics\.com|fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.goto(URL_PAGE, { waitUntil: 'domcontentloaded' });
}

// Fija la temperatura (°C) y vuelve a pintar.
const fijar = (page, t) => page.evaluate(x => { temp = x; render(); }, t);
const txt = async (page, sel) => (await page.locator(sel).innerText()).replace(/\s+/g, ' ').trim();

test('tabla de togs orientativa: franjas contiguas de 14 a 30 °C, sin huecos', async ({ page }) => {
  await open(page);
  const esperado = t => (t >= 28 ? '0' : t >= 24 ? '0,5' : t >= 21 ? '1' : t >= 16 ? '2,5' : '3,5');
  for (let t = 14; t <= 30; t++) {
    await fijar(page, t);
    expect(await txt(page, '#tog-val'), `${t} °C`).toBe(esperado(t));
    expect(await txt(page, '#tog-name'), `${t} °C`).not.toBe('—');
  }
});

test('referencias: AEPap (22 °C) y Lullaby Trust (16–20 °C) comparadas sin juicio', async ({ page }) => {
  await open(page);
  for (const [t, a, l] of [
    [15, '7 °C por debajo de esa referencia', '1 °C por debajo de ese rango'],
    [16, '6 °C por debajo de esa referencia', 'Dentro de ese rango'],
    [20, '2 °C por debajo de esa referencia', 'Dentro de ese rango'],
    [22, 'Tu habitación está en esos 22 °C', '2 °C por encima de ese rango'],
    [25, '3 °C por encima de esa referencia', '5 °C por encima de ese rango'],
  ]) {
    await fijar(page, t);
    expect(await txt(page, '#ref-aepap'), `AEPap ${t}`).toBe(a);
    expect(await txt(page, '#ref-lullaby'), `Lullaby ${t}`).toBe(l);
  }
});

test('ejemplos de ropa en 3 tramos (Lullaby Trust), sin capas de más ni calcetines', async ({ page }) => {
  await open(page);
  await fijar(page, 15);
  let t = await txt(page, '#wear-items');
  for (const s of ['Pijama de una pieza y saco.', 'tog mayor', 'sin mantas encima del saco']) expect(t, s).toContain(s);
  await fijar(page, 18);
  expect(await txt(page, '#wear-items')).toBe('Pijama de una pieza y saco.');
  await fijar(page, 25);
  t = await txt(page, '#wear-items');
  expect(t).toContain('manga corta');
  expect(t).toContain('solo el pañal');
  for (const temp of [14, 18, 25, 30]) {
    await fijar(page, temp);
    expect(await txt(page, '#wear-items'), `${temp} °C`).not.toMatch(/calcetines|capa intermedia|pelele|grueso/i);
  }
});

test('página: etiqueta «no oficial», nota de la AAP, fuentes enlazadas, revisión y textos retirados', async ({ page }) => {
  await open(page);
  expect(await txt(page, '.tag-nooficial')).toBe('Orientación de babyFAQ, no oficial');
  for (const u of FUENTES) expect(await page.locator(`a[href="${u}"]`).count(), u).toBe(1);
  const body = (await page.locator('body').innerText()).replace(/\s+/g, ' ');
  for (const s of ['Última revisión: 18 de noviembre de 2026', 'La AAP no da una cifra de temperatura', 'ninguna de las dos es un organismo oficial',
    'Ni la AAP, ni la AEPap, ni la Lullaby Trust dan una tabla', 'Sigue siempre la etiqueta de tu saco', 'No sustituye']) expect(body, s).toContain(s);
  expect(body).not.toMatch(/azulad|moteada|normal|perfecta|óptima|más vendido|hidrat|ventilador|12–18|18–20|calcetines|capa intermedia|termorregulación|Lullaby Trust \(UK\)/i);
  expect(await page.locator('a[href*="amazon"], a[href*="amzn"], a[href*="tag="]').count()).toBe(0);
});

test('mantener pulsado el selector lo acelera (de 30 a 14 °C en menos de 3 s)', async ({ page }) => {
  await open(page);
  await fijar(page, 30);
  const box = await page.locator('#temp-m').boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  // A ritmo constante (180 ms) solo llegaría a 15 °C en 3 s; con aceleración (80 ms desde el paso 10) llega a 14 °C hacia los 2,5 s.
  await page.waitForTimeout(3000);
  await page.mouse.up();
  expect(await txt(page, '#temp-val')).toBe('14');
});
