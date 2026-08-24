import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

function write(rel, svg) {
  const path = join(root, rel);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, svg);
}

function svg(w, h, title, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${escapeXml(title)}">
  <title>${escapeXml(title)}</title>
  ${body}
</svg>`;
}

function escapeXml(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

write(
  'images/brand/logo.svg',
  svg(
    160,
    36,
    'شعار نبته',
    `<g transform="translate(2 2) scale(0.66667)">
      <rect width="48" height="48" rx="12" fill="#173F2A"/>
      <path d="M24 38 V22" fill="none" stroke="#EAF4EC" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M24 26C16.2 27.2 10.8 21.4 12.4 14.8C18.8 16.2 22.6 20.8 24 26Z" fill="#1F6A43"/>
      <path d="M24 23.5C31.6 21.6 37.8 15.6 36.2 10.4C29.4 12.2 25.6 17.4 24 23.5Z" fill="#EAF4EC"/>
    </g>
     <text x="42" y="26" fill="#173F2A" font-size="22" font-weight="700" font-family="Alexandria, Tajawal, Tahoma, sans-serif">نبته</text>`,
  ),
);

write(
  'images/brand/mark.svg',
  svg(
    48,
    48,
    'علامة نبته',
    `<rect width="48" height="48" rx="12" fill="#173F2A"/>
     <path d="M24 38 V22" fill="none" stroke="#EAF4EC" stroke-width="2.2" stroke-linecap="round"/>
     <path d="M24 26C16.2 27.2 10.8 21.4 12.4 14.8C18.8 16.2 22.6 20.8 24 26Z" fill="#1F6A43"/>
     <path d="M24 23.5C31.6 21.6 37.8 15.6 36.2 10.4C29.4 12.2 25.6 17.4 24 23.5Z" fill="#EAF4EC"/>`,
  ),
);

write(
  'images/hero-field.svg',
  svg(
    960,
    720,
    'حقل زراعي عند الفجر',
    `<rect width="960" height="720" fill="#EAF4EC"/>
     <rect y="420" width="960" height="300" fill="#173F2A"/>
     <path d="M0 430 C160 380 280 480 480 400 C680 320 820 430 960 360 L960 720 L0 720 Z" fill="#2F7D4A"/>
     <circle cx="760" cy="140" r="54" fill="#D99A3D"/>
     <rect x="120" y="250" width="28" height="180" fill="#24663C"/>
     <ellipse cx="134" cy="240" rx="40" ry="26" fill="#16794A"/>
     <rect x="210" y="280" width="22" height="150" fill="#24663C"/>
     <ellipse cx="221" cy="268" rx="32" ry="20" fill="#2F7D4A"/>`,
  ),
);

const palettes = ['#173F2A', '#2F7D4A', '#24663C', '#D99A3D', '#16794A', '#B76E00'];

function pack(id, title, color, label) {
  return svg(
    800,
    800,
    title,
    `<rect width="800" height="800" fill="#EAF4EC"/>
     <rect x="220" y="140" width="360" height="500" rx="28" fill="${color}"/>
     <rect x="250" y="180" width="300" height="80" rx="12" fill="#FAF8F3"/>
     <text x="400" y="230" text-anchor="middle" fill="#173F2A" font-size="28" font-family="Tahoma">${escapeXml(label)}</text>
     <circle cx="400" cy="430" r="70" fill="#FAF8F3" opacity=".2"/>
     <text x="400" y="600" text-anchor="middle" fill="#FAF8F3" font-size="22" font-family="Tahoma">${escapeXml(id)}</text>`,
  );
}

for (let i = 1; i <= 30; i++) {
  const id = `p${String(i).padStart(2, '0')}`;
  const color = palettes[i % palettes.length];
  write(`images/products/${id}.svg`, pack(id, `عبوة منتج ${id}`, color, 'نبته'));
  write(`images/products/${id}-detail.svg`, pack(id, `تفاصيل عبوة ${id}`, '#18231C', 'ملصق تجريبي'));
}

const cats = ['insecticides','fungicides','herbicides','nematicides','acaricides','fertilizers','nutrients','growth','salinity','supplies'];
cats.forEach((c, i) => {
  write(`images/categories/${c}.svg`, pack(c, `فئة ${c}`, palettes[i % palettes.length], c.slice(0, 8)));
});

['greenfield','nilecrops','fajr','deltachem','oasis','sina','valley','shams'].forEach((c, i) => {
  write(`images/companies/${c}.svg`, svg(240, 120, `شعار ${c}`, `<rect width="240" height="120" rx="16" fill="#F2EBDD"/><text x="120" y="68" text-anchor="middle" font-size="18" font-family="Tahoma" fill="#173F2A">${c}</text>`));
});
['haris','wafy','nadir','jazr','zahra','milh','hasad','adaat'].forEach((c) => {
  write(`images/brands/${c}.svg`, svg(240, 120, `علامة ${c}`, `<rect width="240" height="120" rx="16" fill="#EAF4EC"/><text x="120" y="68" text-anchor="middle" font-size="20" font-family="Tahoma" fill="#173F2A">${c}</text>`));
});

['wheat','potato','tomato','onion','citrus','mango','grapes','cucumber','pepper','strawberry'].forEach((c, i) => {
  write(`images/crops/${c}.svg`, pack(c, `محصول ${c}`, palettes[i % palettes.length], c));
});

const articles = ['wheat-rust','potato-blight','whitefly','roots','fruit-set','citrus-micro','salinity','mites','thrips','grape-mildew','mango','strawberry','grey-mold','nitrogen','viruses','sizing','greenhouse','spots','spray'];
articles.forEach((c, i) => {
  write(`images/articles/${c}.svg`, svg(1200, 630, `غلاف مقال ${c}`, `<rect width="1200" height="630" fill="${palettes[i % palettes.length]}"/><text x="80" y="340" fill="#FAF8F3" font-size="42" font-family="Tahoma">${c}</text>`));
});
['sara','omar','laila'].forEach((name, i) => {
  write(`images/authors/${name}.svg`, svg(160, 160, `صورة ${name}`, `<circle cx="80" cy="80" r="80" fill="${palettes[i]}"/><circle cx="80" cy="64" r="24" fill="#FAF8F3"/><ellipse cx="80" cy="124" rx="36" ry="22" fill="#FAF8F3"/>`));
});

console.log('SVG placeholders written');
