# Angular architecture audit

## Current status

| Principle | Status | Evidence / remaining work |
| --- | --- | --- |
| Feature-based folder structure | Partial | Feature route boundaries exist, but legacy business pages remain in `src/app/pages`, domain models remain in `src/app/models.ts`, and multiple domains share `DashboardStore`. |
| Kebab-case naming | Pass for current files | Current folders, files, selectors, route paths, and CSS classes use kebab-case. Future files must follow the root rules. |
| Shared components isolation | Pass | `PageHeader` and `StatusBadge` are generic presentation components without API calls or feature business rules. |
| Core rules | Pass | The standalone application has no unnecessary `CoreModule`; auth, guards, interceptors, feature availability, and error normalization are in `core`. |
| Lazy loading | Pass | Major existing features use lazy route collections and pages use `loadComponent`. |
| Single responsibility | Partial | Sidebar configuration/service/component are separated, but `DashboardStore` currently owns orders, products, customers, overview aggregation, mapping, filtering, and notifications. |
| Memory leak prevention | Mostly pass | Router subscriptions use `takeUntilDestroyed`; resize listeners and drawer effects clean up. Legacy command subscriptions live in the application-scoped store, and timer ownership should move to a notification service during store migration. |
| Modern Signals architecture | Partial | Signals and computed state are used consistently for UI state, but shared writable signals are publicly exposed in `DashboardStore`, and feature state has not yet been separated into feature-scoped stores. |

## Required migration order

1. Extract a global notification service from `DashboardStore`.
2. Move order DTOs, models, mapper, API service, store, list page, and details page into `features/orders`.
3. Move product and inventory boundaries into their own features; inventory must consume inventory-specific models rather than the product list store.
4. Move customer, content, settings, and overview pages and state into their owning features.
5. Remove `src/app/pages`, `src/app/models.ts`, `src/app/demo-data.ts`, and `DashboardStore` only after all imports have migrated and tests pass.
6. Keep every step independently buildable; do not perform a blind bulk rename.
