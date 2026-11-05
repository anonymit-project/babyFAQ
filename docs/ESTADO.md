# Estado actual — babyFAQ

Actualizar al terminar cada sesión. Última actualización: 2026-11-05.

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

## Siguiente
1. Optimizar SEO de `tomas-leche` (Fase 1 pendiente).
2. Esqueleto Eleventy con `talla-zapato` (Nivel 3) conservando URL, canonical y JSON-LD.
3. Redactar `docs/03-voz-y-estilo.md` y `docs/04-fuentes-autorizadas.md` (URLs oficiales verificadas a mano).
4. Auditoría de Nivel 1 en el orden de `docs/05-politica-medica.md`; revisar kg ↔ lb y otros fallos de dinamismo.
5. Fase 4 (backlinks) en paralelo: primeros contactos en foros y directorios.

## Por confirmar
- Si el CTR de "calculadora alcohol lactancia" mejora tras la optimización de title/meta (volver a medir a las 4–6 semanas).
