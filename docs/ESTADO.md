# Estado actual — babyFAQ

Actualizar al terminar cada sesión. Última actualización: 2026-11-17.

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
- Formato de "fichas de cambio" para entregar parches (2026-11-10): regla de oro 5 de `docs/CLAUDE.md`, sección "Formato de entrega de cambios" y punto 3 del orquestador.
- Auditoría Nivel 1 de calculadora-lactancia (2026-11-10): cálculo = Tabla 1 de Koren 2002 (Watson, 0,015 g/dL/h, tiempo desde el inicio), 13,45 g/bebida como valor ajustado y rotulado, sin cálculo fuera de tabla, estimación marcada, textos sin respaldo eliminados, fuente única Koren, FAQPage de 3 respuestas, «Última revisión», validador + test (25×12 casillas, tolerancia −1/+2 min). Candidata sin verificar: AAP «al menos 2 horas» (en conflicto con Koren para ≥ ~84 kg y 1 bebida). Pendiente de checks en verde.
- Auditoría Nivel 1 de primeros-auxilios (2026-11-11), cerrada: RCP y atragantamiento según el ERC 2025 (contrastado con sus páginas de obstrucción de vía aérea), quemaduras y traumatismo craneal según la AEP; corregidas contradicciones y retirado lo sin respaldo; añadida la regla AEP «lactante menor de 1 año → urgencias»; 8 fuentes en el inventario (PDF, verificación manual con aviso); inventario «verificado», añadida al validador (`DEFAULT_FILES`) y con test Playwright actualizado. Pendiente de checks en verde y de tu aprobación.
- Auditoría Nivel 1 de dosis-fiebre (2026-11-12): fuente principal = fichas técnicas AEMPS de Apiretal y Dalsy (la guía de Aragón, solo para la alternancia); cálculo por fórmula validada contra las tablas (paracetamol 0,15 mL/kg a la baja, hasta 32 kg; ibuprofeno como rango por toma, 5–30 kg y desde 3 meses); corregida la contradicción de la alternancia; retirado lo sin respaldo (jarabe 50 mg/mL, Actron, atribución a la AEP, umbrales de urgencia); avisos de varicela, deshidratación, aspirina y duración con fuente; 13 fuentes en el inventario; añadida al validador (`DEFAULT_FILES` y fuentes) y con test Playwright nuevo. Pendiente de checks en verde y de tu aprobación (D4a–D4d en `09`).
- Auditoría Nivel 1 de fiebre (2026-11-15): fuente única el protocolo AEP «Lactante febril» (PDF 2020, 0–24 meses; 16 citas con verificación manual) + ficha AEMPS de Apiretal para «paracetamol en <3 años solo por recomendación médica». Un solo umbral de 38 °C; retirados selector de método, «subfebril», 37,5 °C axilar, 40,5 °C, bandas por edad sin fuente y FAQ sin respaldo; reincorporado con fuente «<3 meses con ≥38 °C → urgencias» (≤21 días antibiótico e ingreso; 22–90 días observación); pautas de 3–24 meses solo con lo que dice la AEP (mal aspecto, ≥39 °C, >48 h); FAQPage idéntico al texto visible; 3 meses se trata como menor de 3 meses; inventario «verificado», añadida al validador y con test Playwright nuevo (D5a–D5e en `09`). Pendiente de checks en verde y de tu aprobación.
- Auditoría parcial de cuando-urgencias (2026-11-15): sustituido el bloque de fiebre por pautas con fuente AEP; corregidas las contradicciones con `primeros-auxilios` (chichón blando, atragantamiento, observación 24–48 h, quemadura 10–20 min, lactante <1 año con golpe en la cabeza); retirada la atribución a AEP/SNS de la meta og:description. Sigue «pendiente»: el resto de síntomas no tiene fuente.
- dosis-fiebre, D6 (2026-11-15): ibuprofeno sin cálculo por debajo de 6 meses (AEP «Lactante febril» frente a la ficha de Dalsy, que lo admite desde 3 meses); motivo visible con ambas fuentes, test actualizado, fuente AEP añadida al inventario y a la página, revisión 15-nov. Corregido también el test de `fiebre` que fallaba por mayúsculas (CSS). Pendiente de checks en verde y de tu aprobación (D6a–D6b en `09`).
- dosis-fiebre, opción C de edad y peso (2026-11-15): rango OMS (menor P3 – mayor P97 de niñas y niños) junto al peso, aviso si los kg quedan fuera sin bloquear el cálculo y botón «Usar peso medio para esta edad» (menor P50) con aviso en las dos tarjetas de dosis; tablas OMS 2006 de peso para la edad (2 PDF, verificación manual; P3, P50 y P97 cruzados con L, M y S); solo hasta 60 meses (el selector sigue en 0–180); 2 fuentes nuevas en el inventario y en la página; 7 tests nuevos. Pendiente de checks en verde y de tu aprobación (D7a–D7c en `09`).
- Auditoría parcial de cuando-urgencias, traumatismos y quemaduras (2026-11-16): golpe en la cabeza, golpe en extremidades y quemaduras contrastados con el capítulo de primeros auxilios de la AEP (PDF, verificación manual; 24 citas en el inventario). Retirado lo sin respaldo (fontanela, nuca, más de 2 vómitos, 1–1,5 m, codo de niñera, tamaños de quemadura, «menor de 1 año»); reincorporadas con fuente las zonas de riesgo de quemaduras (D5e resuelto como D8a); capítulo AEP enlazado en «Fuentes consultadas»; test Playwright nuevo `tests/cuando-urgencias.spec.mjs` (4 casos). Pendiente de checks en verde y de tu aprobación (D8a–D8e en `09`).
- Auditoría parcial de cuando-urgencias, respiración (2026-11-16): dificultad para respirar según la Tabla 7 del capítulo de primeros auxilios de la AEP, atragantamiento según su sección de cuerpo extraño y bronquiolitis según el protocolo AEP de UCIP (2021, PDF, solo criterios de ingreso y factores de riesgo; sin nivel verde). Retiradas las cifras de frecuencia respiratoria, la postura en trípode, el verde de dificultad respiratoria y de bronquiolitis y «aunque el objeto salga, urgencias» (ahora ámbar); 17 citas nuevas en el inventario; 3 tests Playwright nuevos en `tests/cuando-urgencias.spec.mjs`. Pendiente de checks en verde y de tu aprobación (D9a–D9c en `09`).
- Auditoría parcial de cuando-urgencias, ingesta de tóxicos (2026-11-17): fuentes = capítulo de primeros auxilios de la AEP (Recomendaciones generales e Intoxicaciones hasta la Tabla 21) y protocolo AEP/SEUP «Intoxicaciones» 2020 (PDF, verificación manual; la Figura 1 es una imagen no leída). Rojo: inconsciente o con síntomas; ámbar «Llama a Toxicología o al 112»; verde: productos no tóxicos y número guardado. Retirados: pila de botón, «24 h, 365 días», excepción del vómito, «no pasa nada», planta desconocida y convulsión como criterios; 22 citas nuevas en el inventario; test Playwright nuevo en `tests/cuando-urgencias.spec.mjs`. Corregido también el fallo de `test:e2e` de respiración (redacción «no da criterios para una dificultad leve»). Pendiente de checks en verde y de tu aprobación (D10a–D10e en `09`).

## Siguiente
1. Auditar el resto de `cuando-urgencias` por categorías, cada una en su chat: digestivo (vómitos, diarrea, dolor abdominal: necesita fuente nueva), piel (manchas con fiebre, reacción alérgica) y otros (ojos, oídos, apatía, rechazo del alimento). Al cerrar la última: quitar las portadas de «Fuentes consultadas», enlazar el protocolo AEP «Lactante febril» y el de bronquiolitis, revisar el banner del 112 y las secciones «Señales de alarma general» y «Deshidratación» (afirmaciones sin fuente), añadir «Última revisión» y añadir la herramienta a `DEFAULT_FILES` y a `validate-sources`. Pendiente aparte: reincorporar en `primeros-auxilios` las zonas de riesgo de quemaduras (D8a). Al cerrar la última categoría, además: línea 🟡 de tóxicos en «Señales de alarma general» (contiene «24 h, 365 días» y «aunque el niño parezca estar bien») y ficha «Problemas en los ojos» (dice 15–20 min; la SEUP dice 15 min de agua abundante).
2. Migrar el resto de Nivel 3 de uno en uno, añadiendo cada uno al paso "Validar herramientas migradas" de `validate.yml`.
3. Fase 4 (backlinks) en paralelo.

## Por confirmar
- Que el log de `validate:sources` muestre "cita encontrada" en las 2 fuentes de la AAP (un aviso "!" significa que no se comprobó).
- Que la protección de rama de `main` exija PR y los checks `estatico` y `fuentes-y-tests`. Hasta entonces, `pages.yml` publica con cada push aunque el validador falle.
- Si el CTR de "calculadora alcohol lactancia" mejora tras la optimización de title/meta (volver a medir a las 4–6 semanas).
- Que `babyfaq.es/docs/CLAUDE.md` y `babyfaq.es/data/inventario.json` den 404 (los documentos internos no deben servirse en el sitio).
- Si mejora la posición/CTR de `tomas-leche` (base: 232 impresiones, posición 20). Medir entre el 4 y el 18 de diciembre de 2026.
- Constante 13,45 g (decisión), 15 mg/dL por hora, cita del Ministerio de Sanidad y medir CTR de «calculadora alcohol lactancia» del 8 al 22 de dic (la meta cambió hoy).
- Que `validate:sources` muestre 8 avisos «!» de PDF para primeros-auxilios (verificación manual) y 0 errores.
- Si mejora la posición/CTR de primeros-auxilios tras reescribir la meta (base: 120 impresiones, posición 77). Propuesta: medir del 9 al 23 de diciembre de 2026.
- Que `validate:sources` muestre ✓ en las citas de CIMA de dosis-fiebre (si alguna sale ✗, dime cuál: puede ser una diferencia de redacción) y 1 aviso «!» por el PDF de la guía de Aragón.
- Que CIMA responda al validador (si da error de red o bloqueo, saldrá como aviso, no como error de dato).
- D4a–D4d de `09-decisiones.md`.
- Revisar a ojo en móvil y en escritorio el rango del ibuprofeno (p. ej. 30 kg a 20 mg/mL: 10.0–15.0) para ver que no desborda la tarjeta.
- Si mejora la posición/CTR de dosis-fiebre (base: 9 impresiones, posición 16,4), con la meta nueva. Medir del 10 al 24 de diciembre de 2026.
- Que `validate:sources` muestre 16 avisos «!» de PDF para fiebre (verificación manual: abre el PDF de la AEP y busca cada cita con Ctrl+F) y ✓ en la cita de CIMA (Apiretal).
- Si mejora la posición/CTR de fiebre tras reescribir título y meta (base: 16 impresiones, posición 5,6). Medir del 14 al 28 de diciembre de 2026.
- D5a–D5e de `09-decisiones.md`.
- Revisar a ojo en móvil la nueva `fiebre.html` (sin selector de método) y que el mensaje de <3 meses se lea bien en la tarjeta.
- D6a–D6b de `09-decisiones.md`.
- Que `validate:sources` muestre 2 avisos «!» de PDF para dosis-fiebre (guía de Aragón y protocolo AEP; verificación manual) y 0 errores. Antes de aprobar D6a, abrir el PDF de la AEP y leer el contexto de «En menores de 6 meses usaremos paracetamol».
- Que el check `test:e2e` pase con el test de `fiebre` corregido (51 de 51).
- D7a–D7c de `09-decisiones.md`.
- Comprobación manual de las tablas OMS de dosis-fiebre: abrir los 2 PDF (enlaces en `04`) y comparar las 66 cifras de las anclas de cada 6 meses con el test (`OMS_ANCLAS`) y con la tabla de este chat.
- Que `validate:sources` muestre 4 avisos «!» de PDF para dosis-fiebre (guía de Aragón, protocolo AEP y las 2 tablas de la OMS) y 0 errores.
- Que `test:e2e` vuelva a dar 58 de 58 tras el arreglo del solape (en la primera pasada falló 1: el clic en `#age-p`).
- Revisar a ojo la caja de rango OMS y el botón: en móvil, bajo la tarjeta de edad y peso; en escritorio, encima de las dos tarjetas de dosis, con Peso y Edad apilados (D7d). Comprobar con el ratón que el «+» de edad responde.
- D8a–D8e de `09-decisiones.md`.
- Comprobación manual de las citas de cuando-urgencias: abrir el PDF de la AEP (enlace en `04`) y buscar cada una con Ctrl+F; el validador no lee PDF.
- Revisar a ojo en móvil y en escritorio los tres síntomas de «Golpes»: golpe en la cabeza sin bloque ámbar, extremidades sin bloque verde y quemaduras con los tres, que se lean bien y que el enlace a primeros auxilios funcione.
- Que `test:e2e` pase con los 4 tests nuevos de `cuando-urgencias`.
- D9a–D9c de `09-decisiones.md`.
- Comprobación manual de las citas de respiración: abrir los 2 PDF de la AEP (enlaces en `04`) y buscar cada cita con Ctrl+F; el validador no lee PDF. En el de bronquiolitis, confirmar que el texto «Criterios de ingreso» dice «Considerar en niños con».
- Si el ERC 2025 recomienda valoración médica tras desobstruir a un niño (p. ej. «aunque el objeto salga»), traer la cita literal para subirlo de nuevo a rojo (D9c).
- Revisar a ojo en móvil las tres fichas de «Respiración»: la lista de signos de dificultad para respirar (¿se lee bien o alarma de más?) y el enlace a primeros auxilios.
- Que `test:e2e` pase con los 3 tests nuevos de respiración (7 en `cuando-urgencias`).
- D10a–D10e de `09-decisiones.md`.
- Comprobación manual de las citas de tóxicos: abrir el PDF AEP/SEUP «Intoxicaciones» (enlace en `04`) y el capítulo de la AEP, y buscar cada una con Ctrl+F; el validador no lee PDF. Abrir además la p. 334 del PDF SEUP (Figura 1, «8 acciones que no hay que hacer»): es una imagen y no la he leído; si añade algo, se incorpora.
- Revisar a ojo en móvil la ficha «Ingesta de tóxicos»: la lista de síntomas del rojo (¿se lee bien o alarma de más?) y el título del ámbar.
- Que `test:e2e` pase con el test nuevo de tóxicos (66 de 66) y que el arreglo de respiración haya quitado el fallo.
