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
| AEP | Documento de primeros auxilios (PDF; sigue el ERC 2015) | https://static.aeped.es/capitulo_5_0_b962064ae5.pdf | 2026-11-11 (PDF; 4 citas comprobadas en el texto del capítulo publicado en aeped.es) · 2026-11-16 (PDF; citas de cuando-urgencias leídas por Claude, comprobación manual pendiente) | Aplicar agua fría durante 10-20 minutos | primeros-auxilios, cuando-urgencias |
| AEMPS | Ficha técnica Apiretal 100 mg/mL solución oral sabor cereza (rev. 07/2026) | https://cima.aemps.es/cima/dochtml/ft/76028/FT_76028.html | 2026-11-12 | destinado a su uso en niños de hasta 32 kg | dosis-fiebre, fiebre |
| AEMPS | Prospecto Apiretal 100 mg/mL solución oral sabor cereza | https://cima.aemps.es/cima/dochtml/p/76028/P_76028.html | 2026-11-12 | multiplicarse el peso del niño en kg por 0,15 | dosis-fiebre |
| AEMPS | Ficha técnica Dalsy 40 mg/mL suspensión oral (rev. 01/2026) | https://cima.aemps.es/cima/dochtml/ft/69726/FichaTecnica_69726.html | 2026-11-12 | es recomendable evitar el uso de ibuprofeno en caso de varicela | dosis-fiebre |
| AEMPS | Ficha técnica Dalsy 20 mg/mL suspensión oral | https://cima.aemps.es/cima/dochtml/ft/59166/FichaTecnica_59166.html | 2026-11-12 | menores de 3 meses o con peso inferior a 5 kg | dosis-fiebre |
| AEMPS | Ficha técnica Aspirina 500 mg granulado | https://cima.aemps.es/cima/dochtml/ft/67875/FichaTecnica_67875.html | 2026-11-12 | no deben administrarse a los niños, en particular a los menores de 16 años | dosis-fiebre |
| Servicio Aragonés de Salud (guía avalada por ArAPAP y SEUP, 2012; no está en la lista de organismos de `05`: uso secundario, solo alternancia) | Guía de dosificación en pediatría para atención primaria (PDF) | https://www.aepap.org/sites/default/files/documento/archivos-adjuntos/20120530_guia_pediatria.pdf | 2026-11-12 (PDF, verificación manual) | No deben alternarse de forma rutinaria | dosis-fiebre |
| AEP | Protocolo «Lactante febril» (Mintegi y Gómez, Protoc diagn ter pediatr 2020; PDF, 0–24 meses) | https://static.aeped.es/11_lactante_febril_4b1d3aeef7.pdf | 2026-11-15 (PDF, verificación manual) | en general, temperatura ≥38 °C, siendo el registro rectal el más adecuado | fiebre, dosis-fiebre |
| AEP | Protocolo «Manejo de la bronquiolitis aguda en la UCIP» (Pilar Orive y López Fernández, Protoc diagn ter pediatr 2021; PDF; protocolo de cuidados intensivos para profesionales) | https://static.aeped.es/21_bronquiolitis_ucip_f17182eb30.pdf | 2026-11-16 (PDF; texto leído por Claude, comprobación manual pendiente) | Letargia, deshidratación, afectación del estado general. | cuando-urgencias |
| AEP/SEUP | Protocolo «Intoxicaciones» (Martínez Sánchez y Mintegi Raso, Protoc diagn ter pediatr 2020; PDF; protocolo de urgencias hospitalarias para profesionales) | https://static.aeped.es/25_intoxicaciones_9c258fb7c6.pdf | 2026-11-17 (PDF; texto leído por Claude, comprobación manual pendiente; la Figura 1 es una imagen no leída) | Esta se basa en la aplicación de agua abundante durante 15 minutos. | cuando-urgencias |
| OMS | Patrones de crecimiento infantil 2006: peso para la edad, niñas, 0–5 años (percentiles; PDF) | https://cdn.who.int/media/docs/default-source/child-growth/child-growth-standards/indicators/weight-for-age/wfa-girls-0-5-percentiles.pdf?sfvrsn=1a008a84_11 | 2026-11-15 (PDF, verificación manual) | Weight-for-age GIRLS Birth to 5 years (percentiles) Percentiles (weight in kg) | dosis-fiebre |
| OMS | Patrones de crecimiento infantil 2006: peso para la edad, niños, 0–5 años (percentiles; PDF) | https://cdn.who.int/media/docs/default-source/child-growth/child-growth-standards/indicators/weight-for-age/wfa-boys-0-5-percentiles.pdf?sfvrsn=488e74e6_11 | 2026-11-15 (PDF, verificación manual) | Weight-for-age BOYS Birth to 5 years (percentiles) Percentiles (weight in kg) | dosis-fiebre |
| AEP/SEUP | Protocolo «Deshidratación aguda» (García Herrero, Olivas López de Soria y López Lois, Protoc diagn ter pediatr 2020; PDF; protocolo de urgencias hospitalarias para profesionales) | https://static.aeped.es/17_deshidratacion_1a2da41a4c.pdf | 2026-11-17 (PDF; texto leído por Claude, comprobación manual pendiente) | constituye el tratamiento de elección en la mayoría de los pacientes | cuando-urgencias |
| AEP/SEUP | Protocolo «Dolor abdominal agudo (abdomen agudo) en Urgencias» (Alonso Cadenas y de la Torre Espí, Protoc diagn ter pediatr 2020; PDF; protocolo de urgencias hospitalarias para profesionales) | https://static.aeped.es/16_abdomen_agudo_52075d0563.pdf | 2026-11-17 (PDF; texto leído por Claude, comprobación manual pendiente) | diagnosticar los procesos que requieren tratamiento urgente (quirúrgico o no) | cuando-urgencias |
| AEP | Protocolo «Sepsis» (Gómez Cortés, Protoc diagn ter pediatr 2020; PDF; protocolo de urgencias hospitalarias para profesionales; «actualizados al año 2020») | https://static.aeped.es/12_sepsis_26c79d4497.pdf | 2026-11-17 (PDF; texto leído por Claude, comprobación manual pendiente) | petequias/púrpura sugestiva de N. meningitidis | cuando-urgencias |
| AEP | Protocolo «Anafilaxia en Urgencias» (Olabarri García, Protoc diagn ter pediatr 2020; PDF; protocolo de urgencias hospitalarias para profesionales; «actualizados al año 2020») | https://static.aeped.es/07_anafilaxia_1d42a6f8fc.pdf | 2026-11-17 (PDF; texto leído por Claude, comprobación manual pendiente) | su administración nunca debe retrasarse en caso de que se sospeche una anafilaxia | cuando-urgencias |
| AEP | Protocolo «Mordeduras y picaduras de animales» (Pérez Cánovas, Protoc diagn ter pediatr 2020; PDF; protocolo de urgencias hospitalarias para profesionales; «actualizados al año 2020») | https://static.aeped.es/24_mordeduras_picaduras_407bef8de5.pdf | 2026-11-17 (PDF; texto leído por Claude, comprobación manual pendiente) | Se debe retirar el aguijón tras picadura de abeja | cuando-urgencias |
| AEP | Protocolo «Otitis media aguda y otitis externa. Mastoiditis» (Cruz Cañete y López Martín, Protoc diagn ter pediatr 2023; PDF; protocolo de infectología pediátrica para profesionales; «actualizados al año 2022») | https://www.aeped.es/sites/default/files/documentos/6_otitis.pdf | 2026-11-18 (PDF; texto leído por Claude, comprobación manual pendiente) | Persistencia de otalgia después de tres días o empeoramiento significativo en cualquier momento | cuando-urgencias |
| AEP | Protocolo «Sinusitis y sus complicaciones. Celulitis preseptal y orbitaria» (Baquero Artigao, Berghezan Suárez y Bravo Queipo de Llano, Protoc diagn ter pediatr 2023; PDF; protocolo de infectología pediátrica para profesionales; «actualizados al año 2022») | https://www.aeped.es/sites/default/files/documentos/5_sinusitis.pdf | 2026-11-18 (PDF; texto leído por Claude, comprobación manual pendiente) | Edema o eritema periorbitario (> 50% oclusión palpebral) | cuando-urgencias |
| AEP | Protocolo «Convulsiones febriles» (García Ron y Arriola Pereda, Protoc diagn ter pediatr 2022; PDF; protocolo hospitalario para profesionales; «actualizados al año 2022») | https://static.aeped.es/38_0_702f0d52ca.pdf | 2026-11-18 (PDF; texto leído por Claude, comprobación manual pendiente) | Cualquier signo de atipicidad. | cuando-urgencias |
| AAP (HealthyChildren; fuente estadounidense, no normativa española; solo para los pasos y los criterios de llamada de convulsiones, según «Fuentes de fuera de España»; página actualizada el 2019-06-26) | Primeros auxilios para convulsiones en los niños | https://www.healthychildren.org/Spanish/health-issues/injuries-emergencies/Paginas/seizures.aspx | 2026-11-18 (HTML; texto leído por Claude; `validate-sources` comprueba la cita) | Si la convulsión dura más de 5 minutos | cuando-urgencias |
| AEPap (sociedad de pediatría de atención primaria; no está en la lista de `05`: uso secundario, excepción 2026-11-18) | Programa de Salud Infantil, Consejos generales por tramos de edad (PDF de 2009; la cifra está en el apartado del recién nacido, p. 382) | https://aepap.org/wp-content/uploads/2024/02/PSI-Consejos-generales-por-tramos-de-edad.pdf | 2026-11-18 (PDF, verificación manual) | La temperatura ambiente debe estar alrededor de 22 °C. | temperatura-habitacion |
| AAP (fuente estadounidense, no normativa española) | Safe Sleep (página actualizada el 07/07/2025) | https://www.aap.org/en/patient-care/safe-sleep/ | 2026-11-18 (HTML; `validate-sources` comprueba la cita) | Keep loose blankets, pillows, stuffed toys, bumpers and other soft items | temperatura-habitacion |
| AAP (fuente estadounidense, no normativa española) | Política «Sleep-Related Infant Deaths: Updated 2022 Recommendations» (caduca a los 5 años si no se reafirma) | https://publications.aap.org/pediatrics/article/150/1/e2022057990/188304/Sleep-Related-Infant-Deaths-Updated-2022?autologincheck=redirected | 2026-11-18 (HTML; texto leído por Claude; si el servidor bloquea el validador saldrá como aviso) | it is difficult to provide specific room temperature guidelines to avoid overheating | temperatura-habitacion |
| The Lullaby Trust (organización benéfica británica, no organismo oficial: uso secundario, excepción 2026-11-18) | How to dress your baby for sleep (revisada el 28/02/2026) | https://www.lullabytrust.org.uk/baby-safety/baby-product-information/dress-your-baby-for-sleep/ | 2026-11-18 (HTML; `validate-sources` comprueba la cita) | The recommended room temperature for babies is 16 – 20°C | temperatura-habitacion |

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
