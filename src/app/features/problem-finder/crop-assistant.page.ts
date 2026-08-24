import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { KnowledgeRepository } from '@data-access/repositories/knowledge.repository';
import { ClarifyingQuestion, Crop, CropAssistantResult, CropAssistantState, CropStage, Symptom } from '@core/models';
import { ProductCardComponent } from '@shared/ui/product-card.component';
import { StorageService } from '@core/services/storage.service';
import { STORAGE_KEYS } from '@core/constants/storage-keys';
import { SeoService } from '@core/services/seo.service';
import { TranslatePipe } from '@shared/pipes/namaa.pipes';
import { AppImageComponent } from '@shared/ui/app-image.component';

@Component({
  selector: 'app-crop-assistant-page',
  imports: [FormsModule, RouterLink, ProductCardComponent, TranslatePipe, AppImageComponent],
  template: `
    <div class="app-container section assistant">
      <h1>المساعد الذكي للمحصول</h1>
      <p class="muted">{{ 'disclaimer.agri' | t }}</p>
      <ol class="progress" aria-label="التقدم">
        <li [class.on]="state.step >= 1">1</li>
        <li [class.on]="state.step >= 2">2</li>
        <li [class.on]="state.step >= 3">3</li>
        <li [class.on]="state.step >= 4">4</li>
        <li [class.on]="state.step >= 5">5</li>
      </ol>
      <p>الخطوة {{ state.step }} من 5</p>
      @switch (state.step) {
        @case (1) {
          <h2>اختر المحصول</h2>
          <div class="grid-products">
            @for (c of crops(); track c.id) {
              <button type="button" class="card pick" [class.selected]="state.cropId === c.id" (click)="pickCrop(c.id)">
                <app-image [src]="c.image" [alt]="c.imageAltAr" [width]="800" [height]="600" objectFit="cover" fallbackKind="crop" />
                {{ c.nameAr }}
              </button>
            }
          </div>
        }
        @case (2) {
          <h2>مرحلة النمو</h2>
          <div class="stage-grid">
            @for (s of stages(); track s.id) {
              <button type="button" class="card pick" [class.selected]="state.stageId === s.id" (click)="pickStage(s.id)">{{ s.nameAr }}</button>
            }
          </div>
        }
        @case (3) {
          <h2>العرض المشاهد</h2>
          <p class="muted">الصور إرشادية وقد تتشابه الأعراض بين أكثر من مشكلة، لذلك يُفضّل الرجوع إلى مهندس زراعي للتشخيص الدقيق.</p>
          <div class="grid-products">
            @for (s of symptoms(); track s.id) {
              <button type="button" class="card pick" [class.selected]="state.symptomId === s.id" (click)="pickSymptom(s.id)">
                <app-image [src]="s.image" [alt]="s.imageAltAr" [width]="800" [height]="600" objectFit="cover" fallbackKind="problem" />
                {{ s.nameAr }}
              </button>
            }
          </div>
        }
        @case (4) {
          <h2>أسئلة توضيحية اختيارية</h2>
          @for (q of questions(); track q.id) {
            <fieldset class="card qa">
              <legend>{{ q.questionAr }}</legend>
              @for (o of q.options; track o.id) {
                <label class="opt"><input type="radio" [name]="q.id" [value]="o.id" (change)="state.answers[q.id] = o.id" /> {{ o.labelAr }}</label>
              }
            </fieldset>
          }
          <button class="btn" type="button" (click)="finish()">عرض النتائج</button>
        }
        @case (5) {
          @if (result(); as r) {
            <h2>نتائج محتملة الصلة</h2>
            <p>الثقة هنا تعني «صلة محتملة» وليست تشخيصًا مؤكدًا.</p>
            <p class="muted">النتائج إرشادية وقد تتشابه الأعراض بين أكثر من مشكلة. يُفضل الرجوع إلى مهندس زراعي للتشخيص الدقيق والالتزام بتعليمات ملصق المنتج.</p>
            @for (p of r.problems; track p.id) {
              <article class="card qa">
                <app-image [src]="p.image" [alt]="p.imageAltAr" [width]="800" [height]="600" objectFit="cover" fallbackKind="problem" />
                <h3>{{ p.nameAr }}</h3>
                <p>{{ p.educationalNoteAr }}</p>
              </article>
            }
            <h3>منتجات قد تكون ذات صلة</h3>
            <div class="grid-products">@for (p of r.products; track p.id) { <app-product-card [product]="p" /> }</div>
            <p><a class="btn secondary" routerLink="/contact">تواصل مع الدعم الزراعي</a></p>
          }
        }
      }
      @if (state.step > 1) {
        <button class="btn ghost" type="button" (click)="back()">رجوع</button>
      }
    </div>
  `,
  styles: `
    .assistant { background: transparent; }
    :host { display: block; background: var(--color-sky-pale); }
    .progress { display: flex; flex-wrap: wrap; gap: 8px; list-style: none; padding: 0; }
    .progress li { width: 36px; height: 36px; border-radius: 99px; display: grid; place-items: center; background: var(--color-white); border: 1px solid var(--color-border); }
    .progress li.on { background: var(--color-brand); color: #fff; border-color: var(--color-brand); }
    .pick { padding: 12px; text-align: start; cursor: pointer; font: inherit; color: inherit; }
    .pick.selected { border-color: var(--color-brand); box-shadow: 0 0 0 2px var(--color-fresh); }
    .stage-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 160px), 1fr)); gap: 12px; }
    .qa { padding: 16px; margin: 12px 0; border: 1px solid var(--color-border); }
    .opt { display: flex; gap: 8px; min-height: 44px; align-items: center; }
    @media (max-width: 560px) {
      .stage-grid { grid-template-columns: minmax(0, 1fr); }
    }
  `,
})
export class CropAssistantPage {
  private readonly knowledge = inject(KnowledgeRepository);
  private readonly storage = inject(StorageService);
  private readonly seo = inject(SeoService);

  crops = signal<Crop[]>([]);
  stages = signal<CropStage[]>([]);
  symptoms = signal<Symptom[]>([]);
  questions = signal<ClarifyingQuestion[]>([]);
  result = signal<CropAssistantResult | null>(null);
  state: CropAssistantState = this.storage.get<CropAssistantState>(STORAGE_KEYS.cropAssistant) ?? {
    cropId: null,
    stageId: null,
    symptomId: null,
    answers: {},
    step: 1,
  };

  constructor() {
    this.seo.set({ title: 'المساعد الذكي', description: 'إرشاد عام حسب المحصول والعَرَض', path: '/crop-assistant' });
    this.knowledge.listCrops().subscribe((r) => this.crops.set(r));
    this.knowledge.listSymptoms().subscribe((r) => this.symptoms.set(r));
    this.knowledge.clarifyingQuestions().subscribe((r) => this.questions.set(r));
    if (this.state.cropId) {
      this.knowledge.listStages(this.state.cropId).subscribe((r) => this.stages.set(r));
    }
  }

  pickCrop(id: string): void {
    this.state.cropId = id;
    this.state.step = 2;
    this.persist();
    this.knowledge.listStages(id).subscribe((r) => this.stages.set(r));
  }
  pickStage(id: string): void {
    this.state.stageId = id;
    this.state.step = 3;
    this.persist();
  }
  pickSymptom(id: string): void {
    this.state.symptomId = id;
    this.state.step = 4;
    this.persist();
  }
  finish(): void {
    this.state.step = 5;
    this.persist();
    this.knowledge.assistantResult(this.state).subscribe((r) => this.result.set(r));
  }
  back(): void {
    this.state.step = Math.max(1, this.state.step - 1) as 1 | 2 | 3 | 4 | 5;
    this.persist();
  }
  private persist(): void {
    this.storage.set(STORAGE_KEYS.cropAssistant, this.state);
  }
}
