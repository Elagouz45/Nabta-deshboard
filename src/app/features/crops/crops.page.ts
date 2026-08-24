import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { KnowledgeRepository } from '@data-access/repositories/knowledge.repository';
import { CatalogRepository } from '@data-access/repositories/catalog.repository';
import { Crop, CropStage, PlantProblem, Product } from '@core/models';
import { ProductCardComponent } from '@shared/ui/product-card.component';
import { AppImageComponent } from '@shared/ui/app-image.component';
import { CropCardComponent } from '@shared/ui/crop-card.component';
import { SeoService } from '@core/services/seo.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-crops-page',
  imports: [CropCardComponent],
  template: `
    <div class="app-container section">
      <h1>المحاصيل</h1>
      <div class="grid-products">
        @for (c of crops(); track c.id) {
          <app-crop-card [crop]="c" />
        }
      </div>
    </div>
  `,
})
export class CropsPage {
  private readonly knowledge = inject(KnowledgeRepository);
  private readonly seo = inject(SeoService);
  readonly crops = signal<Crop[]>([]);
  constructor() {
    this.seo.set({ title: 'المحاصيل', description: 'اكتشف المنتجات حسب المحصول', path: '/crops' });
    this.knowledge.listCrops().subscribe((rows) => this.crops.set(rows));
  }
}

@Component({
  selector: 'app-crop-details-page',
  imports: [RouterLink, ProductCardComponent, AppImageComponent],
  template: `
    @if (crop(); as c) {
      <div class="app-container section">
        <app-image [src]="c.image" [alt]="c.imageAltAr" [width]="800" [height]="600" objectFit="cover" fallbackKind="crop" />
        <h1>{{ c.nameAr }}</h1>
        <p>{{ c.overviewAr }}</p>
        <h2>مراحل النمو</h2>
        <ul>@for (s of stages(); track s.id) { <li><strong>{{ s.nameAr }}:</strong> {{ s.descriptionAr }}</li> }</ul>
        <h2>مشكلات شائعة</h2>
        <ul>@for (p of problems(); track p.id) { <li><app-image [src]="p.image" [alt]="p.imageAltAr" [width]="800" [height]="600" objectFit="cover" fallbackKind="problem" /><strong>{{ p.nameAr }}:</strong> {{ p.educationalNoteAr }}</li> }</ul>
        <h2>منتجات ذات صلة</h2>
        <div class="grid-products">@for (p of products(); track p.id) { <app-product-card [product]="p" /> }</div>
        <p><a class="btn" [routerLink]="['/crop-assistant']" [queryParams]="{ crop: c.id }">شغّل المساعد لهذا المحصول</a></p>
      </div>
    }
  `,
})
export class CropDetailsPage {
  private readonly knowledge = inject(KnowledgeRepository);
  private readonly catalog = inject(CatalogRepository);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  readonly crop = signal<Crop | null>(null);
  readonly stages = signal<CropStage[]>([]);
  readonly problems = signal<PlantProblem[]>([]);
  readonly products = signal<Product[]>([]);

  constructor() {
    this.route.paramMap.pipe(switchMap((p) => this.knowledge.getCrop(p.get('slug') || ''))).subscribe((crop) => {
      this.crop.set(crop);
      this.seo.set({ title: crop.nameAr, description: crop.overviewAr, path: `/crops/${crop.slug}` });
      this.knowledge.listStages(crop.id).subscribe((s) => this.stages.set(s));
      this.knowledge.listProblems().subscribe((all) => this.problems.set(all.filter((p) => crop.commonProblemIds.includes(p.id))));
      this.catalog.queryProducts({ cropId: crop.id, pageSize: 8 }).subscribe((r) => this.products.set(r.items));
    });
  }
}
