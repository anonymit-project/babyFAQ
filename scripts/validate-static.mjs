#!/usr/bin/env node
// Validador estático de Capa 1. Uso: npm run validate [-- fichero.html ...]
import { readFileSync, existsSync } from 'node:fs';

const DEFAULT_FILES = ['tomas-leche.html'];
const SITE = 'https://babyfaq.es';
const ALLOWED_SCRIPT_HOSTS = ['www.googletagmanager.com'];
const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const FRASES_PROHIBIDAS = ['es seguro', 'no pasa nada', 'no hace falta ir al médico', 'no es necesario ir al médico'];

const files = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_FILES;
const inventario = JSON.parse(readFileSync('data/inventario.json', 'utf8'));

let errors = 0, warnings = 0, current = '', maxNivel = 3;
const fail = m => { errors++; console.error(`  ✗ ${m}`); if (process.env.GITHUB_ACTIONS) console.log(`::error file=${current}::${m}`); };
const warn = m => { warnings++; console.warn(`  ! ${m}`); if (process.env.GITHUB_ACTIONS) console.log(`::warning file=${current}::${m}`); };
const ok = m => console.log(`  ✓ ${m}`);
const check = (cond, okMsg, failMsg) => (cond ? ok(okMsg) : fail(failMsg));

const decode = s => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const norm = s => decode(s).replace(/\s+/g, ' ').trim();
const compact = s => norm(s).replace(/\s+/g, '');
const textOf = html => norm(html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' '));
const attrs = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*"([^"]*)"/g)].map(m => [m[1].toLowerCase(), m[2]]));
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map(m => m[0]);

for (const file of files) {
  current = file;
  console.log(`\n${file}`);
  if (!existsSync(file)) { fail('el fichero no existe'); continue; }
  const html = readFileSync(file, 'utf8');
  const body = html.split(/<body[^>]*>/i)[1] ?? html;
  const text = textOf(body);
  const name = file.split('/').pop();
  const slug = name.replace(/\.html$/, '');
  const tool = inventario.herramientas.find(h => h.slug === slug);
  const salud = !tool || tool.nivel_riesgo <= 2;
  if (tool) maxNivel = Math.min(maxNivel, tool.nivel_riesgo);
  check(!!tool, `está en el inventario (nivel ${tool?.nivel_riesgo})`, 'no aparece en data/inventario.json');

  // ── Cabecera ──
  const metas = tags(html, 'meta').map(attrs);
  const meta = k => metas.find(m => (m.name || m.property) === k)?.content;
  const links = tags(html, 'link').map(attrs);
  const canonical = `${SITE}/${name}`;

  check(/<html[^>]*\blang="es"/i.test(html), 'lang="es"', 'falta lang="es"');
  check(metas.filter(m => m.charset).length === 1, 'un único meta charset', `meta charset repetido o ausente (${metas.filter(m => m.charset).length})`);
  check(metas.filter(m => m.name === 'viewport').length === 1, 'un único meta viewport', `meta viewport repetido o ausente (${metas.filter(m => m.name === 'viewport').length})`);
  const title = (html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1];
  check(!!title && title.trim().length > 0, 'title presente', 'falta <title>');
  const desc = meta('description') || '';
  check(desc.length >= 140 && desc.length <= 155, `meta description ${desc.length} caracteres`, `meta description de ${desc.length} caracteres (debe ser 140–155)`);
  check(!!meta('og:title') && !!meta('og:description'), 'og:title y og:description', 'faltan og:title u og:description');
  check(links.find(l => l.rel === 'canonical')?.href === canonical, 'canonical correcto', `canonical distinto de ${canonical}`);
  check(meta('og:url') === canonical, 'og:url = canonical', 'og:url no coincide con el canonical');
  check(links.some(l => l.rel === 'icon' && l.href === '/favicon.svg' && l.type === 'image/svg+xml'), 'favicon', 'falta el favicon /favicon.svg');
  check(meta('theme-color') === '#fdf6ee', 'theme-color', 'theme-color distinto de #fdf6ee');
  check(html.includes('G-55NR11957W'), 'Google Analytics', 'falta Google Analytics G-55NR11957W');

  // ── Estructura y contenido ──
  check((body.match(/<h1\b/gi) || []).length === 1, 'un único h1', 'debe haber exactamente un <h1>');
  check((body.match(/<h2\b/gi) || []).length >= 3, 'al menos 3 h2', 'menos de 3 secciones h2');
  const words = text.split(' ').length;
  check(words > 600, `${words} palabras`, `solo ${words} palabras (mínimo 600)`);
  const iFuentes = text.indexOf('Fuentes consultadas');
  const iRevision = text.indexOf('Última revisión:');
  check(iFuentes >= 0, 'sección "Fuentes consultadas"', 'falta la sección "Fuentes consultadas"');
  check(iRevision >= 0, '"Última revisión" presente', 'falta "Última revisión: fecha"');
  check(iFuentes < 0 || iRevision < 0 || iFuentes < iRevision, 'fuentes antes del disclaimer', '"Fuentes consultadas" debe ir antes del disclaimer final');
  if (salud) check(/no sustituye/i.test(text), 'disclaimer médico', 'falta el disclaimer médico al pie');

  // ── Técnico ──
  for (const s of tags(html, 'script')) {
    const src = attrs(s).src;
    if (!src) continue;
    const host = new URL(src, SITE).hostname;
    check(ALLOWED_SCRIPT_HOSTS.includes(host), `script externo permitido (${host})`, `script externo no permitido: ${src}`);
  }
  const sinAria = tags(html, 'button').filter(b => !attrs(b)['aria-label']);
  check(sinAria.length === 0, 'todos los botones con aria-label', `${sinAria.length} botón(es) sin aria-label: ${sinAria[0]?.slice(0, 80)}`);
  if (/hold-btn/.test(html)) check(/touchstart/.test(html) && /mousedown/.test(html), 'hold-to-repeat (touchstart + mousedown)', 'faltan touchstart y/o mousedown en los selectores');

  // ── JSON-LD ──
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].map(m => m[1]);
  const ld = [];
  for (const b of blocks) { try { ld.push(JSON.parse(b)); } catch (e) { fail(`JSON-LD no válido: ${e.message}`); } }
  check(ld.some(d => d['@type'] === 'WebApplication'), 'JSON-LD WebApplication', 'falta JSON-LD WebApplication');
  const faq = ld.find(d => d['@type'] === 'FAQPage');
  if (faq) {
    const visible = compact(text);
    const missing = faq.mainEntity.filter(q => !visible.includes(compact(q.acceptedAnswer.text)));
    check(missing.length === 0, `FAQPage: ${faq.mainEntity.length} respuestas idénticas al texto visible`, `FAQPage: ${missing.length} respuesta(s) no coinciden con el texto visible (p. ej. "${missing[0]?.name}")`);
  }

  // ── Líneas rojas (05-politica-medica) ──
  const lower = text.toLowerCase();
  for (const f of FRASES_PROHIBIDAS) if (lower.includes(f)) fail(`frase prohibida sin respaldo literal: "${f}"`);
  if (salud) check(!/amazon\.|amzn\.to|[?&]tag=/i.test(html), 'sin enlaces de afiliado', 'enlace de afiliado en una herramienta de salud');

  // ── Coherencia con el inventario ──
  if (tool && tool.nivel_riesgo === 1) {
    check(tool.estado_verificacion === 'verificado', 'estado_verificacion = verificado', `estado_verificacion = ${tool.estado_verificacion}`);
    check((tool.fuentes || []).length >= 1, `${tool.fuentes?.length} fuente(s) en el inventario`, 'Nivel 1 sin fuentes en el inventario');
    for (const f of tool.fuentes || []) {
      const falta = ['fuente_organismo', 'fuente_url', 'fecha_consulta', 'cita_literal_breve'].filter(k => !f[k]);
      check(falta.length === 0, `fuente completa (${f.fuente_organismo})`, `fuente con campos vacíos: ${falta.join(', ')}`);
      const n = (f.cita_literal_breve || '').trim().split(/\s+/).length;
      check(n <= 15, `cita de ${n} palabras`, `cita_literal_breve de ${n} palabras (máximo 15)`);
      check(html.includes(`href="${f.fuente_url}"`), 'la fuente del inventario está enlazada en la página', `la página no enlaza ${f.fuente_url}`);
    }
    const m = text.match(/Última revisión:\s*(\d{1,2}) de (\w+) de (\d{4})/);
    const iso = m ? `${m[3]}-${String(MESES.indexOf(m[2].toLowerCase()) + 1).padStart(2, '0')}-${m[1].padStart(2, '0')}` : null;
    check(iso === tool.ultima_revision, `fecha de revisión coincide (${iso})`, `"Última revisión" de la página (${iso}) ≠ inventario (${tool.ultima_revision})`);
  }
}

console.log(`\n${errors} error(es), ${warnings} aviso(s).`);
if (maxNivel === 1) console.log('Nivel 1: este validador no sustituye tu aprobación. Comprueba la tabla dato/fuente y no hagas auto-merge.');
process.exit(errors ? 1 : 0);
