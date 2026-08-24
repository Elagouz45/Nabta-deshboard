export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';
export type ProductUnit = 'liter' | 'ml' | 'kg' | 'g' | 'piece' | 'pack';

export interface ProductImage {
  id: string;
  url: string;
  altAr: string;
  altEn: string;
  width: number;
  height: number;
  sortOrder: number;
}

export interface ActiveIngredient {
  nameAr: string;
  nameEn: string;
  concentration: string;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  nameAr: string;
  nameEn: string;
  shortDescriptionAr: string;
  shortDescriptionEn: string;
  descriptionAr: string;
  descriptionEn: string;
  categoryId: string;
  subcategoryId: string;
  brandId: string;
  companyId: string;
  images: ProductImage[];
  thumbnail: string;
  imageAltAr: string;
  imageAltEn: string;
  regularPrice: number;
  salePrice: number | null;
  currency: 'EGP';
  stockQuantity: number;
  stockStatus: StockStatus;
  unit: ProductUnit;
  size: string;
  weight: string;
  formulation: string;
  activeIngredients: ActiveIngredient[];
  composition: string;
  countryOfOrigin: string;
  targetCropIds: string[];
  targetProblemIds: string[];
  benefits: { ar: string; en: string }[];
  usageInstructions: { ar: string; en: string };
  dosage: { ar: string; en: string };
  safetyInstructions: { ar: string; en: string };
  preHarvestInterval: { ar: string; en: string };
  rating: number;
  reviewsCount: number;
  salesCount: number;
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  isOnSale: boolean;
  isActive: boolean;
  tags: string[];
  seoTitleAr: string;
  seoTitleEn: string;
  seoDescriptionAr: string;
  seoDescriptionEn: string;
  createdAt: string;
  updatedAt: string;
}

export type ProductSortOption =
  | 'recommended'
  | 'best_selling'
  | 'highest_rated'
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'best_saving';

export interface ProductFilters {
  q?: string;
  categoryId?: string;
  subcategoryId?: string;
  companyId?: string;
  brandId?: string;
  cropId?: string;
  problemId?: string;
  activeIngredient?: string;
  formulation?: string;
  countryOfOrigin?: string;
  inStock?: boolean;
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
  minDiscount?: number;
  offersOnly?: boolean;
  bestSellers?: boolean;
  isNew?: boolean;
  sort?: ProductSortOption;
  page?: number;
  pageSize?: number;
}

export interface SearchFilters {
  q: string;
  type?: 'all' | 'product' | 'crop' | 'problem' | 'company' | 'ingredient' | 'article';
  page?: number;
  pageSize?: number;
}

export interface SearchSuggestion {
  id: string;
  type: 'product' | 'crop' | 'problem' | 'company' | 'ingredient' | 'article';
  labelAr: string;
  labelEn: string;
  url: string;
}

export interface SearchResults {
  products: Product[];
  crops: { id: string; slug: string; nameAr: string; nameEn: string }[];
  problems: { id: string; slug: string; nameAr: string; nameEn: string }[];
  companies: { id: string; slug: string; nameAr: string; nameEn: string }[];
  ingredients: { nameAr: string; nameEn: string }[];
  articles: { id: string; slug: string; titleAr: string; titleEn: string }[];
  total: number;
}
