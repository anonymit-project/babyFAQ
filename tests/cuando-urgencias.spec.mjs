import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const URL_PAGE = pathToFileURL(path.resolve('cuando-urgencias.html')).href;
const AEP = 'https://static.aeped.es/capitulo_5_0_b962064ae5.pdf';

async function open(page) {
  // Bloquea Analytics y fuentes: los tests no deben contar como visitas en GA4.
  await page.route(/googletagmanager\.com|google-analytics\.com|fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.goto(URL_PAGE, { waitUntil: 'domcontentloaded' });
}

// Filtra por nombre, abre el único síntoma que queda y devuelve su texto visible.
async function ficha(page, nombre) {
  await page.fill('#search', nombre);
  await page.locator('.symptom-header').first().click();
  return (await page.locator('.symptom-content.open').innerText()).replace(/\s+/g, ' ').trim();
}
const niv = (page, sev) => page.locator(`.symptom-content.open .level-block.${sev}`).count();

test('golpe en la cabeza: signos de alarma y observación de la AEP, sin umbrales sin fuente', async ({ page }) => {
  await open(page);
  const t = await ficha(page, 'golpe en la cabeza');
  for (const s of ['Lactante menor de 1 año', 'alto impacto', 'más de 1 metro de altura', 'persistentes', 'líquido claro',
    'va a más, se hace largo o blando', '24–48 horas', 'cada 2–3 horas', 'un par de veces por la noche']) expect(t, s).toContain(s);
  expect(t).not.toMatch(/fontanela|más de 2|1–1,5|nuca|cama en menores|llora mucho más|se calma/);
  expect(await niv(page, 'red')).toBe(1);
  expect(await niv(page, 'amber')).toBe(0);
  expect(await niv(page, 'green')).toBe(1);
});

test('golpe en extremidades: signos y derivación de la AEP, sin criterios sin respaldo', async ({ page }) => {
  await open(page);
  const t = await ficha(page, 'golpe en extremidades');
  for (const s of ['fractura abierta', 'perdido su alineación', 'Palidez o frialdad en los dedos', 'centro sanitario u hospital más cercano',
    'por si necesita operación', 'no da criterios para golpes leves']) expect(t, s).toContain(s);
  expect(t).not.toMatch(/codo de niñera|subluxación|1–2 horas|hielo|elevación|muy intenso/);
  expect(await niv(page, 'red')).toBe(1);
  expect(await niv(page, 'amber')).toBe(1);
  expect(await niv(page, 'green')).toBe(0);
});

test('quemaduras: zonas de riesgo, eléctrica y enfriado según la AEP; sin tamaños ni edad', async ({ page }) => {
  await open(page);
  const t = await ficha(page, 'quemaduras');
  for (const s of ['llama siempre al 112', 'zonas de especial riesgo', 'palmas, plantas', 'avisa siempre al 112/061', 'centro hospitalario más cercano',
    '10–20 minutos', 'mínimo 20 minutos', 'No rompas las ampollas', '2.º grado', 'crema hidratante']) expect(t, s).toContain(s);
  expect(t).not.toMatch(/\b5 ?%|\b[35] cm|menor de 1 año|marrón|pomada|hielo|48 h/);
  expect(await niv(page, 'red')).toBe(1);
  expect(await niv(page, 'amber')).toBe(1);
  expect(await niv(page, 'green')).toBe(1);
});

test('página: enlaza el capítulo de la AEP una sola vez', async ({ page }) => {
  await open(page);
  expect(await page.locator(`a[href="${AEP}"]`).count()).toBe(1);
});


test('dificultad para respirar: signos de alarma de la AEP, sin cifras ni posturas sin fuente', async ({ page }) => {
  await open(page);
  const t = await ficha(page, 'dificultad para respirar');
  for (const s of ['avisar al 112', 'le duele el pecho', 'se le hunden los espacios entre las costillas', 'por encima del esternón',
    'cabeceo al respirar', 'tono azulado o grisáceo de los labios', 'silbidos al entrar o salir el aire', 'miedo a ahogarse',
    'primeros auxilios', 'no da criterios para una dificultad leve']) expect(t, s).toContain(s);
  expect(t).not.toMatch(/> ?60|> ?40|trípode|estridor|tos perruna|aspira los mocos|asma diagnosticada/);
  expect(await niv(page, 'red')).toBe(1);
  expect(await niv(page, 'amber')).toBe(1);
  expect(await niv(page, 'green')).toBe(0);
});

test('bronquiolitis: criterios de ingreso del protocolo de la AEP, sin pautas sin respaldo', async ({ page }) => {
  await open(page);
  const t = await ficha(page, 'bronquiolitis');
  for (const s of ['considerar el ingreso hospitalario', 'más de 70 respiraciones por minuto', 'Apnea', 'menores de 2 meses', 'Letargia',
    'menos del 50 %', 'menos de 32 semanas', 'más probabilidades de ingreso y de peor evolución', 'no da criterios para los casos leves']) expect(t, s).toContain(s);
  expect(t).not.toMatch(/días 3–5|posición incorporada|lavados nasales|no puede coordinar|rechazo total/i);
  expect(await niv(page, 'red')).toBe(1);
  expect(await niv(page, 'amber')).toBe(1);
  expect(await niv(page, 'green')).toBe(0);
});

test('atragantamiento: criterios de la AEP y sin urgencias sin respaldo tras expulsar el objeto', async ({ page }) => {
  await open(page);
  const t = await ficha(page, 'atragantamiento');
  for (const s of ['anímale a toser', 'ni sacarle el objeto de la boca a ciegas', 'la tos es ineficaz', 'casi no se oye', 'está morado',
    'ha perdido el conocimiento', 'no indica qué hacer cuando el objeto sale']) expect(t, s).toContain(s);
  expect(t).not.toMatch(/aunque el objeto salga|ve a urgencias para descartar/);
  expect(await niv(page, 'red')).toBe(1);
  expect(await niv(page, 'amber')).toBe(1);
  expect(await niv(page, 'green')).toBe(0);
});

const SEUP = 'https://static.aeped.es/25_intoxicaciones_9c258fb7c6.pdf';

test('ingesta de tóxicos: Toxicología, síntomas y no provocar el vómito según la AEP y la SEUP; sin textos retirados', async ({ page }) => {
  await open(page);
  expect(await page.locator(`a[href="${SEUP}"]`).count()).toBe(1);
  const t = await ficha(page, 'ingesta de tóxicos');
  for (const s of ['inconsciente o no respira con normalidad', 'posición de seguridad', 'centro sanitario cuanto antes', 'vómitos continuos',
    'babeo y dolor en la boca', '91 562 04 20', 'aunque esté bien', 'no se puede identificar', 'no intentes provocar el vómito',
    'agua abundante durante 15 minutos', 'envases', 'agua del retrete', 'gran cantidad', 'a la vista junto al teléfono']) expect(t, s).toContain(s);
  expect(t).not.toMatch(/pila|24 h|365|no pasa nada|salvo que el toxicólogo|perfora/i);
  expect(await niv(page, 'red')).toBe(1);
  expect(await niv(page, 'amber')).toBe(1);
  expect(await niv(page, 'green')).toBe(1);
});

const AEP_DESHIDRATACION = 'https://static.aeped.es/17_deshidratacion_1a2da41a4c.pdf';
const AEP_ABDOMEN = 'https://static.aeped.es/16_abdomen_agudo_52075d0563.pdf';

test('vómitos: bilis, shock y signos de alarma de deshidratación, 5 ml cada 2–5 min y lactancia según la AEP; sin cifras retiradas', async ({ page }) => {
  await open(page);
  expect(await page.locator(`a[href="${AEP_DESHIDRATACION}"]`).count()).toBe(1);
  const t = await ficha(page, 'vómitos');
  for (const s of ['Vómitos biliosos (de color verde), progresivos, abundantes y frecuentes', 'patología orgánica importante', 'piel pálida o moteada',
    'El shock descompensado es una urgencia vital', 'ausencia de lágrimas', 'fontanela hundida en los lactantes', 'pérdida de turgencia de la piel',
    'Vómitos persistentes tras un golpe en la cabeza', 'vómitos incoercibles', 'contraindicación relativa', 'no da cifras de número de vómitos',
    'deshidratación leve no detectable clínicamente', '5 ml de solución de rehidratación oral cada 2–5 minutos', 'no debe interrumpirse',
    'nunca debe diluirse', 'ni para preparar biberones']) expect(t, s).toContain(s);
  expect(t).not.toMatch(/estenosis|pilórica|proyectivos|8–10|más de 6 vómitos|4–6 horas|3–4 vómitos|espera 30|5–10 ml|zumos|refrescos|de farmacia|no es urgente/);
  expect(await niv(page, 'red')).toBe(1);
  expect(await niv(page, 'amber')).toBe(1);
  expect(await niv(page, 'green')).toBe(1);
});

test('diarrea: remite a deshidratación, sangre y menores de 3 meses según la AEP; sin cifras retiradas', async ({ page }) => {
  await open(page);
  const t = await ficha(page, 'diarrea');
  for (const s of ['ficha «Vómitos»', 'Fiebre con mal aspecto', 'mermelada de grosella', 'ficha «Dolor abdominal»', 'recoger un coprocultivo', 'moco y heces',
    'Menor de 3 meses', 'análisis de sangre', 'una apendicitis', 'no da cifras de número de deposiciones', 'dieta normal para la edad',
    'azúcares de absorción rápida', 'reposo intestinal', 'salvo vómitos reiterados', 'ni diluyas la leche de fórmula']) expect(t, s).toContain(s);
  expect(t).not.toMatch(/8–10|más de 8|5–7 días|4–5 deposiciones|menor de 2 meses|menor de 6 meses|no es obligatoria|acorta|sangre abundante/);
  expect(await niv(page, 'red')).toBe(1);
  expect(await niv(page, 'amber')).toBe(1);
  expect(await niv(page, 'green')).toBe(1);
});

test('dolor abdominal: abdomen agudo, apendicitis, invaginación y traumatismo según la AEP; sin verde ni cifras retiradas', async ({ page }) => {
  await open(page);
  expect(await page.locator(`a[href="${AEP_ABDOMEN}"]`).count()).toBe(1);
  const t = await ficha(page, 'dolor abdominal');
  for (const s of ['48–72 horas', 'abdomen agudo', 'más de 6 horas', 'localizado y fijo', 'causa quirúrgica', 'toser, saltar', 'menores de 5 años',
    'mermelada de grosella', '15–20 %', 'letargia, hipotonía', 'muy sugestivos de lesión intraabdominal', 'vómitos biliosos',
    'obstrucción y la invaginación intestinal', 'no da criterios para manejar el dolor abdominal en casa']) expect(t, s).toContain(s);
  expect(t).not.toMatch(/1–2 horas|muy duro|30–60|encoge|horas fijas|recurrente|Gases con/);
  expect(await niv(page, 'red')).toBe(1);
  expect(await niv(page, 'amber')).toBe(1);
  expect(await niv(page, 'green')).toBe(0);
});


const AEP_ANAFILAXIA = 'https://static.aeped.es/07_anafilaxia_1d42a6f8fc.pdf';
const AEP_SEPSIS = 'https://static.aeped.es/12_sepsis_26c79d4497.pdf';
const AEP_PICADURAS = 'https://static.aeped.es/24_mordeduras_picaduras_407bef8de5.pdf';

test('manchas en la piel con fiebre: petequias, sepsis y signos de mala circulación según la AEP; sin prueba del vaso ni verde', async ({ page }) => {
  await open(page);
  expect(await page.locator(`a[href="${AEP_SEPSIS}"]`).count()).toBe(1);
  const t = await ficha(page, 'manchas en la piel con fiebre');
  for (const s of ['Fiebre con petequias o púrpura', 'N. meningitidis (meningococo)', 'No esperes a ver cómo evoluciona', 'un peor pronóstico',
    'extremidades frías o moteadas', 'coloración pálida-sucia de la piel', 'muy lenta o con pausas', 'estado mental alterado',
    'más sutiles cuanto menor es el niño', 'corta evolución', 'fichas de fiebre según la edad', 'no da criterios para este caso',
    'tampoco describe cómo distinguir las petequias']) expect(t, s).toContain(s);
  expect(t).not.toMatch(/vaso|meningococcemia|roseola|crecen|se juntan|eczema|antibiótico|no requiere consulta/i);
  expect(await niv(page, 'red')).toBe(1);
  expect(await niv(page, 'amber')).toBe(1);
  expect(await niv(page, 'green')).toBe(0);
});

test('reacción alérgica: criterios de anafilaxia, adrenalina sin retraso y observación según la AEP; sin pautas retiradas', async ({ page }) => {
  await open(page);
  expect(await page.locator(`a[href="${AEP_ANAFILAXIA}"]`).count()).toBe(1);
  expect(await page.locator(`a[href="${AEP_PICADURAS}"]`).count()).toBe(1);
  const t = await ficha(page, 'reacción alérgica');
  for (const s of ['afectación de la piel o las mucosas', 'criterio de anafilaxia', 'urticaria generalizada', 'hinchazón de labios, úvula o lengua',
    'silbidos (sibilancias)', 'opresión en el pecho o en la garganta', 'ficha «Dificultad para respirar»', 'mareo, palidez, desmayo, flacidez o menos alerta',
    'dos o más de estos grupos de síntomas', 'autoinyector de adrenalina prescrito', 'úsalo y llama al 112', 'nunca debe retrasarse', 'ni deben retrasarla',
    'primeros auxilios', 'sin lesiones en la piel', 'no reemplazan al juicio clínico', 'aparecen muy rápido', 'al menos 6 horas', 'primeras 6–8 horas',
    'no dan criterios para estos casos', 'Alergología Infantil', 'retira el aguijón', 'no da más pautas para casa']) expect(t, s).toContain(s);
  expect(t).not.toMatch(/hidrocortisona|frío local|antihistamínico oral|alimento nuevo|voz ronca|tragar|pérdida de conocimiento|mg\/kg|roseola/i);
  expect(await niv(page, 'red')).toBe(1);
  expect(await niv(page, 'amber')).toBe(1);
  expect(await niv(page, 'green')).toBe(1);
});



const AEP_OTITIS = 'https://www.aeped.es/sites/default/files/documentos/6_otitis.pdf';
const AEP_SINUSITIS = 'https://www.aeped.es/sites/default/files/documentos/5_sinusitis.pdf';

test('problemas en los ojos: químico, celulitis orbitaria y párpado hinchado según la AEP y la SEUP; sin textos retirados ni verde', async ({ page }) => {
  await open(page);
  expect(await page.locator(`a[href="${AEP_SINUSITIS}"]`).count()).toBe(1);
  const t = await ficha(page, 'problemas en los ojos');
  for (const s of ['agua abundante durante 15 minutos', '91 562 04 20', 'ficha «Ingesta de tóxicos»', 'más de la mitad del ojo', 'visión doble',
    'dificultad para mover el ojo', 'celulitis orbitaria', 'Dolor al mover el ojo', 'ojo que sobresale', 'alteración del nivel de consciencia',
    'Lactante menor de 1 año', 'tratamiento intravenoso inicial', 'distinguirlas al principio puede ser complicado',
    'no dan criterios para conjuntivitis']) expect(t, s).toContain(s);
  expect(t).not.toMatch(/15–20|suero fisiológico|calor local|pupila|fotofobia|canal lagrimal|incrustado|mucho pus/i);
  expect(await niv(page, 'red')).toBe(1);
  expect(await niv(page, 'amber')).toBe(1);
  expect(await niv(page, 'green')).toBe(0);
});

test('dolor de oídos: mastoiditis, ingreso y criterios de antibiótico según la AEP; sin paracetamol ni verde', async ({ page }) => {
  await open(page);
  expect(await page.locator(`a[href="${AEP_OTITIS}"]`).count()).toBe(1);
  const t = await ficha(page, 'dolor de oídos');
  for (const s of ['Menor de 2 meses', 'ingreso hospitalario', 'dos o más de estos signos', 'pabellón de la oreja desplazado', 'dolor al presionar el hueso',
    'mastoiditis', 'Mal estado general', 'vómitos que impiden tolerar líquidos', 'pasados 3 días', 'Secreción espontánea', 'factor de mala evolución',
    'menor de 2 años con otitis en los dos oídos', 'fiebre ≥ 39 °C', 'otoscopia', 'No introduzcas bastoncillos',
    'no da criterios para manejar el dolor de oído en casa']) expect(t, s).toContain(s);
  expect(t).not.toMatch(/paracetamol|2–4 horas|perfora|cuello rígido|sanguinolenta|mal olor|24 h/i);
  expect(await niv(page, 'red')).toBe(1);
  expect(await niv(page, 'amber')).toBe(1);
  expect(await niv(page, 'green')).toBe(0);
});

test('apatía: alteración de consciencia, letargia y signos de mala circulación según la AEP; sin textos retirados ni verde', async ({ page }) => {
  await open(page);
  const t = await ficha(page, 'dificultad para despertar');
  for (const s of ['no respira con normalidad', 'primeros auxilios', 'Alteración del nivel de consciencia', 'sinusitis', 'shock en la deshidratación',
    'Letargia', 'ficha «Bronquiolitis»', 'estado mental alterado', 'extremidades frías o moteadas', 'coloración pálida-sucia',
    'ficha «Manchas en la piel con fiebre»', 'no da criterios para una somnolencia']) expect(t, s).toContain(s);
  expect(t).not.toMatch(/regresión|mirada perdida|más de un día|es normal|se despierta con normalidad|flácido/i);
  expect(await niv(page, 'red')).toBe(1);
  expect(await niv(page, 'amber')).toBe(1);
  expect(await niv(page, 'green')).toBe(0);
});

test('rechazo del alimento: remite a deshidratación, bronquiolitis y otitis según la AEP; sin cifras retiradas ni verde', async ({ page }) => {
  await open(page);
  const t = await ficha(page, 'rechazo del alimento');
  for (const s of ['Signos de deshidratación', 'lista completa de la ficha «Vómitos»', 'Fiebre con mal aspecto', 'menos del 50 % de lo habitual',
    'ficha «Bronquiolitis»', 'síntoma inespecífico de otitis', 'ficha «Dolor de oídos»', 'fuera de la bronquiolitis', 'no debe interrumpirse',
    'nunca debe diluirse']) expect(t, s).toContain(s);
  expect(t).not.toMatch(/8 h|huelga|dentición|completamente normal|menor de 3 meses|24 h|1–3 días/i);
  expect(await niv(page, 'red')).toBe(1);
  expect(await niv(page, 'amber')).toBe(1);
  expect(await niv(page, 'green')).toBe(0);
});

test('cierre: fuentes sin portadas, banner con convulsión, sin plazos ni textos retirados', async ({ page }) => {
  await open(page);
  const FUENTES = [
    'https://static.aeped.es/11_lactante_febril_4b1d3aeef7.pdf',
    'https://static.aeped.es/21_bronquiolitis_ucip_f17182eb30.pdf',
    'https://cima.aemps.es/cima/dochtml/ft/76028/FT_76028.html',
  ];
  for (const u of FUENTES) expect(await page.locator(`a[href="${u}"]`).count(), u).toBe(1);
  for (const h of ['https://www.aeped.es', 'https://www.mscbs.gob.es', 'https://www.seup.org', 'https://www.aap.org'])
    expect(await page.locator(`a[href="${h}"]`).count(), h).toBe(0);
  const body = (await page.locator('body').innerText()).replace(/\s+/g, ' ');
  expect(body).not.toMatch(/sin excepciones|inmune|8–10 horas|24 h, 365|mirada perdida|muy flácido|ido de más|antes de que pase el día|Sistema Nacional de Salud|reserva de agua/);
  expect(await page.locator('.emergency-sub').innerText()).toContain('convulsión');
  const datos = await page.evaluate(() => JSON.stringify(SYMPTOMS));
  expect(datos).not.toContain('Llama al pediatra hoy');
});


const AEP_CONVULSIONES = 'https://static.aeped.es/38_0_702f0d52ca.pdf';
const AAP_CONVULSIONES = 'https://www.healthychildren.org/Spanish/health-issues/injuries-emergencies/Paginas/seizures.aspx';

test('convulsión febril: pasos y criterios de llamada de la AAP, atipicidad de la AEP; sin plazos ni textos retirados', async ({ page }) => {
  await open(page);
  expect(await page.locator(`a[href="${AEP_CONVULSIONES}"]`).count()).toBe(1);
  expect(await page.locator(`a[href="${AAP_CONVULSIONES}"]`).count()).toBe(1);
  const banner = (await page.locator('.emergency-sub').innerText()).replace(/\s+/g, ' ');
  for (const s of ['convulsión', 'más de 5 minutos', 'es la primera', '(AAP)']) expect(banner, s).toContain(s);
  const t = await ficha(page, 'convulsión febril');
  for (const s of ['quédate a su lado', 'póngalo de lado', 'nada en la boca', 'mide cuánto dura', 'Llama al 112', 'primera convulsión',
    'más de 5 minutos', 'sin volver a la normalidad', 'si no se despierta', 'si ocurre en el agua', 'potencialmente mortal', 'habla del 911',
    'menor de 6 meses', 'clasifica como atípica', 'desviación de los ojos', 'más de 15 minutos', 'parálisis de Todd', 'plantear análisis de sangre',
    'signos meníngeos', 'fontanela abombada', 'punción lumbar', 'La AAP no fija plazo', 'dura menos de 15 minutos', 'no previenen',
    'esté más cómodo', 'pensado para profesionales']) expect(t, s).toContain(s);
  expect(t).not.toMatch(/hoy|valoración médica urgente|o no cede|cronometr|diazepam|midazolam|benigna|no pasa nada|es seguro/i);
  expect(await niv(page, 'red')).toBe(1);
  expect(await niv(page, 'amber')).toBe(1);
  expect(await niv(page, 'green')).toBe(0);
  const body = (await page.locator('body').innerText()).replace(/\s+/g, ' ');
  expect(body).toContain('Última revisión: 18 de noviembre de 2026');
  expect(body).toContain('una guía de la AAP (Estados Unidos)');
});
