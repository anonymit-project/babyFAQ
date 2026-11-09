// Configuración de Eleventy para babyFAQ. Salida: _site (HTML puro, mismas URLs .html).
const FECHA = { timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric' };
const sinEtiquetas = s => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

module.exports = function (eleventyConfig) {
  // "2026-11-09" -> "9 de noviembre de 2026"
  eleventyConfig.addFilter('fechaLarga', iso =>
    new Date(`${iso}T00:00:00Z`).toLocaleDateString('es-ES', FECHA));

  // FAQPage generado desde los MISMOS datos que el texto visible: no pueden divergir.
  eleventyConfig.addFilter('faqJsonLd', faq =>
    JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map(q => ({
        '@type': 'Question',
        name: q.q,
        acceptedAnswer: { '@type': 'Answer', text: sinEtiquetas(q.a) }
      }))
    }, null, 2).replace(/</g, '\\u003c'));

  return {
    dir: { input: 'src', output: '_site', includes: '_includes', data: '_data' },
    templateFormats: ['njk'],
    htmlTemplateEngine: 'njk'
  };
};
