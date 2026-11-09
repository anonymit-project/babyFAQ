# Voz y estilo — babyFAQ

Reglas de redacción para cualquier texto visible de una herramienta. Complementa `02-estandares-herramienta.md` (estructura) y `05-politica-medica.md` (qué se puede afirmar en salud).

## Tono
- Cálido y cercano, como un amigo informado, no como un manual. Tuteo ("tu bebé", "consúltalo").
- Párrafos de 2–4 frases. Una idea por párrafo. Frases cortas.
- Sin alarmismo y sin falsa tranquilidad: ni "es peligroso", ni "no te preocupes".
- Primero la respuesta, luego el matiz. El resultado de una herramienta nunca va sin explicación.

## Atribución y honestidad
- Todo dato de salud se atribuye: "Según la AAP…", "La AAP indica…". Nunca "está demostrado" ni "los expertos dicen".
- Si la fuente es extranjera (AAP, OMS), se dice. Si hay fuente española equivalente, se prefiere.
- Lo que calcula babyFAQ y no sale de una fuente se marca como "estimación de babyFAQ" en pantalla.
- Si la fuente no dice algo, no se dice. Mejor "la AAP no da cifras para esto" que rellenar.
- Se cierra con una derivación al pediatra o matrona cuando el caso se sale de la media. Sin repetirla en cada párrafo.

## Frases y palabras prohibidas (línea roja de 05; el validador las busca)
- "es seguro", "no pasa nada", "no hace falta ir al médico", "no es necesario ir al médico".
- Añadimos como regla de estilo, revisable en auditoría: "con total seguridad", "sin riesgo", "garantizado", "normal/anormal" aplicado al bebé.
- Alternativas válidas: "según la AAP, X es lo habitual", "suele bastar con…", "consulta a tu pediatra si…".
- Nunca diagnosticar: no "tu bebé tiene…", sí "esto puede ser compatible con… consulta".

## Números y formato
- Texto visible: coma decimal ("5,4 kg"), rangos con raya corta ("4–5 tomas"), espacio entre número y unidad ("960 ml").
- Fechas: "9 de noviembre de 2026" en "Última revisión".
- Unidades: ml, kg, cm. Si la fuente usa onzas o libras, se cita así y se añade la equivalencia (1 onza ≈ 30 ml, la que usa la AAP).
- Edades: "6 meses", "2 años", "recién nacido". Edad corregida solo si la herramienta la calcula.

## Estructura de contenido (resumen de 02)
- Mínimo 3 secciones informativas: qué es / cómo se calcula, cuándo consultar, consejos o preguntas frecuentes.
- Los h2 de FAQ van en forma de pregunta real que haría un padre ("¿Y si mi bebé no termina el biberón?").
- Las respuestas FAQ del JSON-LD son idénticas al texto visible (lo comprueba el validador).
- "Fuentes consultadas" antes del disclaimer; ver `04-fuentes-autorizadas.md` para qué puede ir ahí.

## Disclaimer médico (herramientas Nivel 1 y 2)
Debe contener la expresión "no sustituye" (la busca el validador). Modelo:
"Información orientativa basada en [fuentes]. No sustituye la valoración de un profesional sanitario. Cada bebé es diferente: consulta siempre con tu pediatra."

## Afiliados
Fuera del bloque de resultados y fuera de herramientas de salud. Ver `07-monetizacion.md`.

## Pendiente de decidir
- Decimales: los textos usan coma, pero los selectores muestran punto (`12.0`, `4.0`). No se cambia sin decisión; afecta a tests.
- `text-align: justify` en párrafos: se mantiene por ahora; revisar legibilidad en móvil.
