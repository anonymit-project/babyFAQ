# Agentes y flujos de trabajo

## Principio
Nada se publica sin pasar por un Pull Request. Lo médico (Nivel 1 y 2) siempre lo aprueba el autor; la comprobación es administrativa (¿coincide el dato con la fuente enlazada?). Ver `05-politica-medica.md`.

## Capa 1 — sin coste (primero)
Scripts y GitHub Actions (gratuito en repos públicos): build Eleventy, validadores SEO, tests funcionales con Playwright (p. ej. cambiar kg ↔ lb y comprobar que el resultado se recalcula), monitor de cambios en fuentes oficiales (abre una issue con la diferencia), informe semanal de Search Console/GA4.

### Estado de la Capa 1 (2026-11-09)
Implantados: `scripts/validate-static.mjs`, `scripts/validate-sources.mjs`, `tests/*.spec.mjs` y `.github/workflows/validate.yml`. Por defecto el validador revisa las 7 herramientas de `DEFAULT_FILES` (todas de Nivel 1); las migradas de Nivel 3 se validan desde `_site` en `validate.yml`. Para otra herramienta se añade a `DEFAULT_FILES` y se escribe su test. Pendientes: monitor de cambios en fuentes, informe semanal de Search Console/GA4 y exigir los checks como obligatorios con protección de rama.
Piloto Eleventy (2026-11-09): `talla-zapato` se genera desde `src/herramientas/`; `validate.yml` construye y valida `_site/talla-zapato.html` y compara con el original guardado en `legacy/`.
Segunda migración (2026-11-23): `talla-panal` (D28a–D28c). `compare-equivalence.mjs` pasa a recibir el slug y a leer `scripts/equivalencia/<slug>.json`; `validate.yml` lleva un paso de equivalencia por herramienta migrada y `pages.yml` exige `_site/<slug>.html`. Cada herramienta migrada añade: plantilla y JSON en `src/herramientas/`, original en `legacy/`, config en `scripts/equivalencia/` y una línea en esos dos workflows.
Tercera migración (2026-11-23): `tallas-ropa` (D30a–D30d). Su CSS original no declara `--sage` ni `--sage-bg`, y `compare-equivalence.mjs` pasa a ignorar las variables CSS (`--*`) al buscar fugas del layout. Requiere que el original no use esas variables.
Cuarta migración (2026-11-24): `bolsa-hospital` (D31a–D31d). `compare-equivalence.mjs` admite `metaSustituciones` (cambios declarados en las meta del original) y `cssPropsAdmitidas` (propiedades del layout admitidas por selector). Se usan para la descripción (138 → 151 caracteres, el validador exige 140–155) y para el `text-align` del subtítulo.
Quinta migración (2026-11-25): `juguetes-edad` (D32a–D32f). `compare-equivalence.mjs` normaliza las comillas del script de Analytics y admite `jsSinDatos` y `jsConteos` (el bloque de datos del JS no se compara, solo su estructura) y `cssSelectoresAdmitidos` (selectores de elemento del layout, como `*`, que el original declara de otra forma). Requiere que el JS de lógica sea idéntico al original.
Sexta migración (2026-11-25): `porteo` (D33a–D33f). Sin cambios en `compare-equivalence.mjs`: usa `metaSustituciones` (og:title y og:description, porque el layout toma ambos del `<title>` y de `ogDescription`), `jsSinDatos` y `jsConteos`. El CSS original de `porteo` declara las mismas propiedades que el layout en los selectores comunes, así que no hizo falta `cssPropsAdmitidas` ni `cssSelectoresAdmitidos`.
Séptima migración (2026-11-26): `checker-productos` (D34a–D34e). `compare-equivalence.mjs` admite `jsonLdSustituciones` (sustituciones declaradas en el JSON-LD del original, salvo el FAQPage) además de `metaSustituciones`, `jsSinDatos` y `jsConteos`. Última herramienta de Nivel 3 con web propia migrada.

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
Estado (2026-11-26): el piloto y las otras 6 herramientas de Nivel 3 con web propia están migrados (D34e). Siguiente: Nivel 2, con la tabla «dato / fuente / enlace»; ver `ESTADO.md`.
