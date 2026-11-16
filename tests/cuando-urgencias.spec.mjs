import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const URL_PAGE = pathToFileURL(path.resolve('cuando-urgencias.html')).href;
const AEP = 'https://static.aeped.es/capitulo_5_0_b962064ae5.pdf';

async function open(page) {
  // Bloquea Analytics y fuentes: los tests no deben contar como visitas en GA4.
  await page.route(/googletagmanager\.com|google-analytics\.com|fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.goto(URL_PAGE, { waitUntil: 'domcontentloaded' });
}

// Filtra por nombre, abre el único síntoma que queda y devuelve su texto visible.
async function ficha(page, nombre) {
  await page.fill('#search', nombre);
  await page.locator('.symptom-header').first().click();
  return (await page.locator('.symptom-content.open').innerText()).replace(/\s+/g, ' ').trim();
}
const niv = (page, sev) => page.locator(`.symptom-content.open .level-block.${sev}`).count();

test('golpe en la cabeza: signos de alarma y observación de la AEP, sin umbrales sin fuente', async ({ page }) => {
  await open(page);
  const t = await ficha(page, 'golpe en la cabeza');
  for (const s of ['Lactante menor de 1 año', 'alto impacto', 'más de 1 metro de altura', 'persistentes', 'líquido claro',
    'va a más, se hace largo o blando', '24–48 horas', 'cada 2–3 horas', 'un par de veces por la noche']) expect(t, s).toContain(s);
  expect(t).not.toMatch(/fontanela|más de 2|1–1,5|nuca|cama en menores|llora mucho más|se calma/);
  expect(await niv(page, 'red')).toBe(1);
  expect(await niv(page, 'amber')).toBe(0);
  expect(await niv(page, 'green')).toBe(1);
});

test('golpe en extremidades: signos y derivación de la AEP, sin criterios sin respaldo', async ({ page }) => {
  await open(page);
  const t = await ficha(page, 'golpe en extremidades');
  for (const s of ['fractura abierta', 'perdido su alineación', 'Palidez o frialdad en los dedos', 'centro sanitario u hospital más cercano',
    'por si necesita operación', 'no da criterios para golpes leves']) expect(t, s).toContain(s);
  expect(t).not.toMatch(/codo de niñera|subluxación|1–2 horas|hielo|elevación|muy intenso/);
  expect(await niv(page, 'red')).toBe(1);
  expect(await niv(page, 'amber')).toBe(1);
  expect(await niv(page, 'green')).toBe(0);
});

test('quemaduras: zonas de riesgo, eléctrica y enfriado según la AEP; sin tamaños ni edad', async ({ page }) => {
  await open(page);
  const t = await ficha(page, 'quemaduras');
  for (const s of ['llama siempre al 112', 'zonas de especial riesgo', 'palmas, plantas', 'avisa siempre al 112/061', 'centro hospitalario más cercano',
    '10–20 minutos', 'mínimo 20 minutos', 'No rompas las ampollas', '2.º grado', 'crema hidratante']) expect(t, s).toContain(s);
  expect(t).not.toMatch(/\b5 ?%|\b[35] cm|menor de 1 año|marrón|pomada|hielo|48 h/);
  expect(await niv(page, 'red')).toBe(1);
  expect(await niv(page, 'amber')).toBe(1);
  expect(await niv(page, 'green')).toBe(1);
});

test('página: enlaza el capítulo de la AEP una sola vez', async ({ page }) => {
  await open(page);
  expect(await page.locator(`a[href="${AEP}"]`).count()).toBe(1);
});
