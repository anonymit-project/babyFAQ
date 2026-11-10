# babyFAQ — guía maestra (CLAUDE.md)

Web de herramientas interactivas para padres primerizos en español (babyfaq.es). 41 herramientas en HTML/CSS/JS puro, GitHub Pages. Autor anónimo.
Ubicación en el repo: `docs/CLAUDE.md` y `docs/ESTADO.md` (el resto de rutas son relativas a la raíz del repo).

## Reglas de oro
1. Responder siempre en español.
2. Una tarea (o herramienta) a la vez. Al terminar, proponer la siguiente.
3. Ningún dato de salud sin fuente oficial. Leer `docs/05-politica-medica.md` antes de tocar herramientas de Nivel 1 o 2.
4. No cambiar URLs `.html` ni canonicals. No sobrescribir `sw.js`, `manifest.json`, `robots.txt`, `sitemap.xml` sin revisarlos.
5. Cambios quirúrgicos en "fichas de cambio" (formato en la sección "Formato de entrega de cambios"): fichero, acción, texto a localizar, texto a pegar y cómo comprobarlo.
6. Coste cero primero: scripts y validadores antes que agentes con API de pago.
7. Afiliados nunca dentro de los resultados de una herramienta de salud.
8. Sin nombre ni datos personales del autor en ficheros del repo (es público).
9. Nunca asumir el contenido de un fichero que no esté adjunto: pedirlo.
10. Despliegue: solo se publica lo que lista `.github/workflows/pages.yml`. Si una herramienta nueva necesita un fichero que no sea `.html` (CSS, JS, imágenes), añadirlo allí.

## Qué es cada fichero y cuándo se usa
| Fichero | Para qué sirve | Cuándo |
|---|---|---|
| `docs/CLAUDE.md` | Esta guía: reglas y mapa de ficheros | Siempre |
| `docs/ESTADO.md` | "Dónde estamos": métricas reales, qué está hecho, siguiente paso | Siempre |
| `docs/01-proyecto.md` | Qué es la web, stack, categorías | Contexto general, herramientas nuevas |
| `docs/02-estandares-herramienta.md` | Checklist que debe cumplir toda herramienta (diseño, SEO, contenido, interactividad, técnico) | Crear, optimizar o revisar una herramienta |
| `docs/03-voz-y-estilo.md` | Tono, atribución, frases prohibidas, formato de números y fechas | Escribir o revisar textos de una herramienta |
| `docs/04-fuentes-autorizadas.md` | Qué es fuente válida, registro de fuentes verificadas y candidatas | Verificar o añadir fuentes |
| `docs/05-politica-medica.md` | Reglas para datos de salud: niveles de riesgo y líneas rojas | Cualquier herramienta de salud o automatización |
| `docs/06-seo-roadmap.md` | Fases SEO y qué toca | Priorizar visitas, backlinks, interlinking |
| `docs/07-monetizacion.md` | Reglas de afiliados Amazon | Solo si se habla de ingresos |
| `docs/08-agentes-y-flujos.md` | Cómo se automatiza y se migra a Eleventy | Eleventy, tests, monitor de fuentes, agentes |
| `docs/09-decisiones.md` | Registro de decisiones y motivos | Para no repetir debates; se añade al final |
| `data/inventario.json` | Ficha de las 41 herramientas (nivel, prioridad, métricas, relacionadas, fuentes). Pesado | Solo interlinking, priorizar, fuentes, informes |
| `.github/workflows/pages.yml` | Define qué ficheros se publican en babyfaq.es | Al añadir ficheros públicos que no sean .html, o al migrar a Eleventy |
| `scripts/`, `tests/`, `.github/workflows/validate.yml` | Validador de Capa 1: checks estáticos, fuentes y tests Playwright | Al auditar o cambiar una herramienta, y al añadir una al validador |
| `eleventy.config.cjs`, `src/` | Capa de build: layout común (`src/_includes/layouts/herramienta.njk`) y, por herramienta migrada, una plantilla `.njk` + un `.json` de datos | Migrar o editar una herramienta ya migrada |
| `scripts/compare-equivalence.mjs`, `legacy/` | Compara el HTML original (guardado en `legacy/`) con el generado | Al migrar una herramienta |

## Qué adjuntar según la tarea (además de lo que ya está en el conocimiento del proyecto)
| Tarea | Documentos clave | Adjuntar |
|---|---|---|
| Optimizar SEO de una herramienta | 02, 06 (+05 si es Nivel 1/2) | `<head>` + últimas 50 líneas de su HTML |
| Auditar fiabilidad de datos (Nivel 1/2) | 05, 02 | HTML completo + enlace o PDF de la fuente oficial |
| Corregir un fallo o mejorar usabilidad (p. ej. kg ↔ lb) | 02 | HTML completo de la herramienta |
| Crear herramienta nueva | 01, 02, 03, 05, 06 | Una herramienta de referencia (`juguetes-edad.html`) |
| Migrar a Eleventy | 08, 09, 02 | HTML de la herramienta piloto (`talla-zapato.html`) |
| Interlinking o priorizar | 06 | `data/inventario.json` |
| Informe de visitas | ESTADO | CSV nuevos de Search Console y GA4 |
| Backlinks y promoción | 06 (Fase 4) | — |
| Monetización | 07 | — |
| Buscar fuentes oficiales | 04, 05 | `data/inventario.json` (solo las herramientas de la tarea) |

## Formato de entrega de cambios
Cada cambio se entrega como una ficha. Ejemplo:

```
FICHA 1 · docs/ESTADO.md
- Acción: SUSTITUIR LÍNEA
- Localizar: la línea que empieza por "Última actualización:"
- Pegar: Última actualización: 2026-11-10.
- Comprobar: Ctrl+F "Última actualización" da 1 resultado.
```

Acciones posibles: SUSTITUIR LÍNEA, SUSTITUIR BLOQUE, INSERTAR DESPUÉS DE, INSERTAR ANTES DE, BORRAR, AÑADIR AL FINAL.
- El texto a localizar se copia literal del fichero y debe aparecer una sola vez. Si no, se pide el fichero.
- Una ficha = una acción. Si el cambio afecta a más de la mitad del fichero, se entrega entero y se avisa.
- JSON: objeto completo, atención a las comas, validar antes del commit.
- Si el texto a localizar no aparece en tu fichero: no improvises, envía esa parte y se rehace la ficha.

## Protocolo de sesión (un chat por tarea)
- **Inicio:** leer ESTADO, resumir en 3 líneas dónde estamos, proponer la tarea siguiente y listar los ficheros que hay que adjuntar. Si el chat se abre con un prompt de relevo, usarlo como punto de partida y no volver a explicar el contexto.
- **Cierre:** entregar `ESTADO.md` actualizado y, si hubo decisiones, la línea para `09-decisiones.md`; recordar el commit; y terminar con el bloque "Prompt para el siguiente chat" (tarea, contexto mínimo, ficheros a adjuntar, restricciones). Cada tarea se hace en su propio chat.
- PROTOCOLO DE ACTUALIZACIÓN (al cerrar cada tarea, sin que te lo pida)
Revisa esta tabla y entrega solo lo que cambie, indicando la ruta del fichero:

| Qué ha pasado | Qué actualizar |
|---|---|
| Se termina cualquier tarea | `docs/ESTADO.md` (hecho, siguiente paso) |
| Se toma una decisión | Línea nueva con fecha al final de `docs/09-decisiones.md` |
| Se modifica o revisa una herramienta | Su objeto en `data/inventario.json` (ultima_revision, estado_verificacion, fuentes) y, si cambia una fase, `docs/06-seo-roadmap.md` |
| Se crea una herramienta nueva | Su objeto en `data/inventario.json`, el recuento de `docs/01-proyecto.md` y el recordatorio de añadirla al sitemap |
| Llegan datos nuevos de tráfico | Línea base de `docs/ESTADO.md` y, si cambian las metas, `docs/06` y `docs/07` |
| Se verifica una fuente oficial | `fuentes` en `data/inventario.json` y `docs/04-fuentes-autorizadas.md` |
| Cambian las reglas de salud | `docs/05-politica-medica.md` y una línea en `docs/09-decisiones.md` |

Reglas:
- Del inventario devuelve solo el objeto JSON de la herramienta afectada, no el fichero entero.
- Antes de crear un fichero nuevo, comprueba que no existe uno con ese propósito; si procede, propón nombre y número, y entrega también la fila nueva para la tabla de `docs/CLAUDE.md`.
- Termina con la lista de ficheros que el autor debe subir con commit.
