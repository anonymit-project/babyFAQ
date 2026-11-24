#!/usr/bin/env node
// Compara el HTML original de una herramienta con el generado por Eleventy.
// Uso: node scripts/compare-equivalence.mjs <slug>
// Necesita: legacy/<slug>.original.html, _site/<slug>.html y scripts/equivalencia/<slug>.json
// El JSON declara las desviaciones deliberadas de la migración (ver docs/09-decisiones.md, D28a).
import { readFileSync, existsSync } from 'node:fs';

const slug = process.argv[2];
if (!slug) { console.error('Uso: node scripts/compare-equivalence.mjs <slug>'); process.exit(2); }
const rutas = { orig: `legacy/${slug}.original.html`, built: `_site/${slug}.html`, cfg: `scripts/equivalencia/${slug}.json` };
for (const r of Object.values(rutas)) if (!existsSync(r)) { console.error(`✗ no existe ${r}`); process.exit(1); }
const A = readFileSync(rutas.orig, 'utf8');
const B = readFileSync(rutas.built, 'utf8');
const cfg = JSON.parse(readFileSync(rutas.cfg, 'utf8'));
console.log(`\nEquivalencia: ${slug}`);

const REVISION = /Última revisión: (\d{1,2} de \w+ de \d{4})/;

let errors = 0;
const fail = m => { errors++; console.error(`  ✗ ${m}`); if (process.env.GITHUB_ACTIONS) console.log(`::error::${slug}: ${m}`); };
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
const metaExtra = (cfg.metaSoloEnGenerado || []).map(norm);
const metaSust = (cfg.metaSustituciones || []).map(([de, a]) => [norm(de), norm(a)]);
const metaA = tagsOf(A, 'meta');
for (const [de] of metaSust) if (!metaA.some(t => t.includes(de))) fail(`el meta del original ya no contiene el texto sustituido: "${de.slice(0, 60)}…"`);
const metaAsust = metaA.map(t => metaSust.reduce((r, [de, a]) => r.split(de).join(a), t));
cmpList([...metaAsust, ...metaExtra].sort(), tagsOf(B, 'meta'), `meta tags (${metaExtra.length} añadida(s) y ${metaSust.length} sustitución(es) declarada(s))`);
cmpList(tagsOf(A, 'link'), tagsOf(B, 'link'), 'link tags');

// ── JSON-LD (salvo FAQPage) y scripts en línea ──
const scripts = h => [...h.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].map(m => ({ attrs: m[1], code: m[2] }));
const ld = h => scripts(h).filter(s => /ld\+json/.test(s.attrs)).map(s => JSON.parse(s.code)).filter(d => d['@type'] !== 'FAQPage').map(d => JSON.stringify(d));
// El script de Analytics se compara sin espacios (el layout lo escribe compacto); el resto, con espacios normalizados.
const inline = h => scripts(h).filter(s => !/src=|ld\+json/.test(s.attrs)).map(s => (/dataLayer/.test(s.code) ? s.code.replace(/\s+/g, '') : norm(s.code)));
cmpList(ld(A), ld(B), 'JSON-LD (sin FAQPage)');
const jsSust = (cfg.jsSustituciones || []).map(([de, a]) => [norm(de), norm(a)]);
const inlineA = inline(A);
for (const [de] of jsSust) if (!inlineA.some(c => c.includes(de))) fail(`el JS del original ya no contiene el texto sustituido: "${de.slice(0, 60)}…"`);
const inlineAsust = inlineA.map(c => jsSust.reduce((r, [de, a]) => r.replace(de, () => a), c));
cmpList(inlineAsust, inline(B), `JS en línea (GA + herramienta; ${jsSust.length} sustitución(es) declarada(s))`);

// ── CSS ──
const quitarComentarios = c => c.replace(/\/\*[\s\S]*?\*\//g, '');
const css = h => quitarComentarios([...h.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]).join('\n'));
const reglas = c => [...c.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
  .map(m => `${norm(m[1]).replace(/\s*,\s*/g, ',')}{${norm(m[2]).replace(/\s*([:;,])\s*/g, '$1').replace(/;$/, '')}}`).sort();
const medias = c => [...new Set([...c.matchAll(/@media[^{]*/g)].map(m => norm(m[0])))].sort();
const rA = reglas(css(A)), rB = reglas(css(B));

if (cfg.cssExacto) {
  cmpList(rA, rB, 'reglas CSS');
} else {
  // El generado = CSS común del layout + CSS de la plantilla. Se exige que (1) todas las reglas del original
  // estén en el generado, (2) las reglas de más vengan del layout y (3) no se cuele nada del layout:
  // ni propiedades que el original no declare para ese selector, ni reglas para clases que la página usa.
  const layout = readFileSync('src/_includes/layouts/herramienta.njk', 'utf8');
  const rawLayout = (layout.match(/\{% raw %\}([\s\S]*?)\{% endraw %\}/) || [])[1];
  if (!rawLayout) fail('no se encontró el bloque {% raw %} de CSS en el layout');
  const rLayout = reglas(quitarComentarios(rawLayout || ''));
  const resto = [...rB], falta = [];
  for (const x of rA) { const i = resto.indexOf(x); if (i < 0) falta.push(x); else resto.splice(i, 1); }
  const partir = r => { const i = r.indexOf('{'); return [r.slice(0, i), r.slice(i + 1, -1)]; };
  const props = b => b.split(';').map(d => d.split(':')[0].trim()).filter(Boolean);
  const propsOrig = new Map();
  for (const r of rA) { const [s, b] = partir(r); propsOrig.set(s, new Set([...(propsOrig.get(s) || []), ...props(b)])); }
  const clases = new Set([...body(B).matchAll(/class="([^"]+)"/g)].flatMap(m => m[1].split(/\s+/)));
  const problemas = [];
  for (const x of falta) problemas.push(`regla del original que falta en el generado: ${x.slice(0, 120)}`);
  for (const x of resto) {
    if (!rLayout.includes(x)) { problemas.push(`regla de más que no viene del layout: ${x.slice(0, 120)}`); continue; }
    const [s, b] = partir(x);
    if (propsOrig.has(s)) {
      const admitidas = (cfg.cssPropsAdmitidas || {})[s] || []; // propiedades del layout que se declaran como desviación (D31c)
      const fuga = props(b).filter(p => !p.startsWith('--') && !propsOrig.get(s).has(p) && !admitidas.includes(p)); // las variables CSS sin usar no cuentan como fuga (D30d)
      if (fuga.length) problemas.push(`el layout aporta propiedades que el original no declara en "${s}": ${fuga.join(', ')}`);
    } else {
      const conClases = /\./.test(s);
      const usa = [...s.matchAll(/\.([\w-]+)/g)].some(m => clases.has(m[1]));
      if (!conClases || usa) problemas.push(`regla del layout para "${s}", que el original no define y la página usa`);
    }
  }
  if (problemas.length) fail(`CSS distinto del original:\n      ${problemas.join('\n      ')}`);
  else ok(`CSS: las ${rA.length} reglas del original están en el generado; ${resto.length} reglas de más, todas del layout y sin fugas`);
}
cmpList(medias(css(A)), medias(css(B)), 'media queries');

// ── Estructura ──
const ids = h => [...body(h).matchAll(/\sid="([^"]+)"/g)].map(m => m[1]).sort();
const aria = h => [...body(h).matchAll(/aria-label="([^"]+)"/g)].map(m => m[1]).sort();
cmpList(ids(A), ids(B), 'ids');
cmpList(aria(A), aria(B), 'aria-labels');

// ── Texto ──
const text = h => norm(body(h).replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' '));
const tBfull = text(B);
const mRev = tBfull.match(REVISION);
if (!mRev) fail('falta "Última revisión: fecha" en el generado');
const fecha = mRev ? mRev[1] : '';
// Si la herramienta declara "zonaHasta", solo se compara el texto anterior a ese título (el resto se reescribió).
const zona = t => (cfg.zonaHasta ? t.split(cfg.zonaHasta)[0] : t);
let tA = zona(text(A));
for (const [de, a] of cfg.sustituciones || []) {
  const d = norm(de);
  if (!tA.includes(d)) { fail(`el original ya no contiene el texto sustituido: "${d.slice(0, 60)}…"`); continue; }
  tA = tA.replace(d, () => norm(a.split('{FECHA}').join(fecha)));
}
const tB = norm(zona(tBfull));
if (norm(tA) === tB) ok(`texto idéntico (${tB.split(' ').length} palabras, salvo ${(cfg.sustituciones || []).length} sustitución(es) declarada(s))`);
else {
  const x = norm(tA);
  let i = 0; while (i < x.length && x[i] === tB[i]) i++;
  fail(`texto distinto desde el carácter ${i}:\n      original: …${x.slice(Math.max(0, i - 40), i + 80)}\n      generado: …${tB.slice(Math.max(0, i - 40), i + 80)}`);
}

// ── Controles de lo declarado ──
for (const t of cfg.textosObligatorios || []) if (!tBfull.includes(t)) fail(`falta en el generado: «${t}»`);
const jsB = scripts(B).filter(s => !/src=|ld\+json/.test(s.attrs)).map(s => s.code).join(' ');
const retirados = (cfg.retirados || []).filter(s => tBfull.includes(s) || jsB.includes(s));
if (retirados.length) fail(`textos retirados que siguen en la página: ${retirados.join(' | ')}`);
else ok('ningún texto retirado sigue en la página');
const portadas = (cfg.portadas || []).filter(h => B.includes(`href="${h}"`));
if (portadas.length) fail(`enlaces a portadas de organismos: ${portadas.join(', ')}`);
else ok('sin enlaces a portadas de organismos');
for (const u of cfg.enlacesObligatorios || []) {
  if (B.includes(`href="${u}"`)) ok(`enlaza ${u}`);
  else fail(`falta el enlace a ${u}`);
}

console.log(`\n${errors} diferencia(s) no declarada(s).`);
process.exit(errors ? 1 : 0);
