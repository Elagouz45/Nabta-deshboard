import { Injectable, inject } from '@angular/core';
import { KnowledgeRepository } from '@data-access/repositories/knowledge.repository';
import { MockDatabase } from '@data-access/mock/mock-database.service';
import { MockHttp, notFound } from '@data-access/mock/mock-http.service';
import {
  CLARIFYING_QUESTIONS,
  CROPS,
  CROP_STAGES,
  PROBLEMS,
  SYMPTOMS,
} from '@data-access/mock/crops.mock';
import { ARTICLE_CATEGORIES, AUTHORS } from '@data-access/mock/content.mock';
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
import { paginate } from '@core/utils/product-query.util';
import { Observable } from 'rxjs';

@Injectable()
export class MockKnowledgeRepository extends KnowledgeRepository {
  private readonly db = inject(MockDatabase);
  private readonly http = inject(MockHttp);

  listCrops(): Observable<Crop[]> {
    return this.http.ok(CROPS);
  }
  getCrop(slug: string): Observable<Crop> {
    const row = CROPS.find((c) => c.slug === slug);
    return row ? this.http.ok(row) : this.http.fail(notFound('المحصول', 'Crop'));
  }
  listStages(cropId: string): Observable<CropStage[]> {
    return this.http.ok(CROP_STAGES.filter((s) => s.cropId === cropId));
  }
  listSymptoms(): Observable<Symptom[]> {
    return this.http.ok(SYMPTOMS);
  }
  listProblems(): Observable<PlantProblem[]> {
    return this.http.ok(PROBLEMS);
  }
  getProblem(slug: string): Observable<PlantProblem> {
    const row = PROBLEMS.find((p) => p.slug === slug);
    return row ? this.http.ok(row) : this.http.fail(notFound('المشكلة', 'Problem'));
  }
  clarifyingQuestions(): Observable<ClarifyingQuestion[]> {
    return this.http.ok(CLARIFYING_QUESTIONS);
  }

  assistantResult(state: CropAssistantState): Observable<CropAssistantResult> {
    const cropProblems = PROBLEMS.filter((p) => (state.cropId ? p.cropIds.includes(state.cropId) : true));
    const bySymptom = state.symptomId
      ? cropProblems.filter((p) => p.symptomIds.includes(state.symptomId as string))
      : cropProblems;
    let ranked = bySymptom.length ? bySymptom : cropProblems;
    if (state.answers['q-saline-water'] === 'yes') {
      ranked = [...PROBLEMS.filter((p) => p.id === 'pr-salinity'), ...ranked.filter((p) => p.id !== 'pr-salinity')];
    }
    if (state.answers['q-visible-insects'] === 'yes') {
      ranked = [
        ...ranked.filter((p) => ['pr-aphid', 'pr-whitefly', 'pr-thrips', 'pr-mite', 'pr-insects'].includes(p.id)),
        ...ranked.filter((p) => !['pr-aphid', 'pr-whitefly', 'pr-thrips', 'pr-mite', 'pr-insects'].includes(p.id)),
      ];
    }
    const unique = ranked.filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i).slice(0, 4);
    const productIdsCrops = state.cropId
      ? this.db.products().filter((p) => p.isActive && p.targetCropIds.includes(state.cropId as string))
      : this.db.products().filter((p) => p.isActive);
    const products = productIdsCrops
      .filter((p) => unique.some((pr) => p.targetProblemIds.includes(pr.id) || p.targetCropIds.includes(state.cropId ?? '')))
      .slice(0, 8);
    const articles = this.db
      .articles()
      .filter(
        (a) =>
          a.status === 'published' &&
          (unique.some((pr) => a.problemIds.includes(pr.id)) || (state.cropId ? a.cropIds.includes(state.cropId) : false)),
      )
      .slice(0, 4);
    const categoryIds = unique.flatMap((p) => p.relatedCategoryIds);
    const categories = this.db
      .categories()
      .filter((c) => categoryIds.includes(c.id))
      .map((c) => ({ id: c.id, slug: c.slug, nameAr: c.nameAr, nameEn: c.nameEn }));
    return this.http.ok({
      problems: unique.map((p) => ({ ...p, relevance: 'potential' as const })),
      products,
      articles: articles.map((a) => ({ id: a.id, slug: a.slug, titleAr: a.titleAr, titleEn: a.titleEn })),
      categories,
    });
  }

  listArticles(input?: {
    q?: string;
    categoryId?: string;
    cropId?: string;
    page?: number;
    pageSize?: number;
  }) {
    let items = this.db.articles().filter((a) => a.status === 'published');
    if (input?.q) {
      const q = input.q.toLowerCase();
      items = items.filter((a) => a.titleAr.includes(input.q as string) || a.titleEn.toLowerCase().includes(q) || a.excerptAr.includes(input.q as string));
    }
    if (input?.categoryId) {
      items = items.filter((a) => a.categoryId === input.categoryId);
    }
    if (input?.cropId) {
      items = items.filter((a) => a.cropIds.includes(input.cropId as string));
    }
    items = items.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
    return this.http.ok(paginate(items, input?.page ?? 1, input?.pageSize ?? 9));
  }

  getArticle(slug: string): Observable<Article> {
    const row = this.db.articles().find((a) => a.slug === slug);
    return row ? this.http.ok(row) : this.http.fail(notFound('المقال', 'Article'));
  }

  listArticleCategories(): Observable<ArticleCategory[]> {
    return this.http.ok(ARTICLE_CATEGORIES);
  }

  saveArticle(article: Article): Observable<Article> {
    const now = new Date().toISOString();
    const saved = { ...article, updatedAt: now, authorId: article.authorId || AUTHORS[0].id };
    this.db.articles.update((rows) => {
      const i = rows.findIndex((a) => a.id === saved.id);
      if (i === -1) {
        return [{ ...saved, publishedAt: saved.publishedAt || now }, ...rows];
      }
      const next = [...rows];
      next[i] = saved;
      return next;
    });
    return this.http.ok(saved);
  }
}
