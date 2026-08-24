import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { KnowledgeRepository } from '@data-access/repositories/knowledge.repository';
import { Article, ArticleCategory } from '@core/models';
import { SeoService } from '@core/services/seo.service';
import { AUTHORS } from '@data-access/mock/content.mock';
import { AppImageComponent } from '@shared/ui/app-image.component';
import { ArticleCardComponent } from '@shared/ui/article-card.component';

@Component({
  selector: 'app-academy-page',
  imports: [RouterLink, FormsModule, ArticleCardComponent],
  template: `
    <div class="app-container section">
      <h1>أكاديمية نبته</h1>
      <input class="input academy-search" placeholder="ابحث في المقالات" [(ngModel)]="q" (change)="load()" />
      <div class="chips">
        @for (c of cats(); track c.id) {
          <a class="btn secondary" [routerLink]="['/academy/category', c.slug]">{{ c.nameAr }}</a>
        }
      </div>
      <div class="article-grid">
        @for (a of articles(); track a.id) {
          <app-article-card [article]="a" />
        }
      </div>
    </div>
  `,
  styles: `
    .academy-search { margin-bottom: 24px; }
    .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px; }
    .article-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 28px;
    }
    @media (max-width: 1024px) {
      .article-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 24px;
      }
    }
    @media (max-width: 560px) {
      .article-grid { grid-template-columns: 1fr; gap: 22px; }
    }
  `,
})
export class AcademyPage {
  private readonly knowledge = inject(KnowledgeRepository);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  readonly articles = signal<Article[]>([]);
  readonly cats = signal<ArticleCategory[]>([]);
  q = '';
  constructor() {
    this.seo.set({ title: 'الأكاديمية', description: 'مقالات إرشاد زراعي', path: '/academy' });
    this.knowledge.listArticleCategories().subscribe((r) => this.cats.set(r));
    this.route.paramMap.subscribe(() => this.load());
  }
  load(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    const categoryId = this.cats().find((c) => c.slug === slug)?.id;
    this.knowledge.listArticles({ q: this.q, categoryId, pageSize: 12 }).subscribe((r) => this.articles.set(r.items));
  }
}

@Component({
  selector: 'app-article-page',
  standalone: true,
  imports: [AppImageComponent],
  styles: `
    .article-wrap { width: min(920px, calc(100% - 32px)); margin-inline: auto; }
    .article-body { max-width: 68ch; }
    nav { background: var(--color-sky-pale); padding: 16px; border-radius: 16px; margin: 16px 0; }
  `,
  template: `
    @if (article(); as a) {
      <article class="article-wrap section">
        <app-image [src]="a.coverImage" [alt]="a.imageAltAr" [width]="1200" [height]="630" objectFit="cover" fallbackKind="article" />
        <div class="article-body">
        <h1>{{ a.titleAr }}</h1>
        <p>{{ authorName(a.authorId) }} · {{ a.readingMinutes }} دقائق قراءة · {{ a.publishedAt.slice(0, 10) }}</p>
        <nav><strong>المحتويات</strong>
          <ol>@for (s of a.sections; track s.headingAr) { <li>{{ s.headingAr }}</li> }</ol>
        </nav>
        @for (s of a.sections; track s.headingAr) {
          <h2>{{ s.headingAr }}</h2>
          <p>{{ s.bodyAr }}</p>
        }
        <p class="muted">يجب الالتزام بملصق المنتج وتعليمات وزارة الزراعة واستشارة مهندس زراعي عند الحاجة.</p>
        </div>
      </article>
    }
  `,
})
export class ArticlePage {
  private readonly knowledge = inject(KnowledgeRepository);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  readonly article = signal<Article | null>(null);
  constructor() {
    const slug = this.route.snapshot.paramMap.get('slug') || '';
    this.knowledge.getArticle(slug).subscribe((a) => {
      this.article.set(a);
      this.seo.set({ title: a.titleAr, description: a.excerptAr, path: `/academy/articles/${a.slug}`, type: 'article', image: a.coverImage });
      this.seo.articleJsonLd(a, `/academy/articles/${a.slug}`);
    });
  }
  authorName(id: string): string {
    return AUTHORS.find((a) => a.id === id)?.nameAr ?? '';
  }
}
