# babyFAQ — Contexto completo del proyecto

## Qué es
Web de herramientas interactivas para padres primerizos en español.
URL: babyfaq.es · GitHub Pages + CDmon · GA: G-55NR11957W · Formspree: mqeyrwpg

## Stack
HTML + CSS + JS puro. Sin frameworks. Todo self-contained por herramienta.
Tipografías: Fraunces (titulares) + DM Sans (cuerpo)
Paleta: terracota #c97a5e · crema #fdf6ee · warm-white #fffcf8

## Herramientas en el index (8)
- calculadora-lactancia.html — Alcohol y lactancia
- tomas-leche.html — Tomas de leche por edad y peso
- alimentos-edad.html — Alimentos por edad (150+ alimentos)
- percentil.html — Percentil peso y altura OMS
- talla-zapato.html — Talla de zapato por cm de pie
- tallas-ropa.html — Conversor tallas ES/FR/US/UK
- sueno-bebe.html — Sueño por meses
- checker-productos.html — Checker de productos

## Herramientas terminadas, pendientes de añadir al index (14)
edad-corregida, revisiones-pediatra, cuando-urgencias, colicos-bebe,
temperatura-habitacion, semanas-a-meses, masaje-bebe, bano-bebe,
silla-coche, ruido-bebe, primeros-auxilios, denticion-alivio,
introduccion-solidos, porteo

## Estándares obligatorios en cada herramienta

### Estructura visual
- Back-link "← Volver al inicio" arriba izquierda · 13px · color soft → terracota hover
- Contenedor: max-width 440px mobile → ~860px desktop
- h1: 28px mobile → 34px (480px) → 38px (640px)
- Cards en grid 2 columnas en desktop donde aplique
- Blobs decorativos reposicionados en desktop
- Noise + blobs fijos como fondo decorativo
- Cards: border-radius 20px, box-shadow sutil

### SEO
- <title> con keyword principal
- <meta description> 140-155 caracteres
- og:title + og:description
- <link rel="canonical">
- Un único <h1>, h2/h3 semánticos
- Texto total >600 palabras

### Contenido
- Mínimo 3 secciones informativas al final
  (ej: qué es X, cuándo preocuparse, consejos prácticos)
- Tono cálido y cercano, párrafos cortos
- Sección "Fuentes consultadas" con 2-4 organismos oficiales
  (OMS, AEP, AAP, Ministerio de Sanidad, ESPGHAN, NSF…)
  antes del disclaimer médico

### Interactividad
- Hold-to-repeat en todos los selectores numéricos
  (touchstart + mousedown, aceleración progresiva)
- Resultados dinámicos y contextuales
- Estados vacíos bien manejados

### Técnico obligatorio
- Google Analytics G-55NR11957W
- Favicon: <link rel="icon" href="/favicon.svg" type="image/svg+xml">
- <meta name="theme-color" content="#fdf6ee">
- lang="es" en <html>
- aria-label en todos los controles interactivos
- Disclaimer médico al pie

## Roadmap index
Reorganizar en categorías:
Embarazo · Lactancia · Alimentación · Sueño · 
Crecimiento y salud · Higiene y cuidados · 
Ropa y tallas · Seguridad · Compras

Badge-new en herramientas recién añadidas.

## Monetización
Amazon Afiliados. Mayor potencial en:
silla-coche, masaje-bebe, temperatura-habitacion, porteo

## Notas importantes
- dosis-fiebre ya cubre paracetamol e ibuprofeno — no duplicar
- Flujo: una herramienta a la vez, Cristian confirma recepción
- Claude debe sugerir proactivamente la siguiente herramienta