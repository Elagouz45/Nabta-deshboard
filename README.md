# نبته | Nabtah Agricultural Solutions

Arabic-first agricultural commerce and knowledge frontend for Egypt. The app runs fully in **mock API mode** and is structured to connect to a Laravel `/api/v1` backend later.

## Technology stack

- Angular 22 (standalone, strict templates, SCSS, SSR + hydration, zoneless)
- Angular CDK (overlays/focus primitives available; UI is custom, not Material)
- `@lucide/angular` icons
- Vitest unit tests
- ESLint (`angular-eslint`) + Prettier

## Requirements

- Node.js `^22.22.3 || ^24.15.0 || >=26.0.0`
- npm 10+
- Angular CLI 22 (provided locally via the project)

This machine used **Node.js v22.23.2** with `@angular/cli@22` / Angular `22.1.x`.

## Installation

```bash
cd namaa-agri-commerce
npm install
```

## Development server

```bash
npm start
```

Open `http://localhost:4200`. Development uses `useMockApi: true`. `ng serve` is **client-only** so Vite does not hit a Windows SSR timeout while loading `@angular/ssr`. Production/SSR still uses `npm run build` / `npm run build:mock`.

## SSR development / production

```bash
npm run build:mock
npm run serve:ssr
```

The Node Express server listens on port `4000` by default.

API-ready production (no mock; requires Laravel):

```bash
npm run build
npm run serve:ssr
```

## Testing, lint, format

```bash
npm run test:ci
npm run lint
npm run format
```

## Project architecture

Feature-first layout under `src/app/`:

- `core/` brand, guards, interceptors, layout, models, SEO, locale
- `shared/` UI kit, pipes, validators
- `features/` storefront, account, admin
- `data-access/` abstract repositories + `mock/` + `api/`
- `state/` signal stores for cart, auth, wishlist, comparison, UI

See [docs/frontend-architecture.md](docs/frontend-architecture.md).

## Images

Local assets live in `src/assets/images/` and are served from `/assets/images/…`. Product packs and logos are original SVG mockups; scene photos are original WebP. Do not hotlink stock or copy competitor packs.

```bash
npm run images:packaging
npm run images:optimize
```

Inventory, licenses, and replacement status: [docs/image-assets.md](docs/image-assets.md).

## Mock API behavior

When `environment.useMockApi` is `true`, repositories read in-memory catalogs with a short delay. Cart, wishlist, comparison, language, and cookie consent persist through `StorageService` (localStorage on the browser only).

Guest checkout works. Logging in merges the guest cart into the user cart.

**Mock authentication is not production security.** Laravel must own real auth, authorization, validation, and payments.

## Switching to Laravel

1. Set `useMockApi: false` in `src/environments/environment.prod.ts` (already the default for `ng build`).
2. Point `apiBaseUrl` at the Laravel origin (or keep `/api/v1` behind a reverse proxy).
3. Implement the contract in [docs/api-contract.md](docs/api-contract.md).

## Environment variables / flags

| Flag | Dev | Production | Production-mock |
| --- | --- | --- | --- |
| `useMockApi` | true | false | true |
| `apiBaseUrl` | `/api/v1` | `/api/v1` | `/api/v1` |
| `enableDebugLogs` | true | false | false |

## Mock credentials (mock mode only)

| Role | Mobile | Password |
| --- | --- | --- |
| Customer | `01000000001` | `Namaa@123` |
| Admin | `01000000099` | `NamaaAdmin@123` |

Password reset / phone verify demo code: `123456`. Coupons: `NAMAA10`, `FERT50`.

## Main routes

`/`, `/shop`, `/search`, `/products/:slug`, `/companies`, `/brands`, `/crops`, `/crop-assistant`, `/compare`, `/wishlist`, `/cart`, `/checkout`, `/academy`, `/about`, `/contact`, `/faq`, `/policies/*`, `/auth/*`, `/account/*`, `/admin/*`

## Known limitations

- Card and wallet payments are placeholders. No card data is collected.
- Policy pages are labeled legal drafts, not lawyer-approved.
- Crop assistant results are potential relevance only, not a diagnosis.
- Images are original SVG placeholders. Replace files in `public/images/` with production photography (keep width/height/alt).
- Frontend guards do not replace backend authorization.

## Image replacement

Replace SVGs in `public/images/products`, `crops`, `articles`, and `brand` with optimized WebP/AVIF of the same aspect ratio. Keep `alt` text meaningful. Re-run `node scripts/generate-placeholders.mjs` only if you need to regenerate demos.

## Deployment notes

Build with `npm run build:mock` for a standalone demo, or `npm run build` behind Laravel. Serve the SSR bundle (`dist/namaa-agri-commerce/server/server.mjs`) on Node 22+. Put Laravel on `/api/v1`. Set `siteUrl` in the environment to the public origin for canonical/OG tags.
