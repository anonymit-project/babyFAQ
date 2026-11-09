# Estado actual — babyFAQ

Actualizar al terminar cada sesión. Última actualización: 2026-11-09.

## Línea base real (periodo 2026-08-06 a 2026-11-03, GA4 + Search Console)

- **Sesiones totales: 27 en 90 días (~9/mes):** 16 Organic Search · 7 Direct · 4 AI Assistant.
- Google orgánico: **9 clics**, **1.720 impresiones** en 38 páginas. Solo `calculadora-lactancia` tiene tracción real (6 clics, 174 impresiones, posición 11,3; 131 s de interacción media).
- Impresiones por página (top): tomas-leche 232 (pos. 20), percentil 225 (pos. 57), calculadora-lactancia 174 (pos. 11), talla-panal 168 (pos. 37), primeros-auxilios 120 (pos. 77), vacunas 105 (pos. 75).
- Sesiones desde asistentes de IA (chatgpt.com): 4, 1 con interacción, 8,5 s de media; la última llegó a `temperatura-habitacion`.
- Existe demanda en inglés para "breastfeeding alcohol calculator" (posiciones ~65–72, sin clics).
- Cautelas: GA4 puede infravalorar (banner de cookies, bloqueadores) y "Direct" puede incluir visitas del propio autor. Valorar excluir tráfico interno.
- Las estimaciones antiguas de ~150–240 sesiones/mes eran erróneas.

## Metas orientativas (estimaciones, ajustables)
- 3 meses: 30–60 sesiones/mes · 6 meses: 100–200 · 12 meses: 500–1.000 (depende sobre todo de backlinks).
- Éxito = 0 errores de datos en Nivel 1, herramientas usables y proyecto mantenible con ~1 h/semana.

## Hecho
- Decisiones de arquitectura y política (`docs/09-decisiones.md`); inventario con niveles de riesgo (`data/inventario.json`).
- Fase 1 SEO optimizada en `calculadora-lactancia`, `percentil`, `talla-panal`, `primeros-auxilios`.
- Estructura de contexto en el repo (`CLAUDE.md`, `docs/`, `data/`).
- Despliegue con GitHub Actions (`.github/workflows/pages.yml`): solo se publica una lista de ficheros permitidos; `docs/`, `data/`, `CONTEXTO_BABYFAQ.md` e `index_old.html` dan 404 en babyfaq.es (comprobado 2026-11-05).
- Revisión de privacidad del repo público (2026-11-06): commits anónimos, sin forks, sin rastro en Google ni Wayback; historial mantenido (ver `09-decisiones.md`).
- Fase 1 SEO aplicada en `tomas-leche` (2026-11-06): title, h1, meta, og, interlinking y FAQPage de 5 preguntas con fuente.
- Favicon añadido al `<head>` de `index.html` (2026-11-06); pendiente de que Google lo recoja.
- Auditoría Nivel 1 de tomas-leche (cerrada 2026-11-08): datos solo de la AAP (2 páginas verificadas a mano), interpolación declarada en las tomas de fórmula de 2–5 meses y en los ml de materna, fórmula 7–12 meses con referencia de 6 meses, 5 FAQ con fuente, "Última revisión".
- Validador de Capa 1 (2026-11-09): `scripts/validate-static.mjs` (SEO, estándares de 02, líneas rojas de 05, coherencia con el inventario), `scripts/validate-sources.mjs` (fuentes responden y la cita aparece), `tests/tomas-leche.spec.mjs` (Playwright: 11 casos esperados, aviso de tope, sólidos, hold-to-repeat) y `.github/workflows/validate.yml`. Dos jobs en verde con `tomas-leche`. Corregidos en esa pasada: meta charset/viewport duplicados y unidad "horas" duplicada en `tomas-leche.html`.
- Esqueleto Eleventy (2026-11-09): `eleventy.config.cjs`, `src/` (layout común + plantilla y datos de `talla-zapato`), `scripts/compare-equivalence.mjs`, `pages.yml` y `validate.yml` con build. Subido en PR; pendiente de checks en verde y de comprobación manual de la página publicada.
- `docs/03-voz-y-estilo.md` y `docs/04-fuentes-autorizadas.md` creados (2026-11-09). 04 solo registra como verificadas las 2 páginas de la AAP de tomas-leche; el resto son candidatas pendientes. Piloto Eleventy `talla-zapato` confirmado (checks verdes, página publicada revisada).

## Siguiente
1. Confirmar el piloto (checks verdes, página publicada revisada). Después, migrar el resto de Nivel 3 de uno en uno, añadiendo cada uno al paso "Validar herramientas migradas" de `validate.yml`.
2. Auditoría del resto de Nivel 1 en el orden de `docs/05-politica-medica.md` (siguiente: `calculadora-lactancia`); revisar kg ↔ lb y otros fallos de dinamismo. Al cerrar cada una, añadirla al validador y escribir su test.
3. Enlazar desde `calculadora-lactancia` hacia `tomas-leche` (necesita el HTML de la primera).
4. Fase 4 (backlinks) en paralelo.

## Por confirmar
- Que el log de `validate:sources` muestre "cita encontrada" en las 2 fuentes de la AAP (un aviso "!" significa que no se comprobó).
- Que la protección de rama de `main` exija PR y los checks `estatico` y `fuentes-y-tests`. Hasta entonces, `pages.yml` publica con cada push aunque el validador falle.
- Si el CTR de "calculadora alcohol lactancia" mejora tras la optimización de title/meta (volver a medir a las 4–6 semanas).
- Que `babyfaq.es/docs/CLAUDE.md` y `babyfaq.es/data/inventario.json` den 404 (los documentos internos no deben servirse en el sitio).
- Si mejora la posición/CTR de `tomas-leche` (base: 232 impresiones, posición 20). Medir entre el 4 y el 18 de diciembre de 2026.
