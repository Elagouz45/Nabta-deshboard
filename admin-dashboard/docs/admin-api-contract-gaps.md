# Nabta Admin API contract gaps

This document is the integration boundary for the Angular Admin Dashboard. None of the endpoints below are considered implemented until the Laravel routes, policies, requests, and resources are available and verified. Production feature flags must remain disabled until then.

## Shared response rules

- JSON validation errors: HTTP `422`, `{ "message": string, "errors": Record<string, string[]> }`.
- Authorization: `401` for an invalid or expired session, `403` for a valid user without permission.
- Concurrent mutations: `409` with a safe Arabic message and the latest resource version when possible.
- Lists: items plus `page`, `pageSize`, `total`, and `totalPages`, or a documented Laravel paginator shape mapped at the feature boundary.
- Mutations return the final authoritative resource. Angular must not reconstruct stock, money, status, permissions, or allowed actions.

## Authentication

| Method | Suggested endpoint | Request | Response | Validation / permission |
|---|---|---|---|---|
| POST | `/api/v1/auth/login` | `{ mobile, password }` | `{ token, expiresAt, user }` | Valid Egyptian mobile and required password; admin-panel access required |
| GET | `/api/v1/me` | — | Current user with role and permission keys | Authenticated |
| POST | `/api/v1/auth/logout` | — | `204` | Authenticated; revoke the current token/session |

Laravel must confirm token transport, expiry/refresh behavior, session invalidation, and the canonical permission keys. Demo authentication remains development-only.

## Orders

- `GET /api/v1/admin/orders`: server search, status/payment/fulfillment/branch/date filters, sorting, and pagination; permission `orders.view`.
- `GET /api/v1/admin/orders/{order}`: full server totals, items/variants, addresses, payment, shipping, history, allocations, and `allowedActions`; permission `orders.view`.
- `POST /api/v1/admin/orders/{order}/transitions`: `{ action, reason?, version }`; returns the final order; dedicated transition permission.
- `GET /api/v1/admin/orders/{order}/fulfillment-options`: authoritative warehouse alternatives and unavailable quantities.
- `POST /api/v1/admin/orders/{order}/fulfillment`: `{ optionId, version }`; returns final allocation/order state and uses `409` for stale stock.

## Products and catalog

- Paginated product list/detail/create/update endpoints, with canonical product/variant/package/media DTOs and backend-defined statuses.
- Searchable category, brand, attribute, and value reference endpoints plus policy-safe CRUD where supported.
- Media upload/reorder/delete contracts, including size/type validation and progress-compatible upload responses.
- Import endpoints for template Blob, validation upload, preview result, apply confirmation, job status, and error-file Blob.
- Permissions must distinguish view/create/update/archive/import/media actions; SKU uniqueness and relational deletion rules remain server-side.

## Inventory and warehouses

- `GET /api/v1/admin/inventory-balances`: each row represents product variant/package + warehouse, including quantity, threshold, server status, version, and pagination.
- `POST /api/v1/admin/inventory-balances/{balance}/adjustments`: `{ newQuantity, reason, note?, version }`; validates non-negative/integer rules and returns final balance plus movement reference; dedicated adjustment permission.
- `GET /api/v1/admin/inventory-report`: active supported filters, Blob response, and RFC-compatible `Content-Disposition` filename.
- Warehouse list/detail and searchable balances, pending transfers, and recent movements endpoints.
- Transfer create/update/submit/approve/reject/execute/receive/cancel actions must return `allowedActions`, approval timeline, and final transfer state. Laravel owns transition rules and stale-stock conflicts.

## Content, team, reports, and settings

- Articles need list/detail/save plus explicit submit/review/approve/reject/schedule/publish/archive actions and backend-defined statuses.
- Team needs users, roles, backend-defined permission catalogue, assignable-permission constraints, and read-only activity-log pagination.
- Sales analysis needs one filterable response for KPIs, current/previous series, branches, monthly rows, and top products, plus a Blob export using the same filters.
- Settings need a versioned read/update contract describing supported fields and high-impact changes.
- Customers and discounts require documented privacy permissions, status enums, pagination, validation, and safe mutation/deletion rules.

## Activation checklist

For each feature: verify Laravel routes and policies, add DTO fixtures from real responses, implement mapper/store tests, enable the feature in the production environment, then verify permissions and failure states against the running API. Do not enable a feature based only on the suggested URLs above.
# Invoices

- Required list contract: `GET /api/v1/admin/invoices` with server-side `search`, `payment_status`, `branch_id`, `date_from`, `date_to`, `sort`, `direction`, `page`, and `per_page`. The response must include page items, pagination metadata, and summary counts calculated from the complete filtered query.
- Required details contract: `GET /api/v1/admin/invoices/{invoice}` returning immutable backend totals, customer and branch snapshots, line items, payment data, refunded and remaining amounts, and supported history.
- Required downloads: authenticated Blob endpoints `GET /api/v1/admin/invoices/export` and, when supported, `GET /api/v1/admin/invoices/{invoice}/pdf`, with safe `Content-Disposition` filenames.
- Laravel must define official permissions for list, details, export, PDF, print, payments, refunds, and void operations. Until supplied, invoices remain development-only and admin-only; no production endpoint or financial mutation is assumed.

# Payments

- Required list contract: `GET /api/v1/admin/payments` with server-side `search`, `status`, `method`, `period`, `page`, and `per_page`; the response must include filtered summary totals and pagination metadata.
- Required export: authenticated `GET /api/v1/admin/payments/export` using the active filters and returning a Blob with a safe filename.
- Laravel must define payment statuses, methods, branch scoping, currency, timezone, permissions, and any refund or reconciliation actions. Until supplied, the feature is development-only and no financial mutation is exposed.

# Shipping

- Required list contract: `GET /api/v1/admin/shipments` with server-side search, status, carrier, date-period, pagination, and full-query summary totals.
- Required export: authenticated `GET /api/v1/admin/shipments/export` using active filters and returning a Blob with a safe filename.
- Laravel must define official shipment statuses, carriers, expected-delivery rules, overdue calculation, branch scoping, permissions, and allowed shipment actions. Until supplied, shipping is development-only and read-only.
