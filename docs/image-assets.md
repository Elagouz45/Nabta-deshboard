# Nabtah image assets

All storefront media lives under `src/assets/images/` and is served at `/assets/images/…` via `angular.json` (`input: src/assets` → `/assets`).

## Source policy

- No competitor or zatonaz assets, no real-brand logos, no hotlinked stock URLs.
- **Scene photography** (hero, categories, crops, problems, academy): original photoreal images generated for Nabtah, stored locally as WebP. No intended embedded text in photos.
- **Product packaging:** original programmatic SVG mockups (`scripts/generate-packaging.mjs`) with readable Arabic labels, Nabtah mark, formulation, size, crop glyph, and a **محتوى تجريبي** badge.
- **Company/brand marks and avatars:** original SVG identities, not imitations of real logos.
- No Unsplash/Pexels files were required; none are logged here as stock replacements.

## Regeneration

```bash
npm run images:packaging   # SVG packs, logos, placeholders, UI
npm run images:optimize    # PNG → WebP (run after adding new photos)
```

Compress targets: ~150 KB crop/category thumbs, ~200 KB article cards, ~400 KB hero.

## Shared kit

- `app-image` wraps `NgOptimizedImage` for raster files and a normal `img` for SVG.
- `appImageFallback` / typed `IMAGE_FALLBACKS` never show the browser broken-image icon.
- Product gallery: 1:1 contain on `#FAF8F3`, thumbs, prev/next, CDK dialog lightbox (Escape, arrows). Mobile swipe on the main stage only; zoom is dialog-only (no pinch hijack).
- Homepage hero uses priority loading; everything else is lazy.

## Ratios

| Surface | Ratio | Fit |
| --- | --- | --- |
| Hero desktop / mobile | ~16:7 / 4:5 | cover + art direction |
| Product pack | 1:1 | contain on warm off-white |
| Categories / crops / problems | 4:3 | cover |
| Articles | 16:9 | cover |
| Logos | 3:2 | contain |
| Avatars | 1:1 | contain |

## Inventory

| Path | Origin | Usage | Status |
| --- | --- | --- | --- |
| `brand/logo.svg`, `brand/mark.svg` | original mockup | header, favicon | keep |
| `hero/hero-desktop.webp` | original generated | homepage hero (desktop) | demo photography |
| `hero/hero-mobile.webp` | original generated | homepage hero (narrow) | demo photography |
| `categories/*.webp` | original generated | 10 shop categories | demo photography |
| `crops/*-crop.webp` | original generated | 10 crops | demo photography |
| `problems/*.webp` | original generated | 16 plant problems + symptom map | demo photography |
| `academy/*.webp` | original generated | 19 article covers + `socialImage` | demo photography |
| `products/p01-pack.svg` … `p30-pack.svg` | original mockup | product thumb / gallery #1 | demo-mockup → replace-with-real-pack-shot |
| `products/p01-detail.svg` … `p30-detail.svg` | original mockup | gallery #2 | demo-mockup → replace-with-real-pack-shot |
| `products/liquid-formulation.webp` | original generated | gallery extra for EC/SC/SL/oil | related reuse across liquid SKUs |
| `products/granule-formulation.webp` | original generated | gallery extra for WG/WP/GR/powders | related reuse across granule SKUs |
| `crops/{slug}-crop.webp` as product gallery #4 | original generated | only when the product targets that crop | related, documented |
| `companies/*.svg`, `brands/*.svg` | original mockup | company/brand pages | keep until real identities |
| `authors/*.svg` | original mockup | academy bylines | keep |
| `placeholders/*-fallback.svg` | original mockup | typed fallbacks | keep |
| `ui/empty-harvest.svg`, `ui/error-field.svg` | original mockup | empty/error UI | keep |

### Problem files

`aphids`, `whitefly`, `thrips`, `spider-mite`, `powdery-mildew`, `late-blight`, `wheat-rust`, `root-knot-nematode`, `root-rot`, `salinity-stress`, `poor-fruit-set`, `small-fruit`, `leaf-yellowing`, `leaf-spots`, `wilting`, `chewing-insects`.

Symptoms reuse the **matching** problem photo (not an unrelated leaf). Mapping is in `SYMPTOM_FILES` / `SYMPTOM_VISUALS` in `crops.mock.ts`.

### Academy files

`wheat-rust`, `potato-blight`, `whitefly`, `roots`, `fruit-set`, `citrus-micro`, `salinity`, `mites`, `thrips`, `grape-mildew`, `mango`, `strawberry`, `grey-mold`, `nitrogen`, `viruses`, `sizing`, `greenhouse`, `spots`, `spray`.

## Crop assistant disclaimer

Shown on symptom (step 3) and results (step 5):

> الصور إرشادية وقد تتشابه الأعراض بين أكثر من مشكلة، لذلك يُفضّل الرجوع إلى مهندس زراعي للتشخيص الدقيق.
