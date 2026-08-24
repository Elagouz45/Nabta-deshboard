# Frontend architecture — Nabtah

## Feature structure

The app is standalone and feature-first. Public, account, checkout, and admin shells live in `src/app/core/layout`. Each feature folder owns its pages. Shared UI never imports feature pages.

## Data source abstraction

`provideDataAccess()` binds abstract repositories to mock or HTTP classes from `environment.useMockApi`.

Components inject `CatalogRepository`, `KnowledgeRepository`, or `AccountRepository` only. They never import mock JSON or `localStorage`.

## State

Signal stores (`CartStore`, `AuthStore`, `WishlistStore`, `ComparisonStore`, `UiStore`, `RecentlyViewedStore`) hold client state. Derived values use `computed`. HTTP stays on RxJS Observables.

NgRx was not added; the domain state is local and mock-friendly.

## Mock / API switching

- Dev: mock on.
- `ng build`: `environment.prod.ts` with `useMockApi: false`.
- `ng build --configuration=production-mock`: demo SSR without Laravel.

`Http*Repository` classes already map to `/api/v1` as documented in `api-contract.md`.

## Auth flow

Mock login returns a session token stored via `StorageService`. `authInterceptor` attaches `Authorization: Bearer` only when mock is off. Guards (`authGuard`, `guestGuard`, `adminGuard`) protect UI routes. **Laravel must enforce authorization on every API call.**

## SSR

`RenderMode.Server` is used for all routes (no static prerender of authenticated carts). `StorageService` no-ops on the server. Toasts and scroll listeners are browser-gated.

## SEO

`SeoService` sets title, description, robots, canonical, Open Graph, Twitter cards, and JSON-LD (Organization, WebSite search, Product, Article, BreadcrumbList). `lang`/`dir` come from `LocaleService` (`ar-EG` / RTL by default).

## Connecting Laravel later

1. Implement `/api/v1` per the contract.
2. Disable mock.
3. Configure CORS/proxy.
4. Replace mock JWT with real cookies or Sanctum/Passport tokens.
5. Keep frontend validation; never trust it as security.
