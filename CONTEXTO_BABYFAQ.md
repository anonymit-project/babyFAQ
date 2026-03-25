# CONTEXTO_BABYFAQ

## Proyecto
babyFAQ (babyfaq.es) — herramientas para padres primerizos  
GitHub Pages + dominio CDmon | GA: G-55NR11957W | Formspree: mqeyrwpg  
Stack: HTML + CSS + JS puro, sin frameworks, mobile-first

---

## Design system

Tipografías: Fraunces (serif, títulos) + DM Sans (sans, cuerpo)

```css
:root {
  --cream: #fdf6ee;
  --warm-white: #fffcf8;
  --blush: #f2c4b0;
  --terracota: #c97a5e;
  --deep: #3d2b1f;
  --mid: #7a5c4e;
  --soft: #c4a898;
}
```

---

## Patrones de diseño obligatorios

- Noise overlay fijo (opacity 0.025)
- Blobs decorativos con filter:blur
- Cards: border-radius 20px, box-shadow 0 2px 20px rgba(61,43,31,0.06)
- Section labels: 11px, font-weight 500, letter-spacing 0.1em, uppercase
- Hold-repeat engine en selectores numéricos: touchstart/mousedown con aceleración a los 10 steps
- Botones de acción: border-radius 16px, padding 18px, font-size 16px

---

## Patrón hold-repeat (copiar en cada herramienta con selectores numéricos)

```javascript
function makeHoldBtn(el, onStep) {
  let holdTimer=null, repeatTimer=null, step=0;
  function fire(){ onStep(parseInt(el.dataset.dir)); }
  function startHold(){
    fire(); step=1;
    holdTimer=setTimeout(()=>{
      repeatTimer=setInterval(()=>{ fire(); step++;
        if(step===10){clearInterval(repeatTimer);repeatTimer=setInterval(fire,60);}
      },150);
    },350);
  }
  function stopHold(){
    clearTimeout(holdTimer); clearInterval(repeatTimer);
    holdTimer=repeatTimer=null; step=0; el.classList.remove('pressing');
  }
  el.addEventListener('touchstart',e=>{ e.preventDefault();
    el.classList.add('pressing'); startHold(); },{passive:false});
  el.addEventListener('touchend',   stopHold,{passive:true});
  el.addEventListener('touchcancel',stopHold,{passive:true});
  el.addEventListener('mousedown',()=>{ el.classList.add('pressing'); startHold(); });
  el.addEventListener('mouseup',   stopHold);
  el.addEventListener('mouseleave',stopHold);
}
```

---

## Google Analytics (incluir en el `<head>` de todos los archivos)

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-55NR11957W"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag("js", new Date());
  gtag("config", "G-55NR11957W");
</script>
```

---

## Estructura SEO de cada página

```html
<title>[Herramienta descriptiva] · [subtítulo con keywords] · babyFAQ</title>
<meta name="description" content="[150-160 chars con keywords principales]">
<meta property="og:title" content="[mismo que title]">
<meta property="og:description" content="[mismo que description]">
<meta property="og:type" content="website">
<meta name="theme-color" content="#fdf6ee">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
```

---

## Herramientas publicadas

| Archivo | Herramienta |
|---|---|
| index.html | Home con lista de herramientas |
| calculadora-lactancia.html | Alcohol y lactancia — tiempo de espera para dar el pecho |
| tomas-leche.html | Tomas de leche — ml por toma según edad y peso |
| alimentos-edad.html | Alimentos por edad — 150+ alimentos con veredicto |
| percentil.html | Percentil OMS — peso y altura 0-5 años, niño y niña |
| talla-zapato.html | Talla de zapato — por cm de pie, EU/US/UK |
| tallas-ropa.html | Tallas de ropa — conversor ES/FR/US/UK por edad, altura o peso |
| sueno-bebe.html | Sueño por meses — siestas, horas totales, ventana de sueño |
| checker-productos.html | Checker de productos — veredicto honesto sobre qué comprar |
| sugerir.html | Formulario de sugerencias (Formspree mqeyrwpg) |

---

## Herramientas pendientes (marcadas "Pronto" en index.html)

- Cuándo introducir sólidos y agua (línea de tiempo visual mes a mes)
- Talla de pañal por peso
- ¿Cuándo pasar de cuna a cama? (señales y edad recomendada)
- ¿Es fiebre? (umbral por edad + conversor °C/°F)
- Dentición (cuándo salen los dientes y en qué orden)
- Calendario de vacunas oficial español por edad

---

## Monetización

- Amazon Afiliados — disclaimer ya incluido en footer de index.html
- Sin publicidad display
- Sin interés comercial explícito en el contenido de las herramientas

---

## Cómo usar este archivo con Claude

| Tarea | Qué pegar |
|---|---|
| Nueva herramienta | Este archivo `.md` |
| Editar una herramienta | Este `.md` + el archivo HTML concreto |
| Optimizar SEO | Este `.md` + los archivos HTML a optimizar |
| Añadir sección al index | Este `.md` + index.html |
