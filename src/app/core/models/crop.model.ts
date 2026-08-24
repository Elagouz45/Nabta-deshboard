export type CropStageCode =
  | 'seedling'
  | 'vegetative'
  | 'flowering'
  | 'fruiting'
  | 'maturity';

export interface CropStage {
  id: string;
  cropId: string;
  code: CropStageCode;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
}

export interface Crop {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  overviewAr: string;
  overviewEn: string;
  image: string;
  thumbnail: string;
  imageAltAr: string;
  imageAltEn: string;
  seasonAr: string;
  seasonEn: string;
  commonProblemIds: string[];
  relatedCategoryIds: string[];
  relatedArticleIds: string[];
}

export interface Symptom {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  image: string;
  thumbnail: string;
  imageAltAr: string;
  imageAltEn: string;
}

export interface PlantProblem {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  educationalNoteAr: string;
  educationalNoteEn: string;
  image: string;
  thumbnail: string;
  imageAltAr: string;
  imageAltEn: string;
  symptomIds: string[];
  cropIds: string[];
  relatedCategoryIds: string[];
  relatedArticleIds: string[];
}

export interface SymptomVisual {
  cropId: string;
  symptomId: string;
  problemCategory: string;
  image: string;
  imageAltAr: string;
  imageAltEn: string;
}

export interface ClarifyingQuestion {
  id: string;
  questionAr: string;
  questionEn: string;
  options: { id: string; labelAr: string; labelEn: string }[];
}

export interface CropAssistantState {
  cropId: string | null;
  stageId: string | null;
  symptomId: string | null;
  answers: Record<string, string>;
  step: 1 | 2 | 3 | 4 | 5;
}

export interface CropAssistantResult {
  problems: (PlantProblem & { relevance: 'potential' })[];
  products: import('./product.model').Product[];
  articles: { id: string; slug: string; titleAr: string; titleEn: string }[];
  categories: { id: string; slug: string; nameAr: string; nameEn: string }[];
}
