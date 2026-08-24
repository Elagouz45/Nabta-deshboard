import { readdirSync, statSync, unlinkSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(fileURLToPath(new URL('../src/assets/images', import.meta.url)));

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      walk(full, acc);
    } else if (extname(full).toLowerCase() === '.png') {
      acc.push(full);
    }
  }
  return acc;
}

const files = walk(root);
for (const file of files) {
  const out = file.replace(/\.png$/i, '.webp');
  const isHero = file.includes('hero');
  const isArticle = file.includes('academy');
  const quality = isHero ? 78 : isArticle ? 72 : 70;
  await sharp(file).webp({ quality }).toFile(out);
  unlinkSync(file);
  const kb = Math.round(statSync(out).size / 1024);
  console.log(out.replace(root, ''), `${kb} KB`);
}
