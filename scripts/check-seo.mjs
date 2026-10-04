import assert from 'node:assert/strict';

const base = (process.argv[2] || 'http://localhost:3018').replace(/\/$/, '');
const get = (path) => fetch(`${base}${path}`, { headers: { 'User-Agent': 'Googlebot' }, signal: AbortSignal.timeout(30000) });
const response = await get('/sitemap.xml');
assert.equal(response.status, 200);
const xml = await response.text();
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.ok(urls.length >= 11);
assert.equal(new Set(urls).size, urls.length);
assert.ok(!xml.includes('<lastmod>'));
const titles = new Set();
for (const url of urls) {
  const path = new URL(url).pathname;
  assert.ok(!path.startsWith('/admin') && !path.startsWith('/api'));
  const response = await get(path);
  assert.equal(response.status, 200, path);
  const html = await response.text();
  const canonical = [...html.matchAll(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/g)];
  assert.equal(canonical.length, 1, `${path}: una canónica`);
  assert.equal(new URL(canonical[0][1]).href, url);
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  assert.ok(title && !titles.has(title), `${path}: título propio`);
  assert.equal((title.match(/Qusqueando Travel/g) || []).length, 1, 'Marca sin duplicar');
  titles.add(title);
  const meta = (key, name) => html.match(new RegExp(`<meta ${key}="${name}" content="([^"]*)"`))?.[1];
  assert.equal(meta('property', 'og:title'), title);
  assert.equal(meta('name', 'twitter:title'), title);
  assert.equal(new URL(meta('property', 'og:url')).href, url);
  assert.ok(meta('name', 'description'));
  assert.equal(meta('property', 'og:description'), meta('name', 'description'));
  assert.ok(meta('property', 'og:image'));
  assert.ok(!meta('name', 'robots')?.includes('noindex'));
  const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)]
    .flatMap((match) => { const schema = JSON.parse(match[1]); return schema['@graph'] || schema; });
  assert.ok(schemas.some((schema) => schema['@type'] === 'TravelAgency'));
  assert.ok(schemas.some((schema) => schema['@type'] === 'WebSite'));
  if (path.startsWith('/experiencias/')) {
    const page = schemas.find((schema) => schema['@type'] === 'ItemPage');
    assert.equal(page?.url, url);
    assert.equal(page.breadcrumb.itemListElement[2].item, url);
  }
  console.log(`OK: ${path}`);
}
const admin = await (await get('/admin/login')).text();
assert.match(admin, /<meta name="robots" content="[^"]*noindex/);
const missing = await get('/experiencias/seo-no-existe-123');
assert.equal(missing.status, 404);
const robots = await (await get('/robots.txt')).text();
assert.ok(robots.includes('Disallow: /api/'));
assert.ok(!robots.includes('Disallow: /admin'));
assert.ok(robots.includes(`${new URL(urls[0]).origin}/sitemap.xml`));
console.log(`SEO validado: ${urls.length} páginas, sitemap, metadatos, datos estructurados, admin y 404.`);
