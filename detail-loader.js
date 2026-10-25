(() => {
  'use strict';
  const name = new URLSearchParams(location.search).get('page') || '';
  const pages = window.KASOKO_DETAIL_PAGES || {};
  if (!Object.prototype.hasOwnProperty.call(pages, name)) {
    document.title = 'Listing not found | Kasoko Safaris & Tours';
    document.querySelector('main').innerHTML = '<div class="container section"><h1>Listing not found</h1><p>Please choose a destination or hotel from the website.</p><a href="index.html">Return home</a></div>';
    return;
  }
  const page = new DOMParser().parseFromString(pages[name], 'text/html');
  page.body.querySelectorAll('script').forEach(script => script.remove());
  document.body.replaceWith(document.importNode(page.body, true));
  document.title = page.title;
  for (const selector of ['meta[name="description"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[property="og:url"]', 'meta[property="og:image"]', 'link[rel="canonical"]']) {
    const from = page.head.querySelector(selector), to = document.head.querySelector(selector);
    if (!from) continue;
    if (to) to.replaceWith(document.importNode(from, true));
    else document.head.append(document.importNode(from, true));
  }
})();
