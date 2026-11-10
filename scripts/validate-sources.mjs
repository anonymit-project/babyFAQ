#!/usr/bin/env node
// Comprueba que las fuentes del inventario responden y que la cita literal aparece en el texto.
import { readFileSync } from 'node:fs';

const slugs = process.argv.slice(2).length ? process.argv.slice(2) : ['tomas-leche', 'calculadora-lactancia'];
const inventario = JSON.parse(readFileSync('data/inventario.json', 'utf8'));
const norm = s => s
  .replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&frac12;/g, '½').replace(/&#189;/g, '½')
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
  .replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\u00a0/g, ' ')
  .replace(/\s+½/g, '½').replace(/\s+/g, ' ').toLowerCase().trim();

const gh = process.env.GITHUB_ACTIONS;
let errors = 0, warnings = 0;

async function get(url) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; babyFAQ-validator)' }, signal: AbortSignal.timeout(20000) });
      if (r.ok) return { html: await r.text() };
      if (i === 2) return { error: `HTTP ${r.status}` };
    } catch (e) { if (i === 2) return { error: e.message }; }
    await new Promise(r => setTimeout(r, 2000));
  }
}

for (const slug of slugs) {
  const tool = inventario.herramientas.find(h => h.slug === slug);
  if (!tool) { console.error(`✗ ${slug}: no está en el inventario`); errors++; continue; }
  console.log(`\n${slug}`);
  for (const f of tool.fuentes || []) {
    const res = await get(f.fuente_url);
    if (res.error) {
      warnings++;
      console.warn(`  ! no se pudo comprobar (${res.error}): ${f.fuente_url}`);
      if (gh) console.log(`::warning::Fuente sin comprobar (${res.error}): ${f.fuente_url}`);
      continue;
    }
    if (norm(res.html).includes(norm(f.cita_literal_breve))) console.log(`  ✓ cita encontrada en ${f.fuente_organismo}: ${f.fuente_url}`);
    else {
      errors++;
      console.error(`  ✗ cita NO encontrada en ${f.fuente_url}: "${f.cita_literal_breve}"`);
      if (gh) console.log(`::error::Cita no encontrada en ${f.fuente_url}`);
    }
  }
}
console.log(`\n${errors} error(es), ${warnings} aviso(s) (un aviso = fuente sin poder comprobar, no es error de datos).`);
process.exit(errors ? 1 : 0);
