# Política de contenido médico — babyFAQ

Documento de reglas obligatorias para cualquier persona o agente que modifique datos o textos de salud.
El sitio es anónimo y sin revisor médico: la fiabilidad se garantiza **por proceso**, no por autoridad.

## Principios

1. **Ningún dato de salud sin fuente oficial.** Cada cifra, umbral, dosis o plazo debe poder rastrearse a un documento de un organismo oficial (AEP, Ministerio de Sanidad, AEMPS, OMS, AAP, SEGO, ESPGHAN, AESAN…).
2. **Los datos viven en `data/*.json`, separados del código y del texto.** Cada registro lleva `fuente_url`, `fuente_organismo`, `fecha_consulta` y `cita_literal_breve` (máx. 15 palabras, solo para verificación interna).
3. **El agente no interpreta ni "mejora" la guía oficial.** Si la fuente no dice algo, la herramienta no lo dice.
4. **Ante duda o contradicción entre fuentes, se muestra el rango más conservador y se enlaza a ambas.** Nunca se elige la más cómoda.
5. **Nunca diagnosticar.** Las herramientas orientan; no sustituyen al pediatra. Toda página de salud mantiene el disclaimer al pie.
6. **Transparencia:** cada herramienta muestra "Última revisión: fecha" y enlaza a sus fuentes.

## Niveles de riesgo y qué exige cada uno

| Nivel | Qué es | Quién aprueba el PR | Requisitos |
|---|---|---|---|
| **1** | Un error podría dañar (dosis, fiebre, urgencias, primeros auxilios, alcohol y lactancia, alimentos y sólidos, tomas de leche, contracciones, ruido, temperatura/sueño seguro, silla de coche) | Siempre el autor, nunca auto-merge | Tabla "dato actual / dato en la fuente / enlace"; tests funcionales con valores esperados; monitor de cambios en fuentes activo |
| **2** | Cálculo o guía contra tablas oficiales (percentiles, vacunas, edad corregida, fecha de parto, hitos…) | El autor, revisión rápida de la tabla comparativa | Fuente por dato; tests de cálculo |
| **3** | No médicas (tallas, bolsa del hospital, juguetes, porteo, checker) | Auto-merge posible cuando pasen todos los validadores | Validadores SEO y funcionales en verde |

## Líneas rojas (el PR se rechaza automáticamente)

- Dosis, frecuencias o máximos diarios que no coincidan **exactamente** con la fuente citada.
- Texto que afirme que algo "es seguro", "no pasa nada" o "no hace falta ir al médico" sin respaldo literal de una fuente oficial.
- Umbrales de fiebre, de urgencia o de sueño seguro sin fuente y sin fecha.
- Cualquier cambio en Nivel 1 sin tests funcionales actualizados.
- Fuentes no oficiales (blogs, foros, tiendas) como base de un dato de salud.
- Recomendaciones de producto de afiliados dentro del bloque de resultados de una herramienta de salud.

## Qué comprueba el humano (sin criterio médico)

La revisión del Nivel 1 y 2 es **administrativa**: abrir el enlace de la fuente y confirmar que el número, la edad o la frase de la tabla coincide con el de la herramienta. Si el agente no puede aportar el enlace y la cita, el PR no se revisa: se devuelve.

## Límites conocidos

- Esto detecta errores de transcripción, de lógica y cambios en las fuentes. **No** valida si una guía oficial es discutible ni si el diseño de una herramienta de decisión (p. ej. urgencias) es adecuado.
- Si en el futuro hay un profesional sanitario dispuesto a revisar, empezar por `dosis-fiebre`, `fiebre`, `cuando-urgencias` y `primeros-auxilios`.
- Excepción documentada (2026-11-08, `tomas-leche`): se permite interpolar entre dos referencias oficiales si está marcado como estimación en pantalla, no se extrapola y hay tests sobre los anclajes. No aplica a otras herramientas sin nueva decisión.
- Excepción documentada (2026-11-09, `calculadora-lactancia`): se admiten como fuente del tiempo de espera documentos primarios arbitrados (ABM, Koren 2002) a falta de organismo de la lista, con cifra y parámetros literales, estimación marcada en pantalla y tests sobre anclajes. No aplica a otras herramientas sin nueva decisión.

## Orden de auditoría inicial (una herramienta a la vez)

1. `calculadora-lactancia` y `tomas-leche` (más impresiones y Nivel 1).
2. `primeros-auxilios`, `dosis-fiebre`, `fiebre`, `cuando-urgencias`.
3. `temperatura-habitacion` (recibe tráfico desde asistentes de IA y es de sueño seguro).
4. Resto de Nivel 1, luego Nivel 2.
