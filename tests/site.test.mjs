import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { parse } from 'parse5';

const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const englishHtml = readFileSync(new URL('../dist/en/index.html', import.meta.url), 'utf8');

function textContent(source) {
  const values = [];
  function visit(node) {
    if (node.nodeName === '#text' && node.value.trim()) values.push(node.value.trim());
    node.childNodes?.forEach(visit);
  }
  visit(parse(source));
  return values;
}

test('production HTML contains the profile and portfolio sections', () => {
  assert.match(html, /<html lang="fr">/);
  assert.match(html, /Antoine Mazé/);
  for (const id of ['contenu', 'accueil', 'apropos', 'expertises', 'projets', 'musique', 'contact']) {
    assert.ok(html.includes(`id="${id}"`), `Missing section: ${id}`);
  }
  assert.doesNotMatch(html, /\{%|\{\{|src="\/src\//);
});

test('internal anchors point to existing unique IDs', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(match[1]), match[1]);
});

test('four verified projects are available with two categories', () => {
  assert.equal([...html.matchAll(/data-category=/g)].length, 4);
  assert.equal([...html.matchAll(/data-category="ai"/g)].length, 2);
  assert.equal([...html.matchAll(/data-category="app"/g)].length, 2);
  for (const project of ['kinoshift', 'building-quotes-analysis', 'nextjs-supabase-auth-starterkit', 'RAG-OpenAI---PostgreSQL-on-Azure--demo-']) {
    assert.ok(html.includes(`https://github.com/antinmaze/${project}`));
  }
});

test('external new-tab links have appropriate isolation', () => {
  for (const match of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) assert.match(match[0], /rel="noopener noreferrer"/);
});

test('deployment includes custom domain and disables Jekyll', () => {
  assert.equal(readFileSync(new URL('../dist/CNAME', import.meta.url), 'utf8').trim(), 'antoinemaze.fr');
  const files = readdirSync(new URL('../dist/', import.meta.url));
  for (const file of ['.nojekyll', 'favicon.svg', 'robots.txt', 'sitemap.xml']) assert.ok(files.includes(file));
  assert.ok(!files.includes('Gemfile'));
  assert.ok(!files.includes('_config.yml'));
});

test('English is generated as a standalone static page with translated metadata', () => {
  assert.match(englishHtml, /<html lang="en">/);
  assert.match(englishHtml, /<title>Antoine Mazé — Architecture, Cloud &amp; Creativity<\/title>/);
  assert.match(englishHtml, /rel="canonical" href="https:\/\/antoinemaze.fr\/en\/"/);
  assert.match(englishHtml, /property="og:locale" content="en_GB"/);
  assert.ok(textContent(englishHtml).includes('From vision'));
  assert.ok(textContent(englishHtml).includes('AI, Cloud & innovation'));
  assert.ok(textContent(html).includes('AI, Cloud & innovation'));
});

test('all substantial French copy is translated in the static English page', () => {
  const englishText = new Set(textContent(englishHtml));
  for (const french of textContent(html)) {
    if (french.length > 40 && !/^[A-Z0-9 /·.↗]+$/.test(french)) {
      assert.ok(!englishText.has(french), `Untranslated text: ${french}`);
    }
  }
  assert.doesNotMatch(englishHtml, /je m’exprime|projets affichés|Ouvrir le menu|Filtrer les projets/);
});

test('both pages expose reciprocal language links and language selection', () => {
  for (const page of [html, englishHtml]) {
    assert.match(page, /hreflang="fr" href="https:\/\/antoinemaze.fr\/"/);
    assert.match(page, /hreflang="en" href="https:\/\/antoinemaze.fr\/en\/"/);
    assert.match(page, /href="\/" data-language="fr"/);
    assert.match(page, /href="\/en\/" data-language="en"/);
  }
  assert.match(html, /data-language="fr"[^>]*aria-current="page"/);
  assert.match(englishHtml, /data-language="en"[^>]*aria-current="page"/);
});

test('both languages declare native system color-scheme support', () => {
  for (const page of [html, englishHtml]) {
    assert.match(page, /name="color-scheme" content="light dark"/);
    assert.match(page, /name="theme-color" content="#111522" media="\(prefers-color-scheme: dark\)"/);
    assert.match(page, /name="theme-color" content="#fafbfc" media="\(prefers-color-scheme: light\)"/);
  }
  const styles = readdirSync(new URL('../dist/assets/', import.meta.url)).filter((file) => file.endsWith('.css'));
  assert.ok(styles.some((file) => readFileSync(new URL(`../dist/assets/${file}`, import.meta.url), 'utf8').includes('prefers-color-scheme:dark')));
});

test('legacy theme files are removed from the source tree', () => {
  for (const path of ['_includes', '_layouts', '_plugins', '_posts', '_sass', 'css', 'img', 'js', 'webfonts', 'Gemfile', 'Gemfile.lock', 'phantom.gemspec', '_config.yml', 'preview.jpg', 'CHANGELOG.md', 'CNAME']) {
    assert.ok(!existsSync(new URL(`../${path}`, import.meta.url)), `Legacy file or directory remains: ${path}`);
  }
});

test('both generated pages reference existing local resources only', () => {
  for (const source of [html, englishHtml]) {
    function visit(node) {
      for (const attr of node.attrs ?? []) {
        if (!['href', 'src'].includes(attr.name) || !attr.value.startsWith('/') || attr.value.startsWith('//')) continue;
        const path = attr.value.split(/[?#]/)[0];
        if (path === '/' || path === '/en/') continue;
        assert.ok(existsSync(new URL(`../dist${path}`, import.meta.url)), `Missing local resource: ${path}`);
      }
      node.childNodes?.forEach(visit);
    }
    visit(parse(source));
  }
});