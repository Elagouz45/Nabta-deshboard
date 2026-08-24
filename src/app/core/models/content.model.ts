export type ArticleStatus = 'draft' | 'published';

export interface ArticleCategory {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
}

export interface ArticleAuthor {
  id: string;
  nameAr: string;
  nameEn: string;
  titleAr: string;
  titleEn: string;
  avatar: string;
}

export interface ArticleSection {
  headingAr: string;
  headingEn: string;
  bodyAr: string;
  bodyEn: string;
}

export interface Article {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  excerptAr: string;
  excerptEn: string;
  coverImage: string;
  socialImage: string;
  imageAltAr: string;
  imageAltEn: string;
  categoryId: string;
  authorId: string;
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  views: number;
  featured: boolean;
  status: ArticleStatus;
  cropIds: string[];
  problemIds: string[];
  relatedProductIds: string[];
  relatedArticleIds: string[];
  relatedCategoryIds: string[];
  sections: ArticleSection[];
  seoTitleAr: string;
  seoTitleEn: string;
  seoDescriptionAr: string;
  seoDescriptionEn: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  createdAt: string;
  approved: boolean;
}

export interface FaqItem {
  id: string;
  category: 'ordering' | 'shipping' | 'returns' | 'products' | 'accounts' | 'usage';
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
}
