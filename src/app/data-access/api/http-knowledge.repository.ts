import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { KnowledgeRepository } from '@data-access/repositories/knowledge.repository';
import {
  Article,
  ArticleCategory,
  ClarifyingQuestion,
  Crop,
  CropAssistantResult,
  CropAssistantState,
  CropStage,
  PaginatedResponse,
  PlantProblem,
  Symptom,
} from '@core/models';

@Injectable()
export class HttpKnowledgeRepository extends KnowledgeRepository {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBaseUrl;

  listCrops(): Observable<Crop[]> {
    return this.http.get<Crop[]>(`${this.base}/crops`);
  }
  getCrop(slug: string): Observable<Crop> {
    return this.http.get<Crop>(`${this.base}/crops/${slug}`);
  }
  listStages(cropId: string): Observable<CropStage[]> {
    return this.http.get<CropStage[]>(`${this.base}/crops/${cropId}/stages`);
  }
  listSymptoms(): Observable<Symptom[]> {
    return this.http.get<Symptom[]>(`${this.base}/symptoms`);
  }
  listProblems(): Observable<PlantProblem[]> {
    return this.http.get<PlantProblem[]>(`${this.base}/problems`);
  }
  getProblem(slug: string): Observable<PlantProblem> {
    return this.http.get<PlantProblem>(`${this.base}/problems/${slug}`);
  }
  clarifyingQuestions(): Observable<ClarifyingQuestion[]> {
    return this.http.get<ClarifyingQuestion[]>(`${this.base}/crop-assistant/questions`);
  }
  assistantResult(state: CropAssistantState): Observable<CropAssistantResult> {
    return this.http.post<CropAssistantResult>(`${this.base}/crop-assistant/results`, state);
  }
  listArticles(input?: { q?: string; categoryId?: string; cropId?: string; page?: number; pageSize?: number }) {
    return this.http.get<PaginatedResponse<Article>>(`${this.base}/articles`, { params: { ...input } as Record<string, string> });
  }
  getArticle(slug: string): Observable<Article> {
    return this.http.get<Article>(`${this.base}/articles/${slug}`);
  }
  listArticleCategories(): Observable<ArticleCategory[]> {
    return this.http.get<ArticleCategory[]>(`${this.base}/article-categories`);
  }
  saveArticle(article: Article): Observable<Article> {
    return this.http.put<Article>(`${this.base}/admin/articles/${article.id}`, article);
  }
}
