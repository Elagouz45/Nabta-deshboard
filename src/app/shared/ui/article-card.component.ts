import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Article } from '@core/models';
import { LucideClock } from '@lucide/angular';
import { AppImageComponent } from './app-image.component';

@Component({
  selector: 'app-article-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, AppImageComponent, LucideClock],
  template: `
    <a
      class="card art"
      [class.compact]="variant === 'compact'"
      [class.blog]="variant === 'blog'"
      [routerLink]="['/academy/articles', article.slug]"
    >
      <span class="media">
        <app-image
          [src]="article.coverImage"
          [alt]="article.imageAltAr"
          [width]="1200"
          [height]="675"
          objectFit="cover"
          fallbackKind="article"
        />
        @if (featured) {
          <span class="week">مقال الأسبوع</span>
        }
      </span>
      <div class="pad">
        <p class="meta">
          @if (categoryName) {
            <span class="kicker">{{ categoryName }}</span>
          }
          @if (variant === 'blog') {
            <span class="time">
              <svg lucideClock [size]="14"></svg>
              {{ article.readingMinutes }} دقائق قراءة
            </span>
          } @else {
            <span class="muted">{{ article.readingMinutes }} دقائق قراءة</span>
          }
        </p>
        <h3>{{ article.titleAr }}</h3>
        <p class="muted excerpt">{{ article.excerptAr }}</p>
        @if (variant === 'blog') {
          <span class="read">اقرأ المقال ←</span>
        }
      </div>
    </a>
  `,
  styles: `
    .art {
      display: grid;
      overflow: hidden;
      color: inherit;
      height: 100%;
      transition: border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
    }
    .art:hover { color: inherit; border-color: var(--color-fresh); box-shadow: var(--shadow-lift); }
    .media { position: relative; display: block; }
    .art app-image { aspect-ratio: 16 / 9; }
    .week {
      position: absolute;
      top: 12px;
      inset-inline-start: 12px;
      z-index: 1;
      background: var(--color-sun);
      color: var(--color-text);
      border-radius: var(--radius-pill);
      padding: 4px 10px;
      font-size: 0.75rem;
      font-weight: 700;
    }
    .pad { padding: 16px; display: grid; align-content: start; gap: 8px; }
    h3 { margin: 0; font-size: var(--fs-card); }
    .meta { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin: 0; font-size: var(--fs-helper); }
    .kicker {
      background: var(--color-mint);
      color: var(--color-forest);
      border-radius: var(--radius-pill);
      padding: 2px 8px;
      font-weight: 700;
    }
    .time { display: inline-flex; align-items: center; gap: 4px; color: var(--color-muted); }
    .excerpt { margin: 0; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
    .compact { grid-template-columns: 148px 1fr; }
    .compact app-image { aspect-ratio: 1; height: 100%; }
    .compact .excerpt { -webkit-line-clamp: 2; }
    .compact h3 { font-size: 1rem; }
    .blog {
      display: flex;
      flex-direction: column;
      border-radius: 20px;
      background: var(--color-white);
      box-shadow: var(--shadow-soft);
    }
    .blog .pad {
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 10px;
      padding: 16px 16px 18px;
    }
    .blog h3 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      color: var(--color-forest);
    }
    .blog .excerpt { -webkit-line-clamp: 2; }
    .read {
      margin-top: auto;
      color: var(--color-brand);
      font-weight: 700;
      font-size: 0.9rem;
    }
    @media (max-width: 560px) {
      .compact { grid-template-columns: 1fr; }
      .compact app-image { aspect-ratio: 16 / 9; }
    }
  `,
})
export class ArticleCardComponent {
  @Input({ required: true }) article!: Article;
  @Input() variant: 'default' | 'compact' | 'blog' = 'default';
  @Input() categoryName = '';
  @Input() featured = false;
}
