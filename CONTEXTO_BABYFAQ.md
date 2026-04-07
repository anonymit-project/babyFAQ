# babyFAQ — Contexto completo del proyecto

## Qué es
Web de herramientas interactivas para padres primerizos en español.
URL: babyfaq.es · GitHub Pages + CDmon · GA: G-55NR11957W · Formspree: mqeyrwpg

## Stack
HTML + CSS + JS puro. Sin frameworks. Todo self-contained por herramienta.
Tipografías: Fraunces (titulares) + DM Sans (cuerpo)
Paleta: terracota #c97a5e · crema #fdf6ee · warm-white #fffcf8

---

## Inventario completo de herramientas (38 ficheros)

### 🤰 Embarazo (7)
- `fecha-parto.html` — Calculadora de fecha probable de parto
- `semanas-a-meses.html` — Conversor semanas de gestación a meses y trimestres
- `tamano-bebe.html` — Tamaño del bebé por semana (comparación con frutas/verduras)
- `patadas.html` — Contador de movimientos y patadas del bebé
- `peso-embarazo.html` — Ganancia de peso recomendada según IMC previo
- `contracciones.html` — Contador de contracciones con duración e intervalo
- `bolsa-hospital.html` — Lista de cosas para la bolsa del hospital

### 🤱 Lactancia (2)
- `tomas-leche.html` — ml por toma según edad y peso · ⚠️ NO encontrado en GitHub (verificar)
- `calculadora-lactancia.html` — Tiempo de espera tras beber alcohol para dar el pecho

### 🥣 Alimentación (3)
- `alimentos-edad.html` — Más de 150 alimentos con veredicto por edad
- `introduccion-solidos.html` — Guía de introducción a la alimentación complementaria
- `solidos-agua.html` — Cuándo introducir sólidos y agua, línea de tiempo

### 🌙 Sueño (5)
- `sueno-bebe.html` — Horas, siestas y ventana de sueño por meses
- `hora-acostarse.html` — Hora ideal de acostarse según edad y hora de despertar
- `regresiones-sueno.html` — Guía de regresiones: cuándo ocurren y cómo superarlas
- `cuna-a-cama.html` — Cuándo y cómo pasar de cuna a cama
- `ruido-bebe.html` — Ruido blanco: volúmenes seguros y tipos recomendados

### ❤️ Crecimiento y salud (12)
- `percentil.html` — Percentil peso y altura según tablas OMS (0–5 años)
- `desarrollo.html` — Hitos de desarrollo por etapas
- `revisiones-pediatra.html` — Calendario de revisiones y qué se comprueba en cada una
- `edad-corregida.html` — Calculadora de edad corregida para bebés prematuros
- `fiebre.html` — ¿Es fiebre? Umbral por edad y conversor °C/°F
- `dosis-fiebre.html` — Dosis de paracetamol e ibuprofeno por peso/edad (no duplicar)
- `cuando-urgencias.html` — ¿Urgencias o puede esperar? Guía por síntoma y edad
- `llanto-bebe.html` — Intérprete de llanto y qué hacer según el tipo
- `colicos-bebe.html` — Técnicas de alivio de cólicos con temporizador guiado
- `denticion.html` — Cuándo salen los dientes y en qué orden
- `control-esfinteres.html` — Señales de preparación y guía del proceso
- `juguetes-edad.html` — Juguetes recomendados por etapa de desarrollo

### 🛁 Higiene y cuidados (4)
- `bano-bebe.html` — Temperatura, frecuencia y técnica del baño
- `masaje-bebe.html` — Masaje infantil guiado por zonas y edad
- `denticion-alivio.html` — Técnicas y remedios para la incomodidad de la dentición
- `talla-panal.html` — Talla de pañal según el peso

### 👟 Ropa y tallas (2)
- `talla-zapato.html` — Talla de zapato por cm de pie (EU / US / UK)
- `tallas-ropa.html` — Conversor tallas ES / FR / US / UK por edad, altura o peso

### 🛡️ Seguridad (2)
- `primeros-auxilios.html` — Qué hacer ante atragantamiento, caídas y emergencias
- `silla-coche.html` — Grupos de silla, cuándo cambiar y cómo elegir

### 🛒 Compras (2)
- `checker-productos.html` — Veredicto honesto sobre productos de bebé
- `porteo.html` — Tipos de portabebés, posiciones seguras y cómo elegir

---

## Estándares obligatorios en CADA herramienta

### Estructura visual
- Back-link `← Volver al inicio` arriba izquierda · 13px · color var(--soft) → var(--terracota) en hover
- Contenedor: max-width 440px mobile → ~860px desktop (media query desde 640px)
- h1: 28px mobile → 34px (480px) → 38px (640px)
- Cards en grid 2 columnas en desktop donde aplique
- Blobs decorativos reposicionados en desktop para no tapar contenido
- Noise + blobs fijos como fondo decorativo
- Cards: border-radius 20px, box-shadow sutil

### SEO
- `<title>` con keyword principal
- `<meta description>` 140–155 caracteres con llamada a la acción
- `og:title` + `og:description`
- `<link rel="canonical">` apuntando a la URL final
- Un único `<h1>`, estructura semántica h2/h3
- Texto total >600 palabras en la página

### Contenido
- Mínimo 3 secciones informativas al final (ej: qué es X, cuándo preocuparse, consejos)
- Tono cálido y cercano, párrafos cortos, fácil de escanear
- Sección "Fuentes consultadas" con 2–4 organismos oficiales relevantes
  (OMS, AEP, AAP, Ministerio de Sanidad, ESPGHAN, NSF, AESAN…)
  colocada antes del disclaimer médico final

### Interactividad
- Hold-to-repeat en todos los selectores numéricos (touchstart + mousedown, aceleración progresiva)
- Resultados siempre dinámicos y contextuales, nunca un número sin explicación
- Estados vacíos bien manejados si el usuario no ha interactuado

### Técnico obligatorio
- Google Analytics G-55NR11957W
- `<link rel="icon" href="/favicon.svg" type="image/svg+xml">`
- `<meta name="theme-color" content="#fdf6ee">`
- `lang="es"` en `<html>`
- `aria-label` en todos los controles interactivos (botones +/−, toggles)
- Disclaimer médico al pie en todas las herramientas de salud
- Sin dependencias externas — cada fichero es self-contained

---

## Monetización
Amazon Afiliados. Mayor potencial de integración en:
`silla-coche.html` · `masaje-bebe.html` · `porteo.html` · `ruido-bebe.html`
(integrar enlaces a productos relevantes con `tag=` de Amazon)

---

## Flujo de trabajo
- Una herramienta a la vez. Cristian confirma recepción antes de pasar a la siguiente.
- Claude sugiere proactivamente la siguiente herramienta al terminar cada una.
- Responder siempre en español.

## Roadmap pendiente
- Reorganización del index completada en categorías (ver arriba)
- Badge-new en herramientas recién añadidas al index
- Pendiente revisar herramientas antiguas para aplicar estándares actuales (responsive desktop, fuentes, texto explicativo)
- ⚠️ Verificar si `tomas-leche.html` existe en el repo (no aparece en el listado de GitHub)
- `dosis-fiebre.html` ya cubre paracetamol e ibuprofeno — no crear herramienta separada

## Notas importantes
- Cada herramienta HTML es completamente autónoma (sin CSS compartido, sin JS externo)
- El index NO tiene back-link (es la página de inicio)
- Los ficheros `sw.js`, `manifest.json`, `robots.txt`, `sitemap.xml` ya existen — no sobreescribir sin revisar
