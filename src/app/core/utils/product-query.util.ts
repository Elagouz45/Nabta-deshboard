import { PaginatedResponse, Product, ProductFilters, ProductSortOption } from '@core/models';
import { PAGE_SIZE_DEFAULT } from '@core/constants/app.constants';
import { discountPercent, unitPrice } from './pricing.util';

export function normalizeQuery(value: string | undefined): string {
  return (value ?? '').trim().toLowerCase();
}

export function productMatchesQuery(product: Product, raw: string): boolean {
  const q = normalizeQuery(raw);
  if (!q) {
    return true;
  }
  const haystack = [
    product.nameAr,
    product.nameEn,
    product.sku,
    product.shortDescriptionAr,
    product.shortDescriptionEn,
    product.formulation,
    product.countryOfOrigin,
    ...product.tags,
    ...product.activeIngredients.map((i) => `${i.nameAr} ${i.nameEn}`),
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(q);
}

export function filterProductList(products: Product[], filters: ProductFilters): Product[] {
  return products.filter((product) => {
    if (!product.isActive) {
      return false;
    }
    if (filters.q && !productMatchesQuery(product, filters.q)) {
      return false;
    }
    if (filters.categoryId && product.categoryId !== filters.categoryId) {
      return false;
    }
    if (filters.subcategoryId && product.subcategoryId !== filters.subcategoryId) {
      return false;
    }
    if (filters.companyId && product.companyId !== filters.companyId) {
      return false;
    }
    if (filters.brandId && product.brandId !== filters.brandId) {
      return false;
    }
    if (filters.cropId && !product.targetCropIds.includes(filters.cropId)) {
      return false;
    }
    if (filters.problemId && !product.targetProblemIds.includes(filters.problemId)) {
      return false;
    }
    if (filters.activeIngredient) {
      const needle = normalizeQuery(filters.activeIngredient);
      const hit = product.activeIngredients.some(
        (i) => i.nameAr.toLowerCase().includes(needle) || i.nameEn.toLowerCase().includes(needle),
      );
      if (!hit) {
        return false;
      }
    }
    if (filters.formulation && product.formulation !== filters.formulation) {
      return false;
    }
    if (filters.countryOfOrigin && product.countryOfOrigin !== filters.countryOfOrigin) {
      return false;
    }
    if (filters.inStock && product.stockStatus === 'out_of_stock') {
      return false;
    }
    if (filters.minRating && product.rating < filters.minRating) {
      return false;
    }
    const price = unitPrice(product);
    if (filters.minPrice != null && price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice != null && price > filters.maxPrice) {
      return false;
    }
    if (filters.minDiscount != null) {
      const percent = discountPercent(product);
      if (percent == null || percent < filters.minDiscount) {
        return false;
      }
    }
    if (filters.offersOnly && !product.isOnSale) {
      return false;
    }
    if (filters.bestSellers && !product.isBestSeller) {
      return false;
    }
    if (filters.isNew && !product.isNew) {
      return false;
    }
    return true;
  });
}

export function sortProducts(products: Product[], sort: ProductSortOption | undefined): Product[] {
  const copy = [...products];
  switch (sort) {
    case 'best_selling':
      return copy.sort((a, b) => b.salesCount - a.salesCount);
    case 'highest_rated':
      return copy.sort((a, b) => b.rating - a.rating);
    case 'newest':
      return copy.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt) || b.id.localeCompare(a.id));
    case 'price_asc':
      return copy.sort((a, b) => unitPrice(a) - unitPrice(b));
    case 'price_desc':
      return copy.sort((a, b) => unitPrice(b) - unitPrice(a));
    case 'best_saving':
      return copy.sort((a, b) => {
        const save = (p: Product) => (p.salePrice != null ? p.regularPrice - p.salePrice : 0);
        return save(b) - save(a) || (discountPercent(b) ?? 0) - (discountPercent(a) ?? 0);
      });
    default:
      return copy.sort((a, b) => {
        const score = (p: Product) =>
          (p.isFeatured ? 8 : 0) + (p.isBestSeller ? 4 : 0) + (p.isOnSale ? 2 : 0) + p.rating;
        return score(b) - score(a);
      });
  }
}

export function paginate<T>(items: T[], page = 1, pageSize = PAGE_SIZE_DEFAULT): PaginatedResponse<T> {
  const safeSize = Math.max(1, pageSize);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / safeSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * safeSize;
  return {
    items: items.slice(start, start + safeSize),
    total,
    page: safePage,
    pageSize: safeSize,
    totalPages,
  };
}

export function queryProducts(products: Product[], filters: ProductFilters): PaginatedResponse<Product> {
  const filtered = sortProducts(filterProductList(products, filters), filters.sort);
  return paginate(filtered, filters.page, filters.pageSize);
}
