#!/usr/bin/env node
// Compara el HTML original de una herramienta con el generado por Eleventy.
// Uso: node scripts/compare-equivalence.mjs [original.html generado.html]
import { readFileSync } from 'node:fs';

const [orig = 'legacy/talla-zapato.original.html', built = '_site/talla-zapato.html'] = process.argv.slice(2);
const A = readFileSync(orig, 'utf8');
const B = readFileSync(built, 'utf8');

// Desviaciones deliberadas del piloto (documentadas en docs/09-decisiones.md):
//  1) h2 nuevo sobre las FAQ  2) línea "Última revisión"  3) FAQPage generado desde el texto visible.
const H2_NUEVO = 'Preguntas frecuentes sobre los zapatos de bebé';
const REVISION = /Última revisión: \d{1,2} de \w+ de \d{4}/;

// D26c (2026-11-22): el texto informativo (desde el primer h2) se reescribió con la AAP y ya no se compara
// con el original. La zona de la herramienta sí, salvo estas dos sustituciones declaradas.
const PRIMER_H2 = 'Cómo elegir el zapato correcto para tu bebé';
const CAMBIOS_ZONA = [
  ['Añade 5 mm para holgura.', 'Introduce esa medida tal cual, sin añadir holgura.'],
  ['Las tallas varían según fabricante. Úsalas como referencia y comprueba siempre antes de comprar. Los rangos de edad son orientativos — cada bebé crece a su ritmo.',
   'Tabla orientativa elaborada por babyFAQ a partir de equivalencias habituales entre sistemas de tallas, sin respaldo de ningún organismo. Las tallas varían según fabricante: úsalas como referencia y comprueba siempre al probar el zapato. Los rangos de edad también son orientativos: cada bebé crece a su ritmo.'],
];
const RETIRADOS = ['propiocepción', 'Añade 5', '10–15 mm', 'cada 3–4 meses', 'moldeable', 'pie izquierdo y el derecho'];
const PORTADAS = ['https://www.aeped.es', 'https://www.healthychildren.org', 'https://www.mscbs.gob.es'];
const FUENTE_AAP = 'https://www.healthychildren.org/English/ages-stages/toddler/Pages/Shoes-for-Active-Toddlers.aspx';

let errors = 0;
const fail = m => { errors++; console.error(`  ✗ ${m}`); if (process.env.GITHUB_ACTIONS) console.log(`::error::${m}`); };
const ok = m => console.log(`  ✓ ${m}`);
const norm = s => s.replace(/\s+/g, ' ').trim();
const body = h => h.split(/<body[^>]*>/i)[1] ?? h;
const tagsOf = (h, n) => [...h.matchAll(new RegExp(`<${n}\\b[^>]*>`, 'gi'))].map(m => norm(m[0])).sort();
const diffArr = (a, b) => {
  const rest = [...b], falta = [];
  for (const x of a) { const i = rest.indexOf(x); if (i < 0) falta.push(x); else rest.splice(i, 1); }
  return `\n      solo en el original: ${JSON.stringify(falta).slice(0, 400)}\n      solo en el generado: ${JSON.stringify(rest).slice(0, 400)}`;
};
const cmpList = (a, b, nombre) =>
  JSON.stringify(a) === JSON.stringify(b) ? ok(`${nombre} idéntico (${a.length})`) : fail(`${nombre} distinto${diffArr(a, b)}`);

// ── Cabecera ──
cmpList([/<html[^>]*\blang="es"/.test(A)], [/<html[^>]*\blang="es"/.test(B)], 'lang="es"');
cmpList([norm((A.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || '')], [norm((B.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || '')], 'title');
cmpList(tagsOf(A, 'meta'), tagsOf(B, 'meta'), 'meta tags');
cmpList(tagsOf(A, 'link'), tagsOf(B, 'link'), 'link tags');

// ── JSON-LD (salvo FAQPage) y scripts en línea ──
const scripts = h => [...h.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].map(m => ({ attrs: m[1], code: m[2] }));
const ld = h => scripts(h).filter(s => /ld\+json/.test(s.attrs)).map(s => JSON.parse(s.code)).filter(d => d['@type'] !== 'FAQPage').map(d => JSON.stringify(d));
const inline = h => scripts(h).filter(s => !/src=|ld\+json/.test(s.attrs)).map(s => norm(s.code));
cmpList(ld(A), ld(B), 'JSON-LD (sin FAQPage)');
cmpList(inline(A), inline(B), 'JS en línea (GA + herramienta)');

// ── CSS: mismas reglas aunque cambie el orden o el reparto entre ficheros ──
const css = h => [...h.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]).join('\n').replace(/\/\*[\s\S]*?\*\//g, '');
const reglas = c => [...c.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
  .map(m => `${norm(m[1]).replace(/\s*,\s*/g, ',')}{${norm(m[2]).replace(/\s*([:;,])\s*/g, '$1').replace(/;$/, '')}}`).sort();
const medias = c => [...new Set([...c.matchAll(/@media[^{]*/g)].map(m => norm(m[0])))].sort();
cmpList(reglas(css(A)), reglas(css(B)), 'reglas CSS');
cmpList(medias(css(A)), medias(css(B)), 'media queries');

// ── Estructura y texto ──
const ids = h => [...body(h).matchAll(/\sid="([^"]+)"/g)].map(m => m[1]).sort();
const aria = h => [...body(h).matchAll(/aria-label="([^"]+)"/g)].map(m => m[1]).sort();
cmpList(ids(A), ids(B), 'ids');
cmpList(aria(A), aria(B), 'aria-labels');

const text = h => norm(body(h).replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' '));
const zona = t => t.split(PRIMER_H2)[0];
let tA = zona(text(A));
for (const [de, a] of CAMBIOS_ZONA) {
  if (!tA.includes(de)) fail(`el original ya no contiene el texto sustituido: "${de.slice(0, 50)}…"`);
  tA = tA.replace(de, a);
}
const tB = zona(text(B));
if (norm(tA) === tB) ok(`zona de la herramienta idéntica (${tB.split(' ').length} palabras, salvo ${CAMBIOS_ZONA.length} sustituciones declaradas)`);
else {
  let i = 0; while (i < tA.length && tA[i] === tB[i]) i++;
  fail(`zona de la herramienta distinta desde el carácter ${i}:\n      original: …${tA.slice(Math.max(0, i - 40), i + 80)}\n      generado: …${tB.slice(Math.max(0, i - 40), i + 80)}`);
}

// Texto informativo reescrito (D26c): se comprueban la fuente, la revisión y que no queden textos retirados.
const tBfull = text(B);
if (!tBfull.includes(PRIMER_H2)) fail(`falta el h2 «${PRIMER_H2}» en el generado`);
if (!REVISION.test(tBfull)) fail('falta "Última revisión: fecha" en el generado');
if (!tBfull.includes(H2_NUEVO)) fail('falta el h2 de preguntas frecuentes en el generado');
const retirados = RETIRADOS.filter(s => tBfull.includes(s));
if (retirados.length) fail(`textos retirados en D26c que siguen en la página: ${retirados.join(' | ')}`);
else ok('ningún texto retirado en D26c sigue en la página');
const portadas = PORTADAS.filter(h => B.includes(`href="${h}"`));
if (portadas.length) fail(`enlaces a portadas de organismos: ${portadas.join(', ')}`);
else ok('sin enlaces a portadas de organismos');
if (B.includes(`href="${FUENTE_AAP}"`)) ok('enlaza el documento de la AAP');
else fail('falta el enlace al documento de la AAP');

console.log(`\n${errors} diferencia(s) no declarada(s).`);
process.exit(errors ? 1 : 0);
