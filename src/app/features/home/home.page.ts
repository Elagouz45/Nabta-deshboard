import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogRepository } from '@data-access/repositories/catalog.repository';
import { KnowledgeRepository } from '@data-access/repositories/knowledge.repository';
import { Category, Crop, Product, Article, ArticleCategory } from '@core/models';
import { ProductCardComponent } from '@shared/ui/product-card.component';
import { MoneyPipe, TranslatePipe } from '@shared/pipes/namaa.pipes';
import { BRAND } from '@core/tokens/brand.token';
import { SeoService } from '@core/services/seo.service';
import { discountPercent } from '@core/utils/pricing.util';
import { forkJoin } from 'rxjs';
import { AppImageComponent } from '@shared/ui/app-image.component';
import { SectionHeaderComponent } from '@shared/ui/section-header.component';
import { CategoryCardComponent } from '@shared/ui/category-card.component';
import { CropCardComponent } from '@shared/ui/crop-card.component';
import { ArticleCardComponent } from '@shared/ui/article-card.component';
import {
  LucideLeaf,
  LucideBookOpen,
  LucideLock,
  LucideTruck,
  LucidePhone,
  LucideRotateCcw,
  LucideMessageCircle,
  LucideHeadset,
} from '@lucide/angular';

@Component({
  selector: 'app-home-page',
  imports: [
    RouterLink,
    ProductCardComponent,
    TranslatePipe,
    MoneyPipe,
    AppImageComponent,
    SectionHeaderComponent,
    CategoryCardComponent,
    CropCardComponent,
    ArticleCardComponent,
    LucideLeaf,
    LucideBookOpen,
    LucideLock,
    LucideTruck,
    LucidePhone,
    LucideRotateCcw,
    LucideMessageCircle,
    LucideHeadset,
  ],
  template: `
    <section class="hero">
      <div class="hero-media">
        <app-image
          class="hero-desktop"
          src="/assets/images/hero/hero-desktop.webp"
          alt="مهندس زراعي يتفقد صفوف خضراء في حقل مصري عند الشروق"
          [width]="1600"
          [height]="700"
          [priority]="true"
          objectFit="cover"
          fallbackKind="crop"
        />
        <app-image
          class="hero-mobile"
          src="/assets/images/hero/hero-mobile.webp"
          alt="أوراق محصول أخضر عند الشروق في حقل مصري"
          [width]="800"
          [height]="1000"
          objectFit="cover"
          fallbackKind="crop"
        />
      </div>
      <div class="app-container hero-grid">
        <div class="hero-copy">
          <p class="eyebrow">{{ brand.shortNameAr }}</p>
          <h1>كل ما يحتاجه محصولك… في مكان واحد</h1>
          <p class="lead">منتجات موثوقة، معلومات واضحة، وحلول تساعدك في كل مرحلة من رحلة المحصول.</p>
          <div class="hero-cta">
            <a class="btn" routerLink="/crop-assistant">{{ 'cta.discover' | t }}</a>
            <a class="btn secondary" routerLink="/shop">{{ 'cta.browse' | t }}</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="app-container">
        <app-section-header title="تصفح حسب الفئة" link="/shop" />
      </div>
      <div class="cat-marquee" aria-label="فئات المنتجات">
        <div class="cat-track">
          @for (pass of [0, 1]; track pass) {
            <div class="cat-pass" [attr.aria-hidden]="pass === 1">
              @for (cat of categories(); track cat.id) {
                <app-category-card [category]="cat" variant="circle" />
              }
            </div>
          }
        </div>
      </div>
    </section>

    <section class="section surface-pale">
      <div class="app-container">
        <app-section-header title="تسوق حسب المحصول" subtitle="صور حقيقية لكل محصول" link="/crops" />
        <div class="crop-row">
          @for (crop of crops().slice(0, 5); track crop.id) {
            <app-crop-card [crop]="crop" />
          }
        </div>
      </div>
    </section>

    <section class="section assistant-band">
      <div class="app-container">
        <div class="assistant-head">
          <div>
            <p class="eyebrow">إرشاد حقلي في أربع خطوات</p>
            <h2>المساعد الذكي للمحصول</h2>
            <p>مسار بسيط يرتّب الملاحظة في الحقل ويوجهك إلى فئات المنتجات المناسبة — دون تشخيص مضمون.</p>
          </div>
          <a class="btn" routerLink="/crop-assistant">ابدأ التشخيص الإرشادي</a>
        </div>
        <ol class="steps">
          @for (step of assistantSteps; track step.n) {
            <li class="card step">
              <span class="num">{{ step.n }}</span>
              <strong>{{ step.title }}</strong>
              <p class="muted">{{ step.hint }}</p>
            </li>
          }
        </ol>
        <p class="muted assistant-note">{{ 'disclaimer.agri' | t }}</p>
      </div>
    </section>

    <section class="section bestsellers-band">
      <div class="app-container">
        <app-section-header title="الأكثر مبيعًا" subtitle="صور منتجات حقيقية من الحقل والعبوة" link="/shop" />
        <div class="best-row">
          @for (p of bestsellers(); track p.id) {
            <app-product-card [product]="p" variant="photo" />
          }
        </div>
      </div>
    </section>

    <section class="section offers-band">
      <div class="app-container offers-layout">
        <div class="offers-promo">
          <p class="eyebrow">عروض الموسم</p>
          <h2>وفّر.. وخلي أرضك تزهر</h2>
          <span class="seed" aria-hidden="true"></span>
          <p class="lede">أسمدة ومغذيات مختارة تساعد محصولك يكبر بسعر أحلى</p>
          <a class="btn" routerLink="/shop" [queryParams]="{ offersOnly: true }">شوف العروض</a>
        </div>
        <div class="offers-scene">
          <div class="scene-art" aria-hidden="true">
            <span class="sun"></span>
            <div class="leaf-frame">
              <app-image
                src="/assets/images/crops/wheat-crop.webp"
                alt=""
                [width]="800"
                [height]="1000"
                objectFit="cover"
                fallbackKind="crop"
              />
            </div>
            <span class="frond one"></span>
            <span class="frond two"></span>
            <span class="stem"></span>
            <span class="stage"></span>
          </div>
          @if (maxOfferDiscount(); as pct) {
            <p class="stamp">
              <svg lucideLeaf [size]="14"></svg>
              <span>خصومات حتى {{ pct }}٪</span>
            </p>
          }
          <div class="scene-products">
            @if (featuredOffers()[0]; as p1) {
              <a class="float-product one" [routerLink]="['/products', p1.slug]">
                <app-image
                  [src]="p1.thumbnail"
                  [alt]="p1.imageAltAr"
                  [width]="640"
                  [height]="800"
                  objectFit="cover"
                  fallbackKind="product"
                  surface="transparent"
                />
                <span class="role">{{ offerRole(p1, 0) }}</span>
                <span class="cap">{{ p1.nameAr }}</span>
                <span class="price">{{ (p1.salePrice ?? p1.regularPrice) | money }}</span>
              </a>
            }
            @if (featuredOffers()[1]; as p2) {
              <a class="float-product two" [routerLink]="['/products', p2.slug]">
                <app-image
                  [src]="p2.thumbnail"
                  [alt]="p2.imageAltAr"
                  [width]="640"
                  [height]="800"
                  objectFit="cover"
                  fallbackKind="product"
                  surface="transparent"
                />
                <span class="role">{{ offerRole(p2, 1) }}</span>
                <span class="cap">{{ p2.nameAr }}</span>
                <span class="price">{{ (p2.salePrice ?? p2.regularPrice) | money }}</span>
              </a>
            }
          </div>
        </div>
      </div>
    </section>

    <section class="section academy-band">
      <div class="app-container">
        <div class="academy-head">
          <div>
            <h2>من مدونتنا الزراعية</h2>
            <p class="muted">خبرات ونصائح تساعدك في كل مرحلة من موسمك</p>
          </div>
          <a class="btn secondary" routerLink="/academy">كل المقالات ←</a>
        </div>
        <div class="academy-grid">
          @for (a of articles().slice(0, 3); track a.id; let i = $index) {
            <app-article-card
              [article]="a"
              variant="blog"
              [categoryName]="articleCat(a)"
              [featured]="isFeaturedArticle(a, i)"
            />
          }
        </div>
      </div>
    </section>

    <section class="section why-band">
      <div class="app-container">
        <div class="why-shell">
          <div class="why-brand">
            <p class="why-kicker">لماذا {{ brand.shortNameAr }}؟</p>
            <h2>الثقة تبدأ قبل الطلب</h2>
            <p>معلومات واضحة، دعم قريب، وتجربة شراء تطمّنك من أول خطوة</p>
          </div>
          <ul class="why-benefits">
            @for (item of whyPoints; track item.title) {
              <li class="why-item">
                <span class="why-icon" aria-hidden="true">
                  @switch (item.icon) {
                    @case ('leaf') { <svg lucideLeaf [size]="18"></svg> }
                    @case ('book') { <svg lucideBookOpen [size]="18"></svg> }
                    @case ('truck') { <svg lucideTruck [size]="18"></svg> }
                    @case ('headset') { <svg lucideHeadset [size]="18"></svg> }
                    @case ('lock') { <svg lucideLock [size]="18"></svg> }
                    @case ('return') { <svg lucideRotateCcw [size]="18"></svg> }
                  }
                </span>
                <div>
                  <strong>{{ item.title }}</strong>
                  <p>{{ item.text }}</p>
                </div>
              </li>
            }
          </ul>
        </div>
      </div>
    </section>

    <section class="section consult-band">
      <div class="app-container consult">
        <div class="consult-copy">
          <p class="eyebrow">دعم خلال ساعات العمل</p>
          <h2>تحتاج استشارة حقلية؟</h2>
          <p>فريق الدعم جاهز عبر الهاتف والواتساب خلال ساعات العمل.</p>
          <p class="muted hours">{{ brand.workingHoursAr }}</p>
          <a class="btn" routerLink="/contact">تواصل معنا</a>
        </div>
        <div class="consult-channels">
          <a class="card channel" [href]="'tel:' + brand.customerServicePhone">
            <span class="channel-icon" aria-hidden="true"><svg lucidePhone [size]="20"></svg></span>
            <span>
              <strong>اتصال هاتفي</strong>
              <span class="muted">{{ brand.customerServicePhone }}</span>
            </span>
          </a>
          <a class="card channel" [href]="'https://wa.me/' + brand.whatsappNumber" target="_blank" rel="noopener noreferrer">
            <span class="channel-icon" aria-hidden="true"><svg lucideMessageCircle [size]="20"></svg></span>
            <span>
              <strong>واتساب</strong>
              <span class="muted">{{ brand.whatsappDisplay }}</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  `,
  styles: `
    .hero { position: relative; isolation: isolate; min-height: 460px; overflow: hidden; }
    .hero-media { position: absolute; inset: 0; z-index: 0; }
    .hero-media::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to left, rgb(241 249 252 / .92), rgb(247 250 247 / .55) 46%, transparent);
    }
    :host-context([dir='ltr']) .hero-media::after {
      background: linear-gradient(to right, rgb(241 249 252 / .92), rgb(247 250 247 / .55) 46%, transparent);
    }
    .hero-media app-image, .hero-desktop, .hero-mobile { height: 100%; }
    .hero-mobile { display: none; }
    .hero-grid { position: relative; z-index: 1; min-height: 460px; display: grid; grid-template-columns: minmax(280px, 36rem) 1fr; gap: 32px; align-items: center; padding: 64px 0; }
    .hero-copy { max-width: 36rem; }
    .hero h1 {
      font-size: var(--fs-hero);
      color: var(--color-white);
      text-shadow: 0 1px 12px rgb(18 58 40 / 35%);
    }
    .hero-copy .lead {
      color: var(--color-white);
      text-shadow: 0 1px 10px rgb(18 58 40 / 40%);
    }
    .eyebrow { color: var(--color-brand); font-weight: 700; margin: 0 0 8px; }
    .hero-cta { display: flex; gap: 12px; flex-wrap: wrap; margin: 16px 0; }
    .cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; }
    .crop-row { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
    .crop-row > :nth-child(n + 4) { display: none; }
    @media (min-width: 1024px) {
      .crop-row { grid-template-columns: repeat(5, minmax(0, 1fr)); }
      .crop-row > :nth-child(n + 4) { display: block; }
    }
    .cat-marquee {
      --cat-visible: 6;
      --cat-gap: 12px;
      --cat-slot: calc((100cqi - (var(--cat-visible) - 1) * var(--cat-gap)) / var(--cat-visible));
      container-type: inline-size;
      overflow: hidden;
      mask-image: linear-gradient(to right, transparent, #000 24px, #000 calc(100% - 24px), transparent);
    }
    .cat-track, .cat-pass {
      display: flex;
      gap: var(--cat-gap);
      width: max-content;
    }
    .cat-marquee app-category-card {
      flex: 0 0 var(--cat-slot);
      width: var(--cat-slot);
    }
    .cat-track {
      animation: cat-scroll 36s linear infinite;
    }
    .cat-marquee:hover .cat-track,
    .cat-marquee:focus-within .cat-track {
      animation-play-state: paused;
    }
    @keyframes cat-scroll {
      to { transform: translateX(50%); }
    }
    :host-context([dir='ltr']) .cat-track {
      animation-name: cat-scroll-ltr;
    }
    @keyframes cat-scroll-ltr {
      to { transform: translateX(-50%); }
    }
    @media (prefers-reduced-motion: reduce) {
      .cat-marquee { overflow-x: auto; mask-image: none; }
    }
    @media (max-width: 1024px) {
      .cat-marquee { --cat-visible: 4; }
    }
    @media (max-width: 639px) {
      .cat-marquee { --cat-visible: 2.4; }
    }
    .offers-band {
      position: relative;
      isolation: isolate;
      overflow: hidden;
      margin-inline: var(--space-4);
      border-radius: 28px;
      background: #f6f3ea;
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-soft);
    }
    .offers-layout {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.25fr);
      gap: 12px 20px;
      align-items: center;
      padding-block: 12px;
    }
    .offers-promo { display: grid; gap: 14px; align-content: center; min-width: 0; padding-inline: 8px; }
    .offers-promo .eyebrow { margin: 0; color: var(--color-forest); }
    .offers-promo h2 {
      margin: 0;
      color: var(--color-forest);
      font-size: clamp(1.45rem, 2.4vw, 2.15rem);
      max-width: 16ch;
    }
    .offers-promo .lede { margin: 0; max-width: 28rem; color: var(--color-muted); }
    .offers-promo .btn { justify-self: start; background: var(--color-forest); }
    .seed {
      width: 72px;
      height: 2px;
      background: linear-gradient(to left, var(--color-sun), transparent);
      border-radius: 99px;
    }
    .offers-scene {
      position: relative;
      min-height: 420px;
      min-width: 0;
    }
    .scene-art { position: absolute; inset: 0; pointer-events: none; }
    .sun {
      position: absolute;
      top: 4%;
      inset-inline-end: 6%;
      width: 210px;
      height: 210px;
      border-radius: 50%;
      background: radial-gradient(circle, rgb(232 190 101 / .55) 0%, rgb(232 190 101 / .12) 48%, transparent 72%);
      z-index: 0;
    }
    .leaf-frame {
      position: absolute;
      inset-inline-start: 6%;
      top: 6%;
      width: 78%;
      height: 82%;
      overflow: hidden;
      border-radius: 74% 36% 68% 42% / 46% 64% 36% 78%;
      box-shadow: 0 18px 36px rgb(18 58 40 / 14%);
      z-index: 1;
    }
    .leaf-frame app-image { height: 100%; }
    .frond {
      position: absolute;
      width: 56px;
      height: 56px;
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160'%3E%3Cpath fill='%233f8f5a' d='M82 18c28 18 48 48 46 86-22 4-48-8-64-32-16-24-18-52-18-52s8 4 36-2Z'/%3E%3C/svg%3E") center / contain no-repeat;
      opacity: 0.28;
      z-index: 2;
    }
    .frond.one { bottom: 18%; inset-inline-start: 4%; transform: rotate(-24deg); }
    .frond.two { top: 22%; inset-inline-end: 18%; transform: rotate(28deg) scaleX(-1); }
    .stem {
      position: absolute;
      inset-inline-start: 22%;
      bottom: 10%;
      width: 10px;
      height: 28%;
      background: linear-gradient(180deg, var(--color-leaf), transparent);
      border-radius: 99px;
      transform: rotate(18deg);
      opacity: 0.35;
      z-index: 1;
    }
    .stage {
      position: absolute;
      bottom: 7%;
      inset-inline: 14%;
      height: 36px;
      background: radial-gradient(ellipse at center, rgb(138 106 72 / .45), transparent 70%);
      filter: blur(4px);
      z-index: 2;
    }
    .scene-products { position: absolute; inset: 0; z-index: 3; }
    .float-product {
      position: absolute;
      z-index: 3;
      display: grid;
      gap: 4px;
      color: inherit;
      width: 42%;
      filter: drop-shadow(0 16px 18px rgb(18 58 40 / 22%));
    }
    .float-product:hover { color: inherit; }
    .float-product app-image {
      aspect-ratio: 4 / 5;
      border-radius: 46% 42% 28px 28px;
      overflow: hidden;
    }
    .float-product.one { bottom: 14%; inset-inline-start: 12%; }
    .float-product.two { bottom: 10%; inset-inline-end: 4%; width: 38%; }
    .role {
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--color-brand);
      text-align: center;
    }
    .cap {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--color-forest);
      text-align: center;
    }
    .price {
      font-size: 0.75rem;
      color: var(--color-muted);
      text-align: center;
    }
    .stamp {
      position: absolute;
      top: 8%;
      inset-inline-end: 2%;
      z-index: 4;
      margin: 0;
      width: 92px;
      height: 92px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      align-content: center;
      gap: 2px;
      text-align: center;
      padding: 10px;
      font-size: 0.78rem;
      font-weight: 700;
      line-height: 1.35;
      color: var(--color-text);
      background: var(--color-sun);
      border: 2px dashed rgb(18 58 40 / 28%);
      box-shadow: 0 8px 18px rgb(18 58 40 / 12%);
      transform: rotate(-8deg);
    }
    @media (max-width: 900px) {
      .offers-layout { grid-template-columns: 1fr; }
      .offers-scene { min-height: 360px; }
      .offers-promo h2 { max-width: none; }
      .frond.two { display: none; }
    }
    @media (max-width: 560px) {
      .offers-band { margin-inline: var(--space-3); }
      .offers-scene { min-height: 300px; }
      .scene-products {
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: end;
        gap: 8px;
        inset: auto 0 0;
        height: 58%;
      }
      .float-product.one, .float-product.two {
        position: relative;
        inset: auto;
        width: auto;
        bottom: auto;
      }
      .stamp { width: 76px; height: 76px; font-size: 0.68rem; }
      .sun { width: 140px; height: 140px; }
      .stem, .frond { display: none; }
    }
    .academy-band { background: var(--color-sky-pale); }
    .academy-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }
    .academy-head h2 { margin: 0; color: var(--color-forest); }
    .academy-head p { margin: 6px 0 0; max-width: 36rem; }
    .academy-head .btn { flex-shrink: 0; }
    .academy-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
      align-items: stretch;
    }
    @media (max-width: 1023px) {
      .academy-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 639px) {
      .academy-grid { grid-template-columns: minmax(0, 1fr); }
      .academy-head { align-items: flex-start; }
    }
    .best-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    @media (min-width: 1024px) {
      .best-row { grid-template-columns: repeat(4, 1fr); }
    }
    .assistant-band { background: var(--color-sky-pale); }
    .assistant-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }
    .assistant-head h2 { margin: 0 0 8px; }
    .assistant-head p { margin: 0; max-width: 36rem; }
    .steps {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }
    .step {
      padding: 16px;
      display: grid;
      gap: 8px;
      align-content: start;
    }
    .num {
      width: 36px;
      height: 36px;
      border-radius: 99px;
      display: grid;
      place-items: center;
      background: var(--color-brand);
      color: var(--color-white);
      font-weight: 700;
    }
    .assistant-note { margin: 20px 0 0; font-size: var(--fs-helper); }
    .split { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: center; }
    .why-band { padding-block: 40px; }
    .why-shell {
      display: grid;
      grid-template-columns: minmax(0, 37%) minmax(0, 63%);
      border-radius: 26px;
      overflow: hidden;
      box-shadow: var(--shadow-soft);
      min-height: 440px;
      background: var(--color-warm-white);
    }
    .why-brand {
      position: relative;
      isolation: isolate;
      display: grid;
      align-content: center;
      gap: 12px;
      padding: 36px 32px;
      background:
        linear-gradient(165deg, rgb(18 58 40 / .94), rgb(12 40 28 / .86)),
        url('/assets/images/crops/wheat-crop.webp') center / cover;
      color: var(--color-white);
    }
    .why-brand::after {
      content: '';
      position: absolute;
      width: 88px;
      height: 88px;
      inset-inline-end: 16px;
      bottom: 18px;
      opacity: 0.18;
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160'%3E%3Cpath fill='%23e8be65' d='M82 18c28 18 48 48 46 86-22 4-48-8-64-32-16-24-18-52-18-52s8 4 36-2Z'/%3E%3C/svg%3E") center / contain no-repeat;
      pointer-events: none;
    }
    .why-kicker {
      margin: 0;
      color: var(--color-sun);
      font-size: 0.85rem;
      font-weight: 700;
    }
    .why-brand h2 {
      margin: 0;
      color: var(--color-white);
      font-size: clamp(1.35rem, 2vw, 1.85rem);
    }
    .why-brand p { margin: 0; color: #d7e4db; max-width: 22rem; line-height: 1.7; }
    .why-benefits {
      list-style: none;
      margin: 0;
      padding: 8px 0;
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-content: stretch;
    }
    .why-item {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 12px;
      align-items: start;
      padding: 22px 24px;
      border-inline-end: 1px solid var(--color-border);
      border-bottom: 1px solid var(--color-border);
    }
    .why-item:nth-child(2n) { border-inline-end: 0; }
    .why-item:nth-last-child(-n + 2) { border-bottom: 0; }
    .why-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: var(--color-mint);
      color: var(--color-brand);
    }
    .why-item strong { display: block; color: var(--color-forest); font-size: 0.95rem; }
    .why-item p { margin: 4px 0 0; color: var(--color-muted); font-size: var(--fs-helper); line-height: 1.55; }
    @media (max-width: 900px) {
      .why-shell { grid-template-columns: 1fr; min-height: 0; }
    }
    @media (max-width: 560px) {
      .why-benefits { grid-template-columns: 1fr; }
      .why-item { border-inline-end: 0; }
      .why-item:nth-last-child(-n + 2) { border-bottom: 1px solid var(--color-border); }
      .why-item:last-child { border-bottom: 0; }
      .why-brand { padding: 28px 22px; min-height: 220px; }
    }
    .consult-band { background: var(--color-mint); }
    .consult {
      display: grid;
      grid-template-columns: 1.15fr 1fr;
      gap: 28px;
      align-items: center;
    }
    .consult-copy h2 { margin: 0 0 10px; color: var(--color-forest); }
    .consult-copy p { margin: 0 0 12px; max-width: 36rem; }
    .consult-copy .hours { margin-bottom: 20px; }
    .consult-channels { display: grid; gap: 12px; min-width: 0; }
    .channel {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 14px;
      align-items: center;
      padding: 16px 18px;
      color: inherit;
    }
    .channel:hover { color: inherit; border-color: var(--color-fresh); box-shadow: var(--shadow-soft); }
    .channel span { display: grid; gap: 2px; min-width: 0; }
    .channel-icon {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: var(--color-white);
      color: var(--color-brand);
    }
    @media (max-width: 800px) {
      .consult { grid-template-columns: 1fr; }
      .hero-desktop { display: none; }
      .hero-mobile { display: block; }
      .hero-media::after {
        background: linear-gradient(to top, rgb(18 58 40 / 0.82), rgb(18 58 40 / 0.35) 46%, transparent 72%);
      }
      .hero-grid {
        grid-template-columns: 1fr;
        min-height: min(88dvh, 640px);
        align-items: end;
        padding: 48px 0 32px;
      }
      .hero-copy { max-width: none; }
      .hero-cta { flex-direction: column; align-items: stretch; }
      .hero-cta .btn { width: 100%; }
      .steps { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 560px) {
      .hero-grid { min-height: min(78dvh, 560px); padding: 32px 0 24px; }
      .steps { grid-template-columns: 1fr; }
      .crop-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .best-row { grid-template-columns: minmax(0, 1fr); }
      .assistant-head .btn { width: 100%; }
    }
  `,
})
export class HomePage {
  private readonly catalog = inject(CatalogRepository);
  private readonly knowledge = inject(KnowledgeRepository);
  private readonly seo = inject(SeoService);
  readonly brand = inject(BRAND);

  readonly categories = signal<Category[]>([]);
  readonly crops = signal<Crop[]>([]);
  readonly offers = signal<Product[]>([]);
  readonly bestsellers = signal<Product[]>([]);
  readonly articles = signal<Article[]>([]);
  readonly articleCats = signal<ArticleCategory[]>([]);
  readonly featuredOffers = computed(() => {
    const unused = [...this.offers()];
    const take = (match: (product: Product) => boolean) => {
      const index = unused.findIndex(match);
      return index >= 0 ? unused.splice(index, 1)[0] : undefined;
    };
    const fertilizer = take((product) => product.categoryId === 'cat-fertilizers');
    const foliar = take((product) => product.categoryId === 'cat-nutrients');
    return [fertilizer, foliar, ...unused].filter((product): product is Product => !!product).slice(0, 2);
  });

  readonly whyPoints = [
    { icon: 'leaf', title: 'مواصفات واضحة', text: 'منتجات متخصصة وبيانات سهلة القراءة' },
    { icon: 'book', title: 'دليل استخدام', text: 'تركيب واستعمال وتعليمات أمان' },
    { icon: 'truck', title: 'شحن داخل مصر', text: 'تغطية للمحافظات في الوضع التجريبي' },
    { icon: 'headset', title: 'دعم قريب منك', text: 'واتساب وهاتف لخدمة العملاء' },
    { icon: 'lock', title: 'طلب مشفّر', text: 'تجربة آمنة والدفع الإلكتروني قريبًا' },
    { icon: 'return', title: 'إرجاع واضح', text: 'سياسة مكتوبة تعرفها قبل الشراء' },
  ];

  readonly assistantSteps = [
    { n: 1, title: 'اختر المحصول', hint: 'قمح، طماطم، موالح وغيرها.' },
    { n: 2, title: 'حدّد مرحلة النمو', hint: 'من الإنبات حتى النضج.' },
    { n: 3, title: 'صف العرض الظاهر', hint: 'ما تراه على الورق أو الثمرة.' },
    { n: 4, title: 'اطلع على الإرشاد', hint: 'ملاحظات تعليمية وفئات ذات صلة.' },
  ];

  constructor() {
    this.seo.set({
      title: 'حلول ومنتجات زراعية',
      description: this.brand.taglineAr,
      path: '/',
    });
    forkJoin({
      cats: this.catalog.listCategories(),
      offers: this.catalog.queryProducts({ offersOnly: true, pageSize: 4, sort: 'recommended' }),
      best: this.catalog.queryProducts({ bestSellers: true, pageSize: 4, sort: 'best_selling' }),
      crops: this.knowledge.listCrops(),
      articles: this.knowledge.listArticles({ pageSize: 3 }),
      articleCats: this.knowledge.listArticleCategories(),
    }).subscribe((res) => {
      this.categories.set(res.cats);
      this.offers.set(res.offers.items);
      this.bestsellers.set(res.best.items);
      this.crops.set(res.crops);
      this.articles.set(res.articles.items);
      this.articleCats.set(res.articleCats);
    });
  }

  articleCat(article: Article): string {
    return this.articleCats().find((c) => c.id === article.categoryId)?.nameAr ?? 'الأكاديمية';
  }

  isFeaturedArticle(article: Article, index: number): boolean {
    const row = this.articles().slice(0, 3);
    const featured = row.find((item) => item.featured);
    return featured ? featured.id === article.id : index === 0;
  }

  maxOfferDiscount(): number | null {
    const percents = this.offers()
      .map((product) => discountPercent(product))
      .filter((value): value is number => value != null);
    return percents.length ? Math.max(...percents) : null;
  }

  offerRole(product: Product, index: number): string {
    if (product.categoryId === 'cat-fertilizers') {
      return 'سماد متوازن';
    }
    if (product.categoryId === 'cat-nutrients') {
      return 'مغذي ورقي';
    }
    return index === 0 ? 'سماد متوازن' : 'مغذي ورقي';
  }
}
