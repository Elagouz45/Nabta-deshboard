/**
 * Original Nabtah packaging, logos, placeholders, and UI illustrations.
 * Crisp Arabic labels — not photoreal stock and not competitor assets.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'assets');

function write(rel, contents) {
  const path = join(root, rel);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, contents);
}

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function svg(w, h, title, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}">
  <title>${esc(title)}</title>
  ${body}
</svg>
`;
}

const FOREST = '#173F2A';
const LEAF = '#2F7D4A';
const HOVER = '#24663C';
const MINT = '#EAF4EC';
const WARM = '#FAF8F3';
const SAND = '#F2EBDD';
const AMBER = '#D99A3D';
const TEXT = '#18231C';
const SPROUT = '#1F6A43';

const SEEDLING = `<rect width="48" height="48" rx="12" fill="${FOREST}"/>
    <path d="M24 38 V22" fill="none" stroke="${MINT}" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M24 26C16.2 27.2 10.8 21.4 12.4 14.8C18.8 16.2 22.6 20.8 24 26Z" fill="${SPROUT}"/>
    <path d="M24 23.5C31.6 21.6 37.8 15.6 36.2 10.4C29.4 12.2 25.6 17.4 24 23.5Z" fill="${MINT}"/>`;

write(
  'images/brand/logo.svg',
  svg(
    160,
    36,
    'شعار نبته',
    `<g transform="translate(2 2) scale(0.66667)">${SEEDLING}</g>
     <text x="42" y="26" fill="${FOREST}" font-size="22" font-weight="700" font-family="Alexandria, Tajawal, Tahoma, sans-serif">نبته</text>`,
  ),
);

write(
  'images/brand/mark.svg',
  svg(
    48,
    48,
    'علامة نبته',
    SEEDLING,
  ),
);

function mark(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">${SEEDLING}</g>`;
}

function demoBadge(x, y) {
  return `<g transform="translate(${x} ${y})">
    <rect width="220" height="28" rx="8" fill="${AMBER}"/>
    <text x="110" y="19" text-anchor="middle" fill="${TEXT}" font-size="12" font-family="Tahoma, sans-serif">محتوى تجريبي</text>
  </g>`;
}

const PRODUCTS = [
  { id: 'p01', name: 'حارس بلس', cat: 'مبيد حشري', form: 'EC', size: '250 مل', vessel: 'bottle', color: '#1F6B3A', crop: 'طماطم' },
  { id: 'p02', name: 'حارس نوك', cat: 'مبيد حشري', form: 'SC', size: '500 مل', vessel: 'bottle', color: '#245C38', crop: 'عنب' },
  { id: 'p03', name: 'واقي درع', cat: 'مبيد فطري', form: 'WG', size: '400 جم', vessel: 'pouch', color: '#3A6B2A', crop: 'بطاطس' },
  { id: 'p04', name: 'واقي سيستم', cat: 'مبيد فطري', form: 'SC', size: '250 مل', vessel: 'bottle', color: '#2A5C4A', crop: 'مانجو' },
  { id: 'p05', name: 'حصاد كلين', cat: 'مبيد حشائش', form: 'SL', size: '1 لتر', vessel: 'jug', color: '#6B7A28', crop: 'قمح' },
  { id: 'p06', name: 'جذر جارد', cat: 'نيماتودا', form: 'GR', size: '5 كجم', vessel: 'bag', color: '#5A4630', crop: 'طماطم' },
  { id: 'p07', name: 'واقي مايت', cat: 'أكاروسيد', form: 'SC', size: '250 مل', vessel: 'bottle', color: '#7A4A1A', crop: 'موالح' },
  { id: 'p08', name: 'حصاد NPK', cat: 'سماد', form: 'ذواب', size: '5 كجم', vessel: 'bag', color: '#2F6B4A', crop: 'طماطم' },
  { id: 'p09', name: 'حصاد بوتاسيوم', cat: 'سماد', form: 'مسحوق', size: '5 كجم', vessel: 'bag', color: '#3D5A28', crop: 'فلفل' },
  { id: 'p10', name: 'نضير زنك', cat: 'مغذي', form: 'سائل', size: '1 لتر', vessel: 'jug', color: '#1A6B68', crop: 'موالح' },
  { id: 'p11', name: 'نضير ميكرو', cat: 'مغذي', form: 'مسحوق', size: '1 كجم', vessel: 'pouch', color: '#2A6B55', crop: 'فراولة' },
  { id: 'p12', name: 'نضير أمينو', cat: 'محفز حيوي', form: 'سائل', size: '1 لتر', vessel: 'jug', color: '#24663C', crop: 'طماطم' },
  { id: 'p13', name: 'زهرة ست', cat: 'منظم نمو', form: 'SL', size: '100 مل', vessel: 'vial', color: '#8A4A62', crop: 'طماطم' },
  { id: 'p14', name: 'زهرة سايز', cat: 'منظم نمو', form: 'سائل', size: '1 لتر', vessel: 'jug', color: '#6B3A58', crop: 'فلفل' },
  { id: 'p15', name: 'ملح لايت كالسيوم', cat: 'ملوحة', form: 'سائل', size: '5 لتر', vessel: 'can', color: '#3A5A6B', crop: 'بطاطس' },
  { id: 'p16', name: 'ملح لايت هيومك', cat: 'ملوحة', form: 'رقائق', size: '5 كجم', vessel: 'bag', color: '#3A3028', crop: 'قمح' },
  { id: 'p17', name: 'رشاش ظهر', cat: 'مستلزم', form: 'أداة', size: '16 لتر', vessel: 'sprayer', color: '#173F2A', crop: 'حقل' },
  { id: 'p18', name: 'حارس ثريبكس', cat: 'مبيد حشري', form: 'EC', size: '250 مل', vessel: 'bottle', color: '#1A5A32', crop: 'بصل' },
  { id: 'p19', name: 'واقي بوتري', cat: 'مبيد فطري', form: 'WP', size: '500 جم', vessel: 'pouch', color: '#4A6230', crop: 'فراولة' },
  { id: 'p20', name: 'نضير جذر', cat: 'مغذي', form: 'سائل', size: '1 لتر', vessel: 'jug', color: '#4A3A28', crop: 'بطاطس' },
  { id: 'p21', name: 'نترات كالسيوم', cat: 'سماد', form: 'كريستال', size: '5 كجم', vessel: 'bag', color: '#E8E4D8', crop: 'طماطم', dark: true },
  { id: 'p22', name: 'حارس أويل', cat: 'زيت صيفي', form: 'زيت', size: '1 لتر', vessel: 'jug', color: '#C4B070', crop: 'موالح', dark: true },
  { id: 'p23', name: 'واقي صدأ', cat: 'مبيد فطري', form: 'EC', size: '250 مل', vessel: 'bottle', color: '#6B2A28', crop: 'قمح' },
  { id: 'p24', name: 'بشابك ري', cat: 'مستلزم', form: 'طقم', size: '50 قطعة', vessel: 'kit', color: '#2A4A3A', crop: 'ري' },
  { id: 'p25', name: 'جذر بايو', cat: 'حيوي', form: 'سائل', size: '1 لتر', vessel: 'jug', color: '#2F7D4A', crop: 'طماطم' },
  { id: 'p26', name: 'واقي مايت أوف', cat: 'أكاروسيد', form: 'EC', size: '100 مل', vessel: 'vial', color: '#8A5A20', crop: 'فراولة' },
  { id: 'p27', name: 'نضير حديد', cat: 'مغذي', form: 'حبيبات', size: '1 كجم', vessel: 'pouch', color: '#8B2E1A', crop: 'موالح' },
  { id: 'p28', name: 'زهرة بلوم كال', cat: 'منظم نمو', form: 'سائل', size: '1 لتر', vessel: 'jug', color: '#6B4A78', crop: 'مانجو' },
  { id: 'p29', name: 'حصاد يوريا', cat: 'سماد', form: 'حبيبات', size: '10 كجم', vessel: 'bag', color: '#F2EBDD', crop: 'قمح', dark: true },
  { id: 'p30', name: 'مقياس EC', cat: 'مستلزم', form: 'جهاز', size: 'وحدة', vessel: 'meter', color: '#173F2A', crop: 'مياه' },
];

function ink(p) {
  return p.dark ? TEXT : WARM;
}

function bottle(p) {
  const tall = p.size.includes('500');
  const h = tall ? 420 : 360;
  const y = tall ? 160 : 190;
  return `
    <rect x="310" y="${y - 36}" width="180" height="36" rx="8" fill="${HOVER}"/>
    <rect x="340" y="${y - 58}" width="120" height="28" rx="6" fill="${FOREST}"/>
    <rect x="270" y="${y}" width="260" height="${h}" rx="28" fill="${p.color}"/>
    <rect x="292" y="${y + 24}" width="216" height="${h - 70}" rx="18" fill="${WARM}"/>
    ${mark(376, y + 40, 0.9)}
    <text x="400" y="${y + 150}" text-anchor="middle" fill="${FOREST}" font-size="28" font-family="Tahoma">${esc(p.name)}</text>
    <text x="400" y="${y + 186}" text-anchor="middle" fill="${LEAF}" font-size="16" font-family="Tahoma">${esc(p.cat)} · ${esc(p.form)}</text>
    <text x="400" y="${y + 216}" text-anchor="middle" fill="${TEXT}" font-size="18" font-family="Tahoma">${esc(p.size)}</text>
    <text x="400" y="${y + 250}" text-anchor="middle" fill="${HOVER}" font-size="14" font-family="Tahoma">محصول مرجعي: ${esc(p.crop)}</text>
    ${demoBadge(290, y + h - 50)}
  `;
}

function jug(p) {
  return `
    <path d="M300 220 h200 l30 40 v340 a28 28 0 0 1 -28 28 H298 a28 28 0 0 1 -28 -28 V260 Z" fill="${p.color}"/>
    <rect x="360" y="188" width="80" height="40" rx="8" fill="${FOREST}"/>
    <rect x="318" y="270" width="194" height="280" rx="16" fill="${WARM}"/>
    ${mark(377, 286, 0.85)}
    <text x="415" y="390" text-anchor="middle" fill="${FOREST}" font-size="24" font-family="Tahoma">${esc(p.name)}</text>
    <text x="415" y="422" text-anchor="middle" fill="${LEAF}" font-size="15" font-family="Tahoma">${esc(p.cat)} · ${esc(p.form)}</text>
    <text x="415" y="452" text-anchor="middle" fill="${TEXT}" font-size="18" font-family="Tahoma">${esc(p.size)}</text>
    <text x="415" y="484" text-anchor="middle" fill="${HOVER}" font-size="14" font-family="Tahoma">${esc(p.crop)}</text>
    ${demoBadge(298, 560)}
  `;
}

function pouch(p) {
  return `
    <path d="M250 170 q150 -40 300 0 v430 a24 24 0 0 1 -24 24 H274 a24 24 0 0 1 -24 -24 Z" fill="${p.color}"/>
    <rect x="278" y="220" width="244" height="340" rx="16" fill="${WARM}"/>
    ${mark(377, 240, 0.9)}
    <text x="400" y="350" text-anchor="middle" fill="${FOREST}" font-size="26" font-family="Tahoma">${esc(p.name)}</text>
    <text x="400" y="384" text-anchor="middle" fill="${LEAF}" font-size="16" font-family="Tahoma">${esc(p.cat)} · ${esc(p.form)}</text>
    <text x="400" y="418" text-anchor="middle" fill="${TEXT}" font-size="18" font-family="Tahoma">${esc(p.size)}</text>
    <text x="400" y="452" text-anchor="middle" fill="${HOVER}" font-size="14" font-family="Tahoma">${esc(p.crop)}</text>
    ${demoBadge(290, 500)}
  `;
}

function bag(p) {
  const fillInk = ink(p);
  const panel = p.dark ? WARM : MINT;
  return `
    <path d="M230 180 h340 l20 40 v420 H210 V220 Z" fill="${p.color}" stroke="${FOREST}" stroke-width="3"/>
    <rect x="250" y="230" width="300" height="360" rx="12" fill="${panel}"/>
    ${mark(376, 250, 0.9)}
    <text x="400" y="360" text-anchor="middle" fill="${FOREST}" font-size="26" font-family="Tahoma">${esc(p.name)}</text>
    <text x="400" y="396" text-anchor="middle" fill="${LEAF}" font-size="16" font-family="Tahoma">${esc(p.cat)} · ${esc(p.form)}</text>
    <text x="400" y="432" text-anchor="middle" fill="${TEXT}" font-size="20" font-family="Tahoma">${esc(p.size)}</text>
    <text x="400" y="468" text-anchor="middle" fill="${HOVER}" font-size="14" font-family="Tahoma">${esc(p.crop)}</text>
    ${demoBadge(290, 520)}
    <ellipse cx="400" cy="640" rx="90" ry="16" fill="#000" opacity=".08"/>
  `;
}

function vial(p) {
  return `
    <rect x="350" y="150" width="100" height="40" rx="8" fill="${FOREST}"/>
    <rect x="330" y="190" width="140" height="420" rx="20" fill="${p.color}"/>
    <rect x="348" y="220" width="104" height="300" rx="12" fill="${WARM}"/>
    ${mark(367, 236, 0.7)}
    <text x="400" y="340" text-anchor="middle" fill="${FOREST}" font-size="16" font-family="Tahoma">${esc(p.name)}</text>
    <text x="400" y="366" text-anchor="middle" fill="${LEAF}" font-size="13" font-family="Tahoma">${esc(p.form)}</text>
    <text x="400" y="392" text-anchor="middle" fill="${TEXT}" font-size="15" font-family="Tahoma">${esc(p.size)}</text>
    ${demoBadge(290, 540)}
  `;
}

function can(p) {
  return `
    <rect x="250" y="180" width="300" height="460" rx="24" fill="${p.color}"/>
    <rect x="270" y="210" width="260" height="400" rx="16" fill="${WARM}"/>
    ${mark(376, 230, 0.9)}
    <text x="400" y="340" text-anchor="middle" fill="${FOREST}" font-size="22" font-family="Tahoma">${esc(p.name)}</text>
    <text x="400" y="376" text-anchor="middle" fill="${LEAF}" font-size="16" font-family="Tahoma">${esc(p.cat)}</text>
    <text x="400" y="412" text-anchor="middle" fill="${TEXT}" font-size="20" font-family="Tahoma">${esc(p.size)}</text>
    <text x="400" y="448" text-anchor="middle" fill="${HOVER}" font-size="14" font-family="Tahoma">${esc(p.crop)}</text>
    ${demoBadge(290, 540)}
  `;
}

function sprayer() {
  return `
    <rect x="280" y="210" width="240" height="360" rx="28" fill="${FOREST}"/>
    <rect x="300" y="240" width="200" height="280" rx="16" fill="${LEAF}"/>
    <rect x="360" y="150" width="80" height="70" rx="12" fill="${HOVER}"/>
    <path d="M440 180 h90 v20 h-90" stroke="${AMBER}" stroke-width="10" fill="none"/>
    <circle cx="400" cy="380" r="36" fill="${WARM}"/>
    ${mark(376, 250, 0.8)}
    <text x="400" y="500" text-anchor="middle" fill="${WARM}" font-size="22" font-family="Tahoma">رشاش ظهر 16 لتر</text>
    ${demoBadge(290, 590)}
  `;
}

function kit() {
  return `
    <rect x="180" y="220" width="440" height="280" rx="20" fill="${SAND}" stroke="${FOREST}" stroke-width="3"/>
    <circle cx="280" cy="360" r="40" fill="${LEAF}"/>
    <circle cx="400" cy="360" r="40" fill="${HOVER}"/>
    <rect x="480" y="320" width="80" height="80" rx="10" fill="${FOREST}"/>
    ${mark(376, 240, 0.7)}
    <text x="400" y="540" text-anchor="middle" fill="${FOREST}" font-size="22" font-family="Tahoma">بشابك ري 16 مم</text>
    ${demoBadge(290, 570)}
  `;
}

function meter() {
  return `
    <rect x="270" y="180" width="260" height="380" rx="24" fill="${FOREST}"/>
    <rect x="294" y="210" width="212" height="140" rx="12" fill="#0E2418"/>
    <text x="400" y="290" text-anchor="middle" fill="${AMBER}" font-size="36" font-family="Tahoma">1.8</text>
    <text x="400" y="322" text-anchor="middle" fill="${MINT}" font-size="14" font-family="Tahoma">dS/m</text>
    <rect x="370" y="560" width="60" height="90" rx="8" fill="${LEAF}"/>
    ${mark(376, 370, 0.85)}
    <text x="400" y="500" text-anchor="middle" fill="${WARM}" font-size="20" font-family="Tahoma">مقياس EC</text>
    ${demoBadge(290, 670)}
  `;
}

function vesselBody(p) {
  switch (p.vessel) {
    case 'jug':
      return jug(p);
    case 'pouch':
      return pouch(p);
    case 'bag':
      return bag(p);
    case 'vial':
      return vial(p);
    case 'can':
      return can(p);
    case 'sprayer':
      return sprayer();
    case 'kit':
      return kit();
    case 'meter':
      return meter();
    default:
      return bottle(p);
  }
}

function packSvg(p, title) {
  return svg(
    800,
    800,
    title,
    `<rect width="800" height="800" fill="${WARM}"/>
     <rect x="40" y="40" width="720" height="720" rx="24" fill="${SAND}"/>
     ${vesselBody(p)}
     <ellipse cx="400" cy="740" rx="160" ry="18" fill="#000" opacity=".08"/>`,
  );
}

function detailSvg(p, title) {
  return svg(
    800,
    800,
    title,
    `<rect width="800" height="800" fill="${MINT}"/>
     <rect x="80" y="80" width="640" height="640" rx="28" fill="${WARM}"/>
     ${vesselBody({ ...p, name: p.form + ' · ' + p.size })}
     <text x="400" y="760" text-anchor="middle" fill="${FOREST}" font-size="16" font-family="Tahoma">تصوير عبوة تجريبي — ${esc(p.cat)}</text>`,
  );
}

for (const p of PRODUCTS) {
  write(`images/products/${p.id}-pack.svg`, packSvg(p, `عبوة ${p.name}`));
  write(`images/products/${p.id}-detail.svg`, detailSvg(p, `تفاصيل عبوة ${p.name}`));
}

const companies = [
  ['greenfield', 'جرين فيلد', '#173F2A'],
  ['nilecrops', 'النيل للمحاصيل', '#1A4A6B'],
  ['fajr', 'فجر الزراعة', '#6B3A1A'],
  ['deltachem', 'دلتا كيم', '#2A4A38'],
  ['oasis', 'واحة المغذيات', '#1A6B5A'],
  ['sina', 'سيناء أجرو', '#4A3A28'],
  ['valley', 'وادي الخير', '#24663C'],
  ['shams', 'شمس الأسمدة', '#B76E00'],
];

for (const [slug, name, color] of companies) {
  write(
    `images/companies/${slug}.svg`,
    svg(
      240,
      160,
      name,
      `<rect width="240" height="160" rx="16" fill="${WARM}"/>
       <rect x="16" y="16" width="208" height="128" rx="12" fill="${color}"/>
       <circle cx="56" cy="80" r="18" fill="${AMBER}"/>
       <text x="148" y="88" text-anchor="middle" fill="${WARM}" font-size="16" font-family="Tahoma">${esc(name)}</text>`,
    ),
  );
}

const brands = [
  ['haris', 'حارس', '#173F2A'],
  ['wafy', 'واقي', '#2F7D4A'],
  ['nadir', 'نضير', '#1A6B68'],
  ['jazr', 'جذر', '#5A4630'],
  ['zahra', 'زهرة', '#8A4A62'],
  ['milh', 'ملح لايت', '#3A5A6B'],
  ['hasad', 'حصاد', '#B76E00'],
  ['adaat', 'أداة', '#24663C'],
];

for (const [slug, name, color] of brands) {
  write(
    `images/brands/${slug}.svg`,
    svg(
      240,
      160,
      name,
      `<rect width="240" height="160" rx="16" fill="${SAND}"/>
       <rect x="70" y="28" width="100" height="64" rx="12" fill="${color}"/>
       <text x="120" y="120" text-anchor="middle" fill="${FOREST}" font-size="22" font-family="Tahoma">${esc(name)}</text>`,
    ),
  );
}

const authors = [
  ['sara', '#2F7D4A', 'س'],
  ['omar', '#24663C', 'ع'],
  ['laila', '#173F2A', 'ل'],
];
for (const [id, color, letter] of authors) {
  write(
    `images/authors/${id}.svg`,
    svg(
      160,
      160,
      letter,
      `<circle cx="80" cy="80" r="76" fill="${SAND}"/>
       <circle cx="80" cy="80" r="60" fill="${color}"/>
       <text x="80" y="96" text-anchor="middle" fill="${WARM}" font-size="48" font-family="Tahoma">${letter}</text>`,
    ),
  );
}

function placeholder(file, title, caption) {
  write(
    `images/placeholders/${file}`,
    svg(
      800,
      file.includes('article') ? 450 : 800,
      title,
      `<rect width="100%" height="100%" fill="${SAND}"/>
       <rect x="80" y="80" width="640" height="${file.includes('article') ? 290 : 640}" rx="24" fill="${MINT}"/>
       ${mark(376, file.includes('article') ? 140 : 280, 1)}
       <text x="400" y="${file.includes('article') ? 280 : 420}" text-anchor="middle" fill="${FOREST}" font-size="28" font-family="Tahoma">${esc(caption)}</text>`,
    ),
  );
}

placeholder('product-fallback.svg', 'صورة منتج بديلة', 'صورة المنتج غير متاحة');
placeholder('crop-fallback.svg', 'صورة محصول بديلة', 'صورة المحصول غير متاحة');
placeholder('article-fallback.svg', 'غلاف مقال بديل', 'صورة المقال غير متاحة');
placeholder('company-fallback.svg', 'شعار شركة بديل', 'الشعار غير متاح');
placeholder('avatar-fallback.svg', 'صورة شخصية بديلة', 'الصورة غير متاحة');
placeholder('problem-fallback.svg', 'صورة عرض بديلة', 'صورة إرشادية غير متاحة');

write(
  'images/ui/empty-harvest.svg',
  svg(
    480,
    320,
    'لا توجد نتائج',
    `<rect width="480" height="320" rx="16" fill="${SAND}"/>
     <ellipse cx="240" cy="210" rx="90" ry="28" fill="${MINT}"/>
     <path d="M240 80 v90" stroke="${FOREST}" stroke-width="8"/>
     <ellipse cx="240" cy="78" rx="50" ry="28" fill="${LEAF}"/>
     <text x="240" y="280" text-anchor="middle" fill="${FOREST}" font-size="18" font-family="Tahoma">لا توجد عناصر</text>`,
  ),
);

write(
  'images/ui/error-field.svg',
  svg(
    480,
    320,
    'خطأ',
    `<rect width="480" height="320" rx="16" fill="${SAND}"/>
     <circle cx="240" cy="140" r="56" fill="#B42318"/>
     <text x="240" y="154" text-anchor="middle" fill="${WARM}" font-size="48" font-family="Tahoma">!</text>
     <text x="240" y="250" text-anchor="middle" fill="${FOREST}" font-size="18" font-family="Tahoma">تعذر التحميل</text>`,
  ),
);

console.log('Wrote Nabtah packaging, logos, and placeholders to src/assets/images');
