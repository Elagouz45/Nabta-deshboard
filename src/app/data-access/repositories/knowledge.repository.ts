import { Observable } from 'rxjs';
import {
  Article,
  ArticleCategory,
  ClarifyingQuestion,
  Crop,
  CropAssistantResult,
  CropAssistantState,
  CropStage,
  PlantProblem,
  Symptom,
} from '@core/models';

export abstract class KnowledgeRepository {
  abstract listCrops(): Observable<Crop[]>;
  abstract getCrop(slug: string): Observable<Crop>;
  abstract listStages(cropId: string): Observable<CropStage[]>;
  abstract listSymptoms(): Observable<Symptom[]>;
  abstract listProblems(): Observable<PlantProblem[]>;
  abstract getProblem(slug: string): Observable<PlantProblem>;
  abstract clarifyingQuestions(): Observable<ClarifyingQuestion[]>;
  abstract assistantResult(state: CropAssistantState): Observable<CropAssistantResult>;
  abstract listArticles(input?: { q?: string; categoryId?: string; cropId?: string; page?: number; pageSize?: number }): Observable<{
    items: Article[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>;
  abstract getArticle(slug: string): Observable<Article>;
  abstract listArticleCategories(): Observable<ArticleCategory[]>;
  abstract saveArticle(article: Article): Observable<Article>;
}
