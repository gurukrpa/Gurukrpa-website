// Simple HTML validator using cheerio
// Checks: missing alt on img, empty anchors, images with broken src format, missing lang on html, duplicate ids

const cheerio = require('cheerio');

function validateHtmlString(html) {
  const $ = cheerio.load(html);
  const issues = [];

  // html lang
  if ($('html').length && !$('html').attr('lang')) {
    issues.push({ type: 'a11y', message: 'Missing lang attribute on <html>' });
  }

  // img alt
  $('img').each((_, el) => {
    if (!$(el).attr('alt')) {
      issues.push({ type: 'a11y', message: 'Image missing alt attribute', selector: describe(el, $) });
    }
    const src = $(el).attr('src');
    if (!src || /\s/.test(src)) {
      issues.push({ type: 'content', message: 'Image src is missing or contains whitespace', selector: describe(el, $) });
    }
  });

  // anchors
  $('a').each((_, el) => {
    const href = $(el).attr('href');
    const text = $(el).text().trim();
    if (!href || href === '#') {
      issues.push({ type: 'link', message: 'Anchor missing or placeholder href', selector: describe(el, $) });
    }
    if (!text && !$(el).children().length) {
      issues.push({ type: 'content', message: 'Empty anchor text', selector: describe(el, $) });
    }
  });

  // duplicate ids
  const idCounts = {};
  $('[id]').each((_, el) => {
    const id = $(el).attr('id');
    idCounts[id] = (idCounts[id] || 0) + 1;
  });
  for (const [id, count] of Object.entries(idCounts)) {
    if (count > 1) issues.push({ type: 'html', message: `Duplicate id '${id}' appears ${count} times` });
  }

  return issues;
}

function describe(el, $) {
  const name = el.tagName;
  const id = $(el).attr('id');
  const cls = ($(el).attr('class') || '').split(/\s+/).filter(Boolean)[0];
  return [name, id ? `#${id}` : '', cls ? `.${cls}` : ''].join('');
}

module.exports = { validateHtmlString };
