import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const URL_PAGE = pathToFileURL(path.resolve('percentil.html')).href;

async function open(page) {
  // Bloquea Analytics y fuentes: los tests no deben contar como visitas en GA4.
  await page.route(/googletagmanager\.com|google-analytics\.com|fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.goto(URL_PAGE, { waitUntil: 'domcontentloaded' });
}

// Filas [mes, L, M, S] copiadas de las tablas OMS 2006 (z-scores; PDF). WAB/WAG = peso niños/niñas;
// HAB/HAG = longitud (0–23 meses) y altura (desde 24 meses) niños/niñas.
const ANCLAS = {
  WAB: [[0,0.3487,3.3464,0.14602],[6,0.1257,7.9340,0.10958],[12,0.0644,9.6479,0.10925],[23,-0.0083,11.9514,0.11369],[24,-0.0137,12.1515,0.11426],[36,-0.0689,14.3429,0.12116],[48,-0.1131,16.3489,0.12759],[60,-0.1506,18.3366,0.13517]],
  WAG: [[0,0.3809,3.2322,0.14171],[6,-0.0756,7.2970,0.12204],[12,-0.2024,8.9481,0.12268],[23,-0.2903,11.2688,0.12369],[24,-0.2941,11.4775,0.12390],[36,-0.3201,13.8503,0.12919],[48,-0.3361,16.0697,0.13884],[60,-0.3518,18.2193,0.14821]],
  HAB: [[0,1,49.8842,0.03795],[6,1,67.6236,0.03165],[12,1,75.7488,0.03137],[23,1,86.9410,0.03445],[24,1,87.1161,0.03507],[36,1,96.0835,0.03858],[48,1,103.3273,0.04059],[60,1,109.9638,0.04214]],
  HAG: [[0,1,49.1477,0.03790],[6,1,65.7311,0.03448],[12,1,74.0150,0.03479],[23,1,85.5202,0.03711],[24,1,85.7153,0.03764],[36,1,95.0515,0.04006],[48,1,102.7312,0.04193],[60,1,109.4233,0.04347]],
};

test('cada tabla tiene 61 filas mensuales, de 0 a 60 meses, sin saltos', async ({ page }) => {
  await open(page);
  const meses = await page.evaluate(() => Object.fromEntries(Object.entries(LMS).map(([k, rows]) => [k, rows.map(r => r[0])])));
  expect(Object.keys(meses).sort()).toEqual(['HAB', 'HAG', 'WAB', 'WAG']);
  for (const k of Object.keys(meses)) expect(meses[k], k).toEqual(Array.from({ length: 61 }, (_, i) => i));
});

test('filas ancla (0, 6, 12, 23, 24, 36, 48 y 60 meses) idénticas a las tablas de la OMS', async ({ page }) => {
  await open(page);
  const fallos = [];
  for (const [k, filas] of Object.entries(ANCLAS)) {
    for (const f of filas) {
      const real = await page.evaluate(([t, m]) => LMS[t].find(r => r[0] === m), [k, f[0]]);
      if (JSON.stringify(real) !== JSON.stringify(f)) fallos.push(`${k} mes ${f[0]}: OMS ${JSON.stringify(f)}, página ${JSON.stringify(real)}`);
    }
  }
  expect(fallos, fallos.join('\n')).toEqual([]);
});

// Valores de las columnas -2 DE, mediana y +2 DE de las tablas OMS (redondeados a 0,1): P2, P50 y P98 con ±1 punto.
test('percentiles en -2 DE, mediana y +2 DE a 60 meses, y mediana de longitud (23 m) y altura (24 m)', async ({ page }) => {
  await open(page);
  const CASOS = [
    ['WAG', 13.7, 60, 2], ['WAG', 18.2, 60, 50], ['WAG', 24.9, 60, 98],
    ['WAB', 14.1, 60, 2], ['WAB', 18.3, 60, 50], ['WAB', 24.2, 60, 98],
    ['HAG', 99.9, 60, 2], ['HAG', 109.4, 60, 50], ['HAG', 118.9, 60, 98],
    ['HAB', 100.7, 60, 2], ['HAB', 110.0, 60, 50], ['HAB', 119.2, 60, 98],
    ['HAG', 85.7, 24, 50], ['HAB', 87.1, 24, 50], ['HAG', 85.5, 23, 50], ['HAB', 86.9, 23, 50],
  ];
  const fallos = [];
  for (const [t, x, m, esperado] of CASOS) {
    const pct = await page.evaluate(([tt, xx, mm]) => calcPercentile(xx, tt, mm).pct, [t, x, m]);
    if (Math.abs(pct - esperado) > 1) fallos.push(`${t} ${x} a ${m} meses: esperaba P${esperado}, dio P${pct}`);
  }
  expect(fallos, fallos.join('\n')).toEqual([]);
});
