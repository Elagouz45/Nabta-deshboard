export interface Category {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string;
  image: string;
  imageAltAr: string;
  imageAltEn: string;
  productCount: number;
  sortOrder: number;
}

export interface Subcategory {
  id: string;
  slug: string;
  categoryId: string;
  nameAr: string;
  nameEn: string;
}

export interface Brand {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  logo: string;
  country: string;
  companyId: string;
  productCount: number;
}

export interface Company {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  logo: string;
  country: string;
  productCount: number;
}
