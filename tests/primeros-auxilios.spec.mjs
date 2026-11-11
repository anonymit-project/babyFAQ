import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const URL_PAGE = pathToFileURL(path.resolve('primeros-auxilios.html')).href;
const ERC = 'https://www.erc.edu/media/vatl54cg/01_gl2025_exec-summary_es_v10.pdf';
const AEP = 'https://static.aeped.es/capitulo_5_0_b962064ae5.pdf';
const TABS = { 'atragan-bebe': 0, 'atragan-nino': 1, 'rcp-bebe': 2, 'rcp-nino': 3, quemadura: 4, caida: 5 };

async function open(page) {
  // Bloquea Analytics y fuentes: los tests no deben contar como visitas en GA4.
  await page.route(/googletagmanager\.com|google-analytics\.com|fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.goto(URL_PAGE, { waitUntil: 'domcontentloaded' });
}

async function protocolo(page, id) {
  await page.locator('.emergency-tab').nth(TABS[id]).click();
  return (await page.locator('#protocol-output').innerText()).replace(/\s+/g, ' ').trim();
}

test('hay 6 protocolos y cada uno enseña su fuente y al menos 4 pasos', async ({ page }) => {
  await open(page);
  expect(await page.locator('.emergency-tab').count()).toBe(6);
  for (const id of Object.keys(TABS)) {
    const t = await protocolo(page, id);
    expect(t, id).toContain('Fuente:');
    expect(await page.locator('.step-item').count(), id).toBeGreaterThanOrEqual(4);
  }
});

for (const id of ['rcp-bebe', 'rcp-nino']) {
  test(`${id}: 5 ventilaciones iniciales, 30:2 y llamada con móvil (ERC 2025 y AEP)`, async ({ page }) => {
    await open(page);
    const t = await protocolo(page, id);
    expect(t).toContain('5 ventilaciones de rescate');
    expect(t).not.toMatch(/2 ventilaciones de rescate/);
    expect(t).toContain('30 compresiones y 2 ventilaciones (30:2)');
    expect(t).toContain('100–120 por minuto');
    expect(t).toContain('al menos un tercio de la profundidad del tórax');
    expect(t).toContain('aproximadamente 1 segundo');
    expect(t).toContain('no más de 10 segundos');
    expect(t).toContain('no tienes móvil');
    expect(t).not.toMatch(/mejillas|pulso|planta del pie/);
    expect(t).toContain('modo pediátrico');
  });
}

test('RCP bebé: dos pulgares con las manos rodeando el tórax, no dos dedos', async ({ page }) => {
  await open(page);
  const t = await protocolo(page, 'rcp-bebe');
  expect(t).toContain('dos pulgares');
  expect(t).toContain('manos rodeando el tórax');
  expect(t).not.toMatch(/2 dedos \(índice y corazón\)/);
  expect(t).not.toContain('línea que une los dos pezones');
});

test('RCP niño: una mano o dos manos y sin cifras sin respaldo', async ({ page }) => {
  await open(page);
  const t = await protocolo(page, 'rcp-nino');
  expect(t).toContain('una mano o dos manos');
  expect(t).toContain('5–6 cm');
  expect(t).not.toMatch(/mayores de 8 años|técnica de adulto|Brazo recto/);
});

test('quemadura: 10–20 minutos y sin remedios sin respaldo', async ({ page }) => {
  await open(page);
  const t = await protocolo(page, 'quemadura');
  expect(t).toContain('10–20 minutos');
  expect(t).toContain('mínimo de 20 minutos');
  expect(t).not.toMatch(/exactos|ni más ni menos|hielo|helada/);
  expect(await page.locator('.emergency-tab').nth(TABS.quemadura).innerText()).toContain('10–20 minutos');
});

test('caída: el chichón blando es señal de aviso y vigilancia 24–48 h', async ({ page }) => {
  await open(page);
  const t = await protocolo(page, 'caida');
  expect(t).toContain('va a más, se hace largo o blando');
  expect(t).toContain('24–48');
  expect(t).toContain('un par de veces por la noche');
  expect(t).not.toMatch(/blando es normal|buena señal|cada 2–3 horas/);
});

test('atragantamiento bebé: compresiones del pecho según la AEP', async ({ page }) => {
  await open(page);
  const t = await protocolo(page, 'atragan-bebe');
  expect(t).toContain('hundirse ligeramente');
  expect(t).toContain('barrido a ciegas');
  expect(t).not.toMatch(/4 cm|línea de los pezones/);
  expect(t).toContain('cada 2 minutos');
});

test('página: fuentes enlazadas, fecha de revisión y sin textos retirados', async ({ page }) => {
  await open(page);
  expect(await page.locator(`a[href="${ERC}"]`).count()).toBe(1);
  expect(await page.locator(`a[href="${AEP}"]`).count()).toBe(1);
  expect(await page.locator('a[href="tel:112"]').count()).toBeGreaterThan(0);
  const body = (await page.locator('body').innerText()).replace(/\s+/g, ' ');
  expect(body).toContain('Última revisión: 11 de noviembre de 2026');
  expect(body).not.toMatch(/ERC 2021|multiplica por dos o tres|Nunca uses hielo|4 a 8 horas/);
  const diff = (await page.locator('.diff-card').innerText()).replace(/\s+/g, ' ');
  expect(diff).not.toMatch(/4 cm|5 cm|2 dedos en el centro/);
});
