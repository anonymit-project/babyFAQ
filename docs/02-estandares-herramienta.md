# Estándares obligatorios en CADA herramienta

## Estructura visual
- Back-link `← Volver al inicio` arriba izquierda · 13px · color var(--soft) → var(--terracota) en hover.
- Contenedor: max-width 440px mobile → ~860px desktop (media query desde 640px).
- h1: 28px mobile → 34px (480px) → 38px (640px).
- Cards en grid 2 columnas en desktop donde aplique; border-radius 20px, box-shadow sutil.
- Noise + blobs fijos como fondo decorativo; blobs reposicionados en desktop para no tapar contenido.

## SEO
- `<title>` con keyword principal · `<meta description>` 140–155 caracteres con llamada a la acción.
- `og:title` + `og:description` · `<link rel="canonical">` a la URL final.
- Un único `<h1>`, estructura semántica h2/h3 · texto total >600 palabras.
- JSON-LD (FAQPage donde aplique).

## Contenido
- Mínimo 3 secciones informativas al final (qué es X, cuándo preocuparse, consejos).
- Tono cálido y cercano, párrafos cortos, fácil de escanear.
- Sección "Fuentes consultadas" (2–4 organismos oficiales) antes del disclaimer médico final.
- Mostrar "Última revisión: fecha".

## Interactividad
- Hold-to-repeat en todos los selectores numéricos (touchstart + mousedown, aceleración progresiva).
- Resultados siempre dinámicos y contextuales, nunca un número sin explicación; al cambiar de unidad (p. ej. kg ↔ lb) todo el resultado y el texto se recalculan.
- Estados vacíos bien manejados.

## Técnico
- Google Analytics G-55NR11957W · `<link rel="icon" href="/favicon.svg" type="image/svg+xml">` · `<meta name="theme-color" content="#fdf6ee">` · `lang="es"`.
- `aria-label` en todos los controles interactivos (botones +/−, toggles).
- Disclaimer médico al pie en toda herramienta de salud.
- Sin dependencias de JS externo.
