# Estado actual — babyFAQ

Actualizar al terminar cada sesión.

## Línea base real (Google orgánico, 2026-08-06 a 2026-11-03, fuente: GA4 + Search Console)

- **Clics: 9** en 90 días (~3 al mes). **Impresiones: 1.720** en 38 páginas.
- Solo **calculadora-lactancia** tiene tracción real: 6 clics, 174 impresiones, posición media 11,3; 6 usuarios activos, 131 s de interacción media.
- Impresiones por página (top): tomas-leche 232 (pos. 20), percentil 225 (pos. 57), calculadora-lactancia 174 (pos. 11), talla-panal 168 (pos. 37), primeros-auxilios 120 (pos. 77), vacunas 105 (pos. 75).
- Consulta con posición 4,3 y 23 impresiones sin clics: "calculadora alcohol lactancia" (problema de title/meta, no de posición).
- Existe demanda en inglés para "breastfeeding alcohol calculator" (posiciones ~65–72, sin clics).
- Tráfico desde asistentes de IA: visitas puntuales (chatgpt.com); la más reciente llegó a `temperatura-habitacion`. No incluido en estas cifras (son solo Google orgánico).
- ⚠️ La estimación anterior de "~150–240 sesiones/mes" no se corresponde con estos datos. Falta exportar de GA4 las **sesiones totales por canal** para fijar la línea base real.

## Hecho
- Decisiones de arquitectura y política (ver `docs/09-decisiones.md`).
- `data/inventario.json` generado con nivel de riesgo, prioridad SEO y métricas de 90 días.

## Por confirmar
- Estado real de la Fase 1 del roadmap SEO (¿cuáles de calculadora-lactancia, percentil, talla-panal, primeros-auxilios están ya optimizadas?). Añadir **tomas-leche** a la Fase 1.

## Siguiente
1. Subir estos ficheros al repo y sincronizar `docs/` y `data/` con el proyecto de Claude.
2. Exportar de GA4 sesiones totales por canal (90 días).
3. Montar el esqueleto de Eleventy con una herramienta de Nivel 3 (`talla-zapato`) y comprobar que el HTML resultante conserva URL, canonical y JSON-LD.
