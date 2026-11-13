# Fuentes autorizadas — babyFAQ

Qué se considera fuente válida y qué fuentes están verificadas. Complementa `05-politica-medica.md`.

## Qué es una fuente válida
Un documento concreto (no la portada del organismo) de un organismo oficial, que contiene el dato tal cual. Se registra con URL, fecha de consulta y cita literal de máx. 15 palabras (lo comprueba `scripts/validate-sources.mjs`).

No son válidas para datos de salud: blogs, foros, tiendas, fabricantes, medios, asociaciones no oficiales. Una portada o una página temática general tampoco, salvo que contenga literalmente el dato.

## Organismos autorizados por tema
Sin URLs: las URLs solo entran en el registro cuando están verificadas.

| Tema | Organismos |
|---|---|
| Lactancia y alimentación del lactante | AEP, AAP, OMS, ESPGHAN, AESAN |
| Medicamentos y dosis | AEMPS (fichas técnicas), AEP |
| Vacunas y revisiones | Ministerio de Sanidad, AEP (CAV) |
| Embarazo y parto | SEGO, Ministerio de Sanidad |
| Crecimiento, desarrollo | OMS (patrones), AEP |
| Sueño seguro y temperatura | AEP, AAP |
| Primeros auxilios y urgencias | AEP, SEUP, ERC/CERCP |
| Silla de coche | DGT, reglamento ECE R129 |

Requieren decisión del autor antes de usarse (no están en la lista de `05`): IOM/NAM (`peso-embarazo`) y e-lactancia.org (`calculadora-lactancia`). Hasta decidir, no se usan como base de un dato.

## Fuentes de fuera de España
La AAP es estadounidense. Si es la única fuente con cifras, se acepta (precedente: `tomas-leche`), pero la página debe decirlo ("una fuente estadounidense, no normativa española"). Si hay contradicción con una fuente española, se muestra el rango más conservador y se enlazan ambas (principio 4 de `05`).

## Registro de fuentes verificadas
| Organismo | Documento | URL | Verificada | Cita (≤15 palabras) | Herramientas |
|---|---|---|---|---|---|
| AAP | Amount and Schedule of Baby Formula Feedings | https://www.healthychildren.org/English/ages-stages/baby/formula-feeding/Pages/Amount-and-Schedule-of-Formula-Feedings.aspx | 2026-11-08 | about 2½ ounces (75 mL) of infant formula a day for every pound | tomas-leche |
| AAP | How Often and How Much Should Your Baby Eat? | https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/how-often-and-how-much-should-your-baby-eat.aspx | 2026-11-08 | tops out at rougly 4.5 oz at a year of age | tomas-leche |
| Canadian Family Physician (Koren 2002, artículo revisado por pares, no organismo; excepción 2026-11-10) | Alcohol y lactancia, Tabla 1 | https://pmc.ncbi.nlm.nih.gov/articles/PMC2213923 | 2026-11-10 | waiting for complete elimination of alcohol from their breast milk | calculadora-lactancia. |
| ERC (traducción oficial AESP-RCP) | Guías 2025, resumen ejecutivo (SVB pediátrico, pp. 126–130) | https://www.erc.edu/media/vatl54cg/01_gl2025_exec-summary_es_v10.pdf | 2026-11-11 (PDF, verificación manual) | Utilice la técnica de los dos pulgares con las manos rodeando el tórax | primeros-auxilios |
| AEP | Documento de primeros auxilios (PDF; sigue el ERC 2015) | https://static.aeped.es/capitulo_5_0_b962064ae5.pdf | 2026-11-11 (PDF; 4 citas comprobadas en el texto del capítulo publicado en aeped.es) | Aplicar agua fría durante 10-20 minutos | primeros-auxilios |
| AEMPS | Ficha técnica Apiretal 100 mg/mL solución oral sabor cereza (rev. 07/2026) | https://cima.aemps.es/cima/dochtml/ft/76028/FT_76028.html | 2026-11-12 | destinado a su uso en niños de hasta 32 kg | dosis-fiebre |
| AEMPS | Prospecto Apiretal 100 mg/mL solución oral sabor cereza | https://cima.aemps.es/cima/dochtml/p/76028/P_76028.html | 2026-11-12 | multiplicarse el peso del niño en kg por 0,15 | dosis-fiebre |
| AEMPS | Ficha técnica Dalsy 40 mg/mL suspensión oral (rev. 01/2026) | https://cima.aemps.es/cima/dochtml/ft/69726/FichaTecnica_69726.html | 2026-11-12 | es recomendable evitar el uso de ibuprofeno en caso de varicela | dosis-fiebre |
| AEMPS | Ficha técnica Dalsy 20 mg/mL suspensión oral | https://cima.aemps.es/cima/dochtml/ft/59166/FichaTecnica_59166.html | 2026-11-12 | menores de 3 meses o con peso inferior a 5 kg | dosis-fiebre |
| AEMPS | Ficha técnica Aspirina 500 mg granulado | https://cima.aemps.es/cima/dochtml/ft/67875/FichaTecnica_67875.html | 2026-11-12 | no deben administrarse a los niños, en particular a los menores de 16 años | dosis-fiebre |
| Servicio Aragonés de Salud (guía avalada por ArAPAP y SEUP, 2012; no está en la lista de organismos de `05`: uso secundario, solo alternancia) | Guía de dosificación en pediatría para atención primaria (PDF) | https://www.aepap.org/sites/default/files/documento/archivos-adjuntos/20120530_guia_pediatria.pdf | 2026-11-12 (PDF, verificación manual) | No deben alternarse de forma rutinaria | dosis-fiebre |

## Candidatas pendientes de verificar
Enlaces que ya aparecen en páginas pero NO están verificados ni en el inventario. No cuentan como respaldo.

| Herramienta | Enlace actual en la página | Problema conocido |
|---|---|---|
| calculadora-lactancia | OMS y AEP (enlaces retirados de la página el 2026-11-10) | Portada y listado sin verificar; hay que localizar un documento concreto con el dato |
| calculadora-lactancia | AAP, "Breastfeeding Mother's Diet and Alcohol Use" (resumen en publications.aap.org: https://publications.aap.org/patiented/article-abstract/doi/10.1542/ppe_schmitt_032/82216/Breastfeeding-Mother-s-Diet-and-Alcohol-Use?redirectedFrom=fulltext) | Frase vista solo en previsualización ("wait at least 2 hours before nursing again"); falta texto completo. Conflicto: con 1 bebida y ≥ ~84 kg la tabla de Koren da menos de 2 h. Decisión 2026-11-10: sin tocar el cálculo hasta verificar |
| calculadora-lactancia | PNSD, Monografía Alcohol 2021 (PDF) | Cita vista a mano (UBE = 10 g); el validador no lee PDF y la página ya no usa UBE |
| talla-zapato (Nivel 3) | Portadas de AEP, AAP y Ministerio de Sanidad | No respaldan la tabla de tallas (ver abajo) |

## Cómo se verifica una fuente (sin ejecutar nada en local)
1. Abrir la URL a mano y localizar la frase con el dato.
2. Copiar una cita literal de máx. 15 palabras.
3. Añadir el objeto a `fuentes` en `data/inventario.json` (organismo, url, fecha_consulta, cita).
4. Subir en PR: el job `fuentes-y-tests` comprueba que la URL responde y que la cita aparece. Un aviso "!" significa que no se pudo comprobar, no que sea correcto.
5. Añadir la fila al registro de arriba.

## Nivel 3 (no médicas) — PROPUESTA, pendiente de confirmar
- "Fuentes consultadas" solo lista fuentes que respaldan una afirmación concreta de la página. Una portada que no respalda nada no se presenta como fuente.
- Las tablas de tallas se presentan como "orientativas, elaboradas por babyFAQ a partir de equivalencias habituales; varían según fabricante", sin atribuirlas a un organismo.
- Las afirmaciones de desarrollo (p. ej. "ir descalzo estimula…" en `talla-zapato`) sí necesitan fuente oficial real o se suavizan/eliminan.
- Esto contradice dos reglas actuales: el "2–4 organismos" de `02` y el check `Fuentes consultadas` obligatorio de `validate-static.mjs`. Habría que ajustar ambos.
