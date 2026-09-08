# Nabtah Admin Architecture Rules

These rules are mandatory for every change in this Angular application.

## Feature-based structure

- Organize business code under `src/app/features/<feature>/`.
- Each feature owns its routes, pages, components, models, API service, store or facade, mappers, and tests.
- Do not add new business pages to `src/app/pages/` or new domain types to a global models file.
- Migrate touched legacy code from `pages/`, `models.ts`, and `dashboard.store.ts` into its owning feature when safe.

## Naming

- Use kebab-case for folders, files, selectors, CSS classes, and route paths.
- Use PascalCase for types and classes, camelCase for members, and UPPER_SNAKE_CASE only for genuine constants.

## Shared and core boundaries

- `shared/` contains generic reusable presentation or infrastructure only; it must not call feature APIs or encode domain rules.
- `core/` contains application-wide singleton infrastructure such as auth, guards, interceptors, configuration, error normalization, and layout infrastructure.
- Core must not import features. Features may import core and shared.
- This is a standalone Angular application; do not create a `CoreModule` or feature NgModules.

## Routing

- Lazy-load every major feature with `loadChildren` or `loadComponent`.
- Apply auth, feature, and permission guards at the correct route boundary.
- Keep direct navigation and refresh working for nested routes.

## Responsibility and state

- Keep pages focused on orchestration; move API access, mapping, domain state, and reusable presentation into focused files.
- Do not create a global store containing unrelated business domains.
- Use private writable signals and expose readonly signals where state is shared.
- Use `computed()` for derived values and `effect()` only for real side effects.
- Use RxJS for HTTP orchestration, cancellation, debounce, and async composition; do not duplicate the same state in Signals and Subjects.

## Lifecycle safety

- Prefer `AsyncPipe` for template Observables.
- Bind imperative subscriptions to lifecycle with `takeUntilDestroyed()`.
- Avoid nested subscriptions and clean up listeners, timers, observers, object URLs, and third-party instances.

## Required verification

- Keep TypeScript and Angular templates strict.
- Run the production build, lint, and relevant tests after material changes.
- Do not report a check as passed unless it was executed.
