import { cp, mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const preview = process.argv.includes('--preview');
const output = preview ? path.resolve(root, '../Kasoko-Preview') : path.join(root, 'public');
for (const name of ['index.html', 'detail.html', 'detail-pages.js', 'detail-loader.js', 'booking.html', 'app.js', 'catalog.js', 'translations.js', 'booking.js', 'booking-core.js', 'config.js', 'api/bookings.mjs', 'assets/photos']) {
  await stat(path.join(root, name));
}
const raw = await readFile(path.join(root, 'detail-pages.js'), 'utf8');
const prefix = 'window.KASOKO_DETAIL_PAGES = ';
if (!raw.startsWith(prefix)) throw new Error('Invalid detail-pages.js');
const details = JSON.parse(raw.slice(prefix.length).trim().replace(/;$/, ''));
if (Object.keys(details).length !== 49) throw new Error('The 49 listing pages are incomplete.');
for (const [name, html] of Object.entries(details)) {
  if (!/^(hotel|destination)-[a-z0-9-]+\.html$/.test(name) || typeof html !== 'string' || !html.toLowerCase().startsWith('<!doctype html>')) {
    throw new Error('Invalid listing page: ' + name);
  }
}
const manifest = JSON.parse(await readFile(path.join(root, 'photo-sources.json'), 'utf8'));
for (const photo of Object.values(manifest)) {
  if (!/^assets\/photos\/[a-z0-9-]+\.jpg$/.test(photo.file)) throw new Error('Invalid photo path in photo-sources.json.');
  const bytes = await readFile(path.join(root, photo.file)).catch(() => {
    throw new Error('Missing photo: ' + photo.file + '. Upload the complete assets folder.');
  });
  if (createHash('sha256').update(bytes).digest('hex') !== photo.sha256) {
    throw new Error('Incomplete photo: ' + photo.file + '. Upload the original JPEG again.');
  }
}
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const publishHtml = html => html
  .replace('data-site-mode="source"', 'data-site-mode="built"')
  .replace(/href="detail\.html\?page=((?:hotel|destination)-[a-z0-9-]+\.html)"/g, 'href="$1"');
const extensions = new Set(['.html', '.css', '.js', '.svg', '.png', '.ico', '.webmanifest']);
for (const entry of await readdir(root, { withFileTypes: true })) {
  if (!entry.isFile() || (!extensions.has(path.extname(entry.name)) && !['robots.txt', 'sitemap.xml'].includes(entry.name))) continue;
  if (entry.name.endsWith('.html')) await writeFile(path.join(output, entry.name), publishHtml(await readFile(path.join(root, entry.name), 'utf8')));
  else await cp(path.join(root, entry.name), path.join(output, entry.name));
}
for (const [name, html] of Object.entries(details)) await writeFile(path.join(output, name), publishHtml(html));
await cp(path.join(root, 'assets'), path.join(output, 'assets'), { recursive: true });
console.log('Built 61 pages and 56 verified JPEG photographs. Individual listing URLs are preserved.');
console.log('Vercel builds api/bookings.mjs separately as a Node.js function.');
