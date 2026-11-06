# Agentes y flujos de trabajo

## Principio
Nada se publica sin pasar por un Pull Request. Lo médico (Nivel 1 y 2) siempre lo aprueba el autor; la comprobación es administrativa (¿coincide el dato con la fuente enlazada?). Ver `05-politica-medica.md`.

## Capa 1 — sin coste (primero)
Scripts y GitHub Actions (gratuito en repos públicos): build Eleventy, validadores SEO, tests funcionales con Playwright (p. ej. cambiar kg ↔ lb y comprobar que el resultado se recalcula), monitor de cambios en fuentes oficiales (abre una issue con la diferencia), informe semanal de Search Console/GA4.

## Capa 2 — agentes con IA (solo con cuenta de API y presupuesto)
- **Verificador de fuentes:** prepara PR con tabla "dato actual / dato en la fuente / enlace / cita".
- **Redactor:** actualiza o crea textos siguiendo estándares y voz.
- **Revisor adversarial de seguridad:** busca dosis, diagnósticos o promesas peligrosas.
- **Analista:** resume el informe semanal y propone prioridades.
Mientras no haya API, los mismos flujos se hacen en chat, supervisados.

## Flujo por conversación
- Una conversación por herramienta o tarea; abrir con `CLAUDE.md` + `ESTADO.md` (+ el fichero concreto de la herramienta).
- Indicar cambios propios ANTES de empezar.
- Enviar solo lo necesario (p. ej. bloque `<head>` + últimas 40–50 líneas), nunca el repositorio completo.
- Al terminar: actualizar `ESTADO.md`.
- Un chat por tarea: al cerrar, Claude entrega un prompt de relevo para abrir el chat siguiente. Ese prompt solo lleva lo que no esté ya en el conocimiento del proyecto.
- Si el chat acumula muchos mensajes o cambia de tema, cerrar y abrir uno nuevo con el prompt de relevo.

## Orden de migración a Eleventy
1. `talla-zapato` (Nivel 3) como piloto: comprobar mismo URL, canonical y JSON-LD que el HTML actual.
2. Resto de Nivel 3, luego Nivel 2, luego Nivel 1 (con tests y tabla de fuentes).
Cada migración debe producir HTML equivalente al actual antes de sustituirlo.
