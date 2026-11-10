import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const URL_PAGE = pathToFileURL(path.resolve('calculadora-lactancia.html')).href;

async function open(page) {
  await page.route(/googletagmanager\.com|google-analytics\.com|fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.goto(URL_PAGE, { waitUntil: 'domcontentloaded' });
}

// Tabla 1 de Koren 2002 (Can Fam Physician 48:39-41). Cada fila: kg y tiempos (h:mm) de 1..N bebidas.
// Las casillas que faltan hasta 12 están vacías en la fuente (= 24 h o más).
const FILAS = [
  [40.8, '2:50 5:40 8:30 11:20 14:10 17:00 19:51 22:41'],
  [43.1, '2:46 5:32 8:19 11:05 13:52 16:38 19:25 22:11'],
  [45.4, '2:42 5:25 8:08 10:51 13:34 16:17 19:00 21:43'],
  [47.6, '2:39 5:19 7:58 10:38 13:18 15:57 18:37 21:16 23:56'],
  [49.9, '2:36 5:12 7:49 10:25 13:01 15:38 18:14 20:50 23:27'],
  [52.2, '2:33 5:06 7:39 10:12 12:46 15:19 17:52 20:25 22:59'],
  [54.4, '2:30 5:00 7:30 10:00 12:31 15:01 17:31 20:01 22:32'],
  [56.7, '2:27 4:54 7:22 9:49 12:16 14:44 17:11 19:38 22:06'],
  [59.0, '2:24 4:49 7:13 9:38 12:03 14:27 16:52 19:16 21:41'],
  [61.2, '2:21 4:43 7:05 9:27 11:49 14:11 16:33 18:55 21:17 23:39'],
  [63.5, '2:19 4:38 6:58 9:17 11:37 13:56 16:15 18:35 20:54 23:14'],
  [65.8, '2:16 4:33 6:50 9:07 11:24 13:41 15:58 18:15 20:32 22:49'],
  [68.0, '2:14 4:29 6:43 8:58 11:12 13:27 15:41 17:56 20:10 22:25'],
  [70.3, '2:12 4:24 6:36 8:48 11:01 13:13 15:25 17:37 19:49 22:02'],
  [72.6, '2:10 4:20 6:30 8:40 10:50 13:00 15:10 17:20 19:30 21:40 23:50'],
  [74.8, '2:07 4:15 6:23 8:31 10:39 12:47 14:54 17:02 19:10 21:18 23:50'],
  [77.1, '2:05 4:11 6:17 8:23 10:28 12:34 14:40 16:46 18:51 20:57 23:03'],
  [79.3, '2:03 4:07 6:11 8:14 10:18 12:22 14:26 16:29 18:33 20:37 22:40'],
  [81.6, '2:01 4:03 6:05 8:07 10:08 12:10 14:12 16:14 18:15 20:17 22:19'],
  [83.9, '1:59 3:59 5:59 7:59 9:59 11:59 13:59 15:59 17:58 19:58 21:58 23:58'],
  [86.2, '1:58 3:56 5:54 7:52 9:50 11:48 13:46 15:44 17:42 19:40 21:38 23:36'],
  [88.5, '1:56 3:52 5:48 7:44 9:41 11:37 13:33 15:29 17:26 19:22 21:18 23:14'],
  [90.7, '1:54 3:49 5:43 7:38 9:32 11:27 13:21 15:16 17:10 19:05 20:59 22:54'],
  [93.0, '1:52 3:45 5:38 7:31 9:24 11:17 13:09 15:02 16:55 18:48 20:41 22:34'],
  [95.3, '1:51 3:42 5:33 7:24 9:16 11:07 12:58 14:49 16:41 18:32 20:23 22:14'],
];
// Errata de la fuente: 74,8 kg / 11 bebidas dice 23:50, pero su fila da ≈23:26 (21:18 + 2:08). Se omite.
const ERRATA = new Set(['74.8/11']);
const hm = s => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
const TABLA = FILAS.map(([kg, s]) => [kg, s.split(' ').map(hm)]);
const minutos = s => { const [, h = '0', m = '0'] = s.match(/^(?:(\d+)h)?\s*(?:(\d+)m)?$/); return +h * 60 + +m; };

test('la tabla tiene 25 filas y 255 casillas con tiempo', () => {
  expect(TABLA.length).toBe(25);
  expect(TABLA.reduce((s, [, t]) => s + t.length, 0)).toBe(255);
});

test('Tabla 1 de Koren: 300 casillas (±1 min; vacías = sin cálculo)', async ({ page }) => {
  await open(page);
  const res = await page.evaluate(tabla => tabla.map(([kg]) =>
    Array.from({ length: 12 }, (_, i) => {
      const r = calcularEspera(kg, (i + 1) * KOREN.gramosBebida, 0);
      return { estado: r.estado, motivo: r.motivo, min: r.totalMin ? Math.ceil(r.totalMin - 1e-9) : null };
    })), TABLA);
  const fallos = [];
  TABLA.forEach(([kg, tiempos], f) => {
    for (let n = 1; n <= 12; n++) {
      const r = res[f][n - 1];
      if (n > tiempos.length) {
        if (r.estado !== 'sin-calculo' || r.motivo !== 'duracion') fallos.push(`${kg} kg, ${n} bebidas: esperaba sin cálculo (casilla vacía), dio ${r.estado}`);
      } else if (!ERRATA.has(`${kg}/${n}`)) {
        if (r.estado === 'sin-calculo' || Math.abs(r.min - tiempos[n - 1]) > 1) fallos.push(`${kg} kg, ${n} bebidas: tabla ${tiempos[n - 1]} min, página ${r.min}`);
      }
    }
  });
  expect(fallos, fallos.join('\n')).toEqual([]);
});

test('ejemplos de la propia tabla (3 bebidas 40,8 kg y 95,3 kg)', async ({ page }) => {
  await open(page);
  const [a, b] = await page.evaluate(() => [40.8, 95.3].map(kg => Math.ceil(calcularEspera(kg, 3 * KOREN.gramosBebida, 0).totalMin)));
  expect(Math.abs(a - (8 * 60 + 30))).toBeLessThanOrEqual(1);
  expect(Math.abs(b - (5 * 60 + 33))).toBeLessThanOrEqual(1);
});

test('límites: peso fuera de rango, más de 12 bebidas y casilla de 24 h', async ({ page }) => {
  await open(page);
  const r = await page.evaluate(() => [
    calcularEspera(40.7, KOREN.gramosBebida, 0).motivo,
    calcularEspera(95.4, KOREN.gramosBebida, 0).motivo,
    calcularEspera(63.5, 12.5 * KOREN.gramosBebida, 0).estado,
    calcularEspera(63.5, 13 * KOREN.gramosBebida, 0).motivo,
    calcularEspera(40.8, 9 * KOREN.gramosBebida, 0).motivo,
  ]);
  expect(r).toEqual(['peso', 'peso', 'todavia', 'bebidas', 'duracion']);
});

// ── Interfaz real ──
async function preparar(page, { kg, cerveza340 = 1, ml = 340, h = '', m = '' }) {
  await page.fill('#weight', String(kg));
  await page.fill('#hours', String(h));
  await page.fill('#minutes', String(m));
  await page.evaluate(([c, mlv]) => {
    const d = DRINKS[0];
    st.beer.count = c;
    st.beer.mlIdx = d.mlValues.indexOf(mlv);
    st.beer.gradIdx = d.gradValues.findIndex(v => Math.abs(v - 5) < 1e-6);
  }, [cerveza340, ml]);
  await page.click('.cta-btn');
}
const clase = page => page.locator('#result').getAttribute('class');
const txt = async (page, sel) => (await page.locator(sel).innerText()).replace(/\s+/g, ' ').trim();

test('1 cerveza de 340 ml al 5 %, 63,5 kg: ≈2h 19m (±1) y sin aviso de estimación', async ({ page }) => {
  await open(page);
  await preparar(page, { kg: 63.5 });
  expect(await clase(page)).toMatch(/careful/);
  expect(await txt(page, '#result-headline')).toBe('Todavía no');
  expect(Math.abs(minutos(await txt(page, '#result-time')) - (2 * 60 + 19))).toBeLessThanOrEqual(2);
  expect(await txt(page, '#result-estimate')).toBe('');
});

test('los tres mensajes de rango: todavía no / espera un poco más / ya ha pasado', async ({ page }) => {
  await open(page);
  await preparar(page, { kg: 63.5, h: 1, m: 40 });
  expect(await clase(page)).toMatch(/wait/);
  expect(await txt(page, '#result-headline')).toBe('Espera un poco más');
  await preparar(page, { kg: 63.5, h: 3 });
  expect(await clase(page)).toMatch(/safe/);
  expect(await txt(page, '#result-headline')).toBe('Ya ha pasado el tiempo de la tabla');
  expect(await txt(page, '#result-time')).toBe('');
});

test('menos de 1 bebida: estimación marcada', async ({ page }) => {
  await open(page);
  await preparar(page, { kg: 63.5, ml: 170 });
  expect(await txt(page, '#result-estimate')).toContain('Estimación de babyFAQ');
  expect(await txt(page, '#result-estimate')).toContain('por debajo de la primera columna');
});

test('sin cálculo: peso fuera de rango, 13 bebidas y casilla vacía; no se muestra tiempo', async ({ page }) => {
  await open(page);
  for (const cfg of [{ kg: 40 }, { kg: 96 }, { kg: 63.5, cerveza340: 13 }, { kg: 40.8, cerveza340: 9 }]) {
    await preparar(page, cfg);
    expect(await clase(page)).toMatch(/nocalc/);
    expect(await txt(page, '#result-headline')).toBe('Sin cálculo para este caso');
    expect(await txt(page, '#result-time')).toBe('');
  }
});
