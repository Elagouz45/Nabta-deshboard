import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { KnowledgeRepository } from '@data-access/repositories/knowledge.repository';
import { Article } from '@core/models';
import { arabicNameValidator, slugValidator } from '@shared/validators/namaa.validators';
import { DirtyComponent } from '@core/guards/unsaved-changes.guard';
import { UiStore } from '@state/ui/ui.store';
import { ARTICLE_CATEGORIES, AUTHORS } from '@data-access/mock/content.mock';

@Component({
  selector: 'app-admin-article-form-page',
  imports: [ReactiveFormsModule],
  template: `
    <h1>{{ isNew ? 'مقال جديد' : 'تعديل مقال' }}</h1>
    <form [formGroup]="form" (ngSubmit)="save()">
      <label>العنوان العربي <input class="input" formControlName="titleAr" /></label>
      <label>العنوان الإنجليزي <input class="input" formControlName="titleEn" /></label>
      <label>المسار <input class="input" formControlName="slug" /></label>
      <label>المقتطف <textarea class="input" formControlName="excerptAr"></textarea></label>
      <label>التصنيف
        <select class="input" formControlName="categoryId">
          @for (c of cats; track c.id) { <option [value]="c.id">{{ c.nameAr }}</option> }
        </select>
      </label>
      <label>الحالة
        <select class="input" formControlName="status">
          <option value="draft">مسودة</option>
          <option value="published">منشور</option>
        </select>
      </label>
      <button class="btn" type="submit" [disabled]="form.invalid">حفظ</button>
    </form>
  `,
})
export class AdminArticleFormPage implements DirtyComponent {
  private readonly fb = inject(FormBuilder);
  private readonly knowledge = inject(KnowledgeRepository);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly ui = inject(UiStore);
  readonly cats = ARTICLE_CATEGORIES;
  isNew = true;
  private saved = false;
  readonly form = this.fb.nonNullable.group({
    titleAr: ['', [Validators.required, arabicNameValidator()]],
    titleEn: ['', Validators.required],
    slug: ['', [Validators.required, slugValidator()]],
    excerptAr: ['', Validators.required],
    categoryId: [ARTICLE_CATEGORIES[0].id],
    status: ['draft' as 'draft' | 'published'],
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isNew = false;
      this.knowledge.listArticles({ pageSize: 50 }).subscribe((r) => {
        const found = r.items.find((a) => a.id === id);
        if (found) {
          this.form.patchValue({
            titleAr: found.titleAr,
            titleEn: found.titleEn,
            slug: found.slug,
            excerptAr: found.excerptAr,
            categoryId: found.categoryId,
            status: found.status,
          });
        }
      });
    }
  }

  isDirty(): boolean {
    return this.form.dirty && !this.saved;
  }

  save(): void {
    const v = this.form.getRawValue();
    const now = new Date().toISOString();
    const article: Article = {
      id: this.route.snapshot.paramMap.get('id') || `art-${Date.now()}`,
      slug: v.slug,
      titleAr: v.titleAr,
      titleEn: v.titleEn,
      excerptAr: v.excerptAr,
      excerptEn: v.excerptAr,
      coverImage: '/assets/images/academy/spray.webp',
      categoryId: v.categoryId,
      authorId: AUTHORS[0].id,
      publishedAt: now,
      updatedAt: now,
      readingMinutes: 5,
      views: 0,
      featured: false,
      status: v.status,
      cropIds: [],
      problemIds: [],
      relatedProductIds: [],
      relatedArticleIds: [],
      relatedCategoryIds: [],
      sections: [{ headingAr: 'مقدمة', headingEn: 'Intro', bodyAr: v.excerptAr, bodyEn: v.excerptAr }],
      seoTitleAr: v.titleAr,
      seoTitleEn: v.titleEn,
      seoDescriptionAr: v.excerptAr,
      seoDescriptionEn: v.excerptAr,
      socialImage: '/assets/images/academy/spray.webp',
      imageAltAr: v.titleAr,
      imageAltEn: v.titleEn,
    };
    this.knowledge.saveArticle(article).subscribe(() => {
      this.saved = true;
      this.ui.toast('تم حفظ المقال.');
      void this.router.navigateByUrl('/admin/articles');
    });
  }
}
