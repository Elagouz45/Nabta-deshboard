# Laravel API contract (`/api/v1`)

All JSON. Authenticated routes send `Authorization: Bearer <token>` unless a cookie session is agreed later.

Pagination shape:

```json
{ "items": [], "total": 0, "page": 1, "pageSize": 12, "totalPages": 1 }
```

Validation errors: `422` with `{ "code": "validation", "messageAr": "...", "messageEn": "...", "fieldErrors": { "mobile": "..." }, "status": 422 }`.

## Authentication

| Method | URL | Auth | Body | Status |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/auth/login` | No | `{ mobile, password }` | 200 session, 401 |
| POST | `/api/v1/auth/register` | No | `{ fullName, mobile, email?, password }` | 201 session, 422 |
| POST | `/api/v1/auth/forgot-password` | No | `{ mobile }` | 200 |
| POST | `/api/v1/auth/reset-password` | No | `{ mobile, code, password }` | 200 |
| POST | `/api/v1/auth/verify-phone` | No | `{ mobile, code }` | 200 session |
| GET | `/api/v1/me` | Yes | — | 200 `User` |
| PATCH | `/api/v1/me` | Yes | profile fields | 200 |
| POST | `/api/v1/me/password` | Yes | `{ current, next }` | 200 |

Session: `{ token, expiresAt, user }`.

## Catalog

| Method | URL | Auth | Query / body |
| --- | --- | --- | --- |
| GET | `/api/v1/categories` | No | — |
| GET | `/api/v1/subcategories` | No | — |
| GET | `/api/v1/companies` | No | `q?` |
| GET | `/api/v1/companies/{slug}` | No | 404 if missing |
| GET | `/api/v1/brands` | No | — |
| GET | `/api/v1/brands/{slug}` | No | — |
| GET | `/api/v1/products` | No | `q, categoryId, subcategoryId, companyId, brandId, cropId, problemId, activeIngredient, formulation, countryOfOrigin, inStock, minRating, minPrice, maxPrice, offersOnly, bestSellers, isNew, sort, page, pageSize` |
| GET | `/api/v1/products/{slug}` | No | Product |
| GET | `/api/v1/products/{id}/related` | No | Product[] |
| GET | `/api/v1/products/{id}/reviews` | No | Review[] |
| POST | `/api/v1/products/{id}/reviews` | Customer | `{ rating, titleAr, bodyAr }` |
| GET | `/api/v1/search` | No | `q, type, page` |
| GET | `/api/v1/search/suggestions` | No | `q` |

## Crops, problems, academy

| Method | URL | Auth |
| --- | --- | --- |
| GET | `/api/v1/crops` | No |
| GET | `/api/v1/crops/{slug}` | No |
| GET | `/api/v1/crops/{id}/stages` | No |
| GET | `/api/v1/problems` | No |
| GET | `/api/v1/symptoms` | No |
| POST | `/api/v1/crop-assistant/results` | No, body = wizard state |
| GET | `/api/v1/articles` | No, `q, categoryId, cropId, page` |
| GET | `/api/v1/articles/{slug}` | No |
| GET | `/api/v1/article-categories` | No |

## Cart, wishlist, checkout, orders

| Method | URL | Auth | Notes |
| --- | --- | --- | --- |
| GET/POST/PATCH/DELETE | `/api/v1/cart` | Optional | Guest cart via cookie later |
| GET/POST/DELETE | `/api/v1/wishlist` | Optional | Merge on login |
| POST | `/api/v1/coupons/validate` | No | `{ code, subtotal }` 422 if invalid |
| GET | `/api/v1/shipping-methods` | No | |
| GET | `/api/v1/payment-methods` | No | |
| POST | `/api/v1/checkout` | Optional | `{ customer, address, shippingMethodId, paymentMethod, items, couponCode, acceptTerms }` → Order |
| GET | `/api/v1/me/orders` | Customer | |
| GET | `/api/v1/orders/{id}` | Owner or admin | 404 |
| POST | `/api/v1/orders/{id}/cancel` | Owner | 422 if not allowed |
| GET/POST/PUT/DELETE | `/api/v1/me/addresses` | Customer | |
| POST | `/api/v1/contact` | No | ContactMessage |

Never send raw card numbers. Card/wallet are backend payment-provider sessions.

## Admin

All `/api/v1/admin/*` require admin role (403 otherwise).

- Products CRUD + `PATCH` `{ isActive }`
- Orders list/filter + `PATCH` `{ status, reason }`
- Customers list
- Articles CRUD
- Coupons CRUD
- Inventory list
- Messages list

Backend validation remains mandatory. Frontend guards are UX only.
