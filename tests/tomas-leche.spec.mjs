import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const URL_PAGE = pathToFileURL(path.resolve('tomas-leche.html')).href;

async function open(page) {
  // Bloquea Analytics y fuentes: los tests no deben contar como visitas en GA4.
  await page.route(/googletagmanager\.com|google-analytics\.com|fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.goto(URL_PAGE, { waitUntil: 'domcontentloaded' });
}

async function goTo(page, prefix, target) {
  for (let i = 0; i < 200; i++) {
    const cur = parseFloat(await page.locator(`#${prefix}-val`).innerText());
    if (Math.abs(cur - target) < 0.001) return;
    await page.click(`#${prefix}-${cur < target ? 'plus' : 'minus'}`);
  }
  throw new Error(`No se alcanzó ${prefix}=${target}`);
}

const txt = async (page, sel) => (await page.locator(sel).innerText()).replace(/\s+/g, ' ').trim();
const capped = page => page.locator('#max-note').evaluate(e => e.classList.contains('visible'));

const FORMULA = [
  { age: 0,  kg: 3.5, ml: '55',  range: '50 – 60 ml',   tomas: '8–12', capped: false },
  { age: 1,  kg: 4.5, ml: '110', range: '95 – 125 ml',  tomas: '6–8',  capped: false },
  { age: 3,  kg: 6.0, ml: '165', range: '135 – 190 ml', tomas: '5–7',  capped: true  },
  { age: 6,  kg: 7.5, ml: '215', range: '190 – 240 ml', tomas: '4–5',  capped: true  },
  { age: 6,  kg: 5.5, ml: '205', range: '180 – 230 ml', tomas: '4–5',  capped: false },
];

for (const c of FORMULA) {
  test(`fórmula ${c.age} m / ${c.kg} kg`, async ({ page }) => {
    await open(page);
    await goTo(page, 'age', c.age);
    await goTo(page, 'kg', c.kg);
    expect(await txt(page, '#r-ml-toma')).toBe(c.ml);
    expect(await txt(page, '#r-ml-range')).toBe(c.range);
    expect(await txt(page, '#r-tomas')).toBe(c.tomas);
    expect(await capped(page)).toBe(c.capped);
  });
}

test('fórmula 10 m: referencia de 6 meses y el peso no interviene', async ({ page }) => {
  await open(page);
  await goTo(page, 'age', 10);
  for (const kg of [4.0, 9.0]) {
    await goTo(page, 'kg', kg);
    expect(await txt(page, '#r-ml-toma')).toBe('180–240');
    expect(await txt(page, '#r-tomas')).toBe('4–5');
    expect(await txt(page, '#r-interval')).toBe('—');
  }
});

for (const [age, ml] of [[1, '30'], [6, '80'], [12, '135']]) {
  test(`materna ${age} m → ${ml} ml`, async ({ page }) => {
    await open(page);
    await page.click('#btn-materna');
    await goTo(page, 'age', age);
    expect(await txt(page, '#r-ml-toma')).toBe(ml);
  });
}

test('la unidad "horas" aparece una sola vez con intervalo y ninguna sin él', async ({ page }) => {
  await open(page);
  const count = async () => ((await page.locator('.result-block').nth(2).innerText()).match(/horas/g) || []).length;
  expect(await count()).toBe(1);        // 1 mes: "3 – 4 horas"
  await goTo(page, 'age', 10);
  expect(await count()).toBe(0);        // sin intervalo
});

test('aviso de sólidos solo desde los 6 meses', async ({ page }) => {
  await open(page);
  await goTo(page, 'age', 5);
  await expect(page.locator('#solid-badge')).not.toHaveClass(/visible/);
  await goTo(page, 'age', 6);
  await expect(page.locator('#solid-badge')).toHaveClass(/visible/);
});

test('mantener pulsado el selector de peso lo acelera', async ({ page }) => {
  await open(page);
  const box = await page.locator('#kg-plus').boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(1500);
  await page.mouse.up();
  expect(parseFloat(await page.locator('#kg-val').innerText())).toBeGreaterThan(4.5);
});
