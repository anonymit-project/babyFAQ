# Registro de decisiones — babyFAQ

Formato: fecha · decisión · motivo. Añadir al final; no borrar decisiones antiguas, marcarlas como reemplazadas.

- **2026-11-04 · Sin newsletter.** Sin interés del autor y la calidad no estaría garantizada. Foco en herramientas y visitas.
- **2026-11-04 · Autor anónimo, sin revisor médico.** La credibilidad se construye con fuentes enlazadas, fecha de revisión y una página "Cómo verificamos la información".
- **2026-11-04 · Capa de build con Eleventy (11ty).** Gratuito y de código abierto; salida en HTML puro; datos en JSON. Se mantienen exactamente las URLs `.html` y los canonicals actuales. Migración herramienta a herramienta, empezando por una de Nivel 3.
- **2026-11-04 · Clasificación por riesgo en 3 niveles** (ver `05-politica-medica.md`). Nivel 1 nunca se fusiona automáticamente.
- **2026-11-04 · Coste cero primero.** Capa 1 (build, validadores, tests Playwright, monitor de fuentes, informe de Search Console/GA4) sin API de pago. Capa 2 (agentes con IA vía API) solo cuando haya cuenta y presupuesto.
- **2026-11-04 · Monetización aplazada.** Afiliados de Amazon solo tras sesiones consistentes; ver `ESTADO.md` para la línea base real.
- **2026-11-04 · Una herramienta a la vez** se mantiene como flujo de trabajo.
- **2026-11-05 · Línea base recalibrada.** 27 sesiones en 90 días (16 orgánicas, 7 directas, 4 de asistentes de IA). Metas y monetización se reajustan a esa realidad; prioridad: visibilidad, backlinks y fiabilidad.
- **2026-11-05 · Contexto en el repo, no en un monolito.** `CONTEXTO_BABYFAQ.md` queda sustituido por `CLAUDE.md` + `ESTADO.md` + `docs/` + `data/`. En el proyecto de Claude se sincronizan solo los ficheros necesarios para ahorrar tokens.
- **2026-11-05 · Repo público y anónimo:** no incluir nombre ni datos personales del autor en ficheros del repo; los documentos internos no deben publicarse en el sitio (se resolverá del todo con el despliegue de Eleventy desde `_site`).
- **2026-11-05 · Publicación con lista de ficheros permitidos (GitHub Actions).** Solo se publican en babyfaq.es los `.html` de herramientas y los ficheros técnicos listados en `.github/workflows/pages.yml`; `docs/`, `data/` y los ficheros internos no se sirven. Motivo: eran accesibles públicamente. Al migrar a Eleventy, el paso "Preparar" se sustituye por el build (salida en `_site`). Cualquier tipo de fichero público nuevo (CSS, JS, imágenes) debe añadirse al workflow.
- **2026-11-06 · Limpieza de privacidad: se mantiene el repo y su historial.** `CONTEXTO_BABYFAQ.md` (solo nombre de pila e ID de GA4, este último no sensible) estuvo ~5 meses publicado; ya da 404, sin resultados en Google ni en Wayback Machine, commits con identidad anónima y sin forks. Riesgo bajo y asumido.
- **2026-11-06 · Un chat por tarea con prompt de relevo.** Para ahorrar tokens, cada tarea se hace en un chat propio y Claude entrega al cerrar el prompt para abrir la siguiente. El contexto persistente vive en el repo (`CLAUDE.md`, `ESTADO.md`), no en el chat.
- **2026-11-06 · FAQPage de `tomas-leche` limitado a 1 pregunta hasta auditar.** Las otras 4 contienen afirmaciones y cifras sin fuente (Nivel 1); se amplía tras la auditoría.
- **2026-11-06 · Eliminada la atribución "recomendado por la AAP" de la meta de `tomas-leche`.** No tenía fuente concreta enlazada.
- **2026-11-06 · Auditoría de `tomas-leche` antes de seguir con Eleventy.** Evitar atraer visitas a una página con inconsistencias entre tabla, calculadora y texto. (Incluir solo si lo confirmas.)
- **2026-11-08 · tomas-leche: fuente única AAP.** AEP, ESPGHAN y OMS no aportaron documento con cifras y se retiran de "Fuentes consultadas". Se eliminan tope de 900 ml, mínimo de 500 ml y 150/120/100/90 ml/kg por no tener respaldo; la regla por peso pasa a 75 ml por cada 453 g con tope de 960 ml.
- **2026-11-08 · Excepción al principio 3 de 05-politica-medica (solo tomas-leche).** Se permite interpolar entre dos referencias oficiales: tomas de fórmula en los meses 2–5 y ml de leche materna entre 30 y 135 ml. Condiciones: nunca extrapolar, marcado en pantalla como estimación, tests sobre los anclajes. En materna se muestra un valor único en vez de rango.
- **2026-11-08 · Fórmula de 7 a 12 meses:** se muestra la referencia de 6 meses de la AAP etiquetada, sin cifras por mes, hasta encontrar fuente oficial.
