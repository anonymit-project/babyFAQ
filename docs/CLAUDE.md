# babyFAQ — instrucciones para Claude (y agentes)

Web de herramientas interactivas para padres primerizos en español (babyfaq.es). 41 herramientas HTML/CSS/JS puro, GitHub Pages + CDmon. Autor anónimo.

## Reglas de oro
1. Responder siempre en español.
2. Una herramienta (o una tarea) a la vez. Al terminar, proponer proactivamente la siguiente.
3. Ningún dato de salud sin fuente oficial → `docs/05-politica-medica.md` (obligatorio leerlo antes de tocar herramientas de Nivel 1 o 2).
4. No cambiar URLs `.html` ni canonicals. No sobrescribir `sw.js`, `manifest.json`, `robots.txt`, `sitemap.xml` sin revisarlos.
5. Cambios quirúrgicos: devolver solo los bloques modificados con instrucción de dónde pegarlos; no reenviar ficheros completos.
6. Coste cero primero: scripts y validadores antes que agentes con API de pago.
7. Los enlaces de afiliados nunca van dentro de los resultados de una herramienta de salud.
8. No usar nombre ni datos personales del autor en ficheros del repo (es público).

## Dónde está cada cosa
- `ESTADO.md` — estado vivo, línea base de métricas y siguientes pasos. Leer primero.
- `data/inventario.json` — las 41 herramientas: nivel de riesgo, prioridad SEO, métricas, relacionadas, fuentes. Cargar solo si la tarea lo necesita (es grande).
- `docs/01-proyecto.md` · `02-estandares-herramienta.md` · `05-politica-medica.md` · `06-seo-roadmap.md` · `07-monetizacion.md` · `08-agentes-y-flujos.md` · `09-decisiones.md`
- Pendientes de crear: `03-voz-y-estilo.md`, `04-fuentes-autorizadas.md` (URLs oficiales verificadas a mano).

## Al terminar cada sesión
Actualizar `ESTADO.md` y, si hubo decisiones, añadirlas a `docs/09-decisiones.md`.
