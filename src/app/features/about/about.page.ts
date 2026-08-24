import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BRAND } from '@core/tokens/brand.token';
import { FAQS } from '@data-access/mock/content.mock';
import { AccountRepository } from '@data-access/repositories/account.repository';
import { egyptianMobileValidator, VALIDATION_MESSAGES } from '@shared/validators/namaa.validators';
import { SeoService } from '@core/services/seo.service';
import { UiStore } from '@state/ui/ui.store';
import { TranslatePipe } from '@shared/pipes/namaa.pipes';
import { AppImageComponent } from '@shared/ui/app-image.component';
import { LucideBookOpen, LucideClock, LucideLeaf, LucideMail, LucideMapPin, LucideMessageCircle, LucidePhone } from '@lucide/angular';

@Component({
  selector: 'app-about-page',
  imports: [RouterLink, TranslatePipe, AppImageComponent, LucideBookOpen, LucideLeaf, LucideMapPin, LucidePhone],
  template: `
    <article class="about">
      <header class="about-hero">
        <div class="app-container hero-grid">
          <div class="hero-copy">
            <p class="kicker">منصة زراعية مصرية</p>
            <h1>عن {{ brand.shortNameAr }}</h1>
            <p class="lede">
              {{ brand.nameAr }} منصة تجارة وإرشاد زراعي تُبنى لتكون أوضح وأهدأ من المتاجر التقليدية، مع بيانات منتج قابلة للقراءة ومسار اكتشاف حسب المحصول والمشكلة.
            </p>
            <div class="hero-actions">
              <a class="btn" routerLink="/contact">تواصل معنا</a>
              <a class="btn secondary" routerLink="/shop">{{ 'cta.browse' | t }}</a>
            </div>
          </div>
          <div class="hero-media">
            <app-image
              src="/assets/images/hero/hero-desktop.webp"
              alt="مهندس زراعي يتفقد محصولًا أخضر في حقل مصري"
              [width]="1200"
              [height]="800"
              [priority]="true"
              objectFit="cover"
              fallbackKind="crop"
            />
          </div>
        </div>
      </header>

      <div class="app-container about-body">
        <section class="mission" aria-labelledby="about-mission">
          <div class="mission-copy">
            <p class="kicker">لماذا نبته</p>
            <h2 id="about-mission">الرسالة</h2>
            <p>تسهيل وصول المزارع والمهندس إلى المنتج المناسب دون ضجيج بصري أو وعود طبية زائفة.</p>
            <p class="muted">{{ brand.taglineAr }}</p>
          </div>
          <div class="mission-media">
            <app-image
              src="/assets/images/crops/wheat-crop.webp"
              alt="حقل قمح مصري في ضوء الصباح"
              [width]="900"
              [height]="640"
              objectFit="cover"
              fallbackKind="crop"
            />
          </div>
        </section>

        <section aria-labelledby="about-values">
          <h2 id="about-values">القيم</h2>
          <ul class="values">
            <li class="card value">
              <span class="icon" aria-hidden="true"><svg lucideBookOpen [size]="20"></svg></span>
              <h3>وضوح الملصق قبل البيع</h3>
              <p>بيانات المنتج تُعرض للقراءة قبل الشراء، مع مسار اكتشاف حسب المحصول والمشكلة.</p>
            </li>
            <li class="card value">
              <span class="icon" aria-hidden="true"><svg lucideLeaf [size]="20"></svg></span>
              <h3>عدم تقديم تشخيص مضمون</h3>
              <p>{{ 'disclaimer.agri' | t }}</p>
            </li>
            <li class="card value">
              <span class="icon" aria-hidden="true"><svg lucideMapPin [size]="20"></svg></span>
              <h3>خدمة لكل محافظات مصر</h3>
              <p>نطاق الخدمة: جمهورية مصر العربية.</p>
            </li>
          </ul>
        </section>

        <section class="note-band" aria-labelledby="about-scope">
          <div>
            <h2 id="about-scope">نطاق العمل</h2>
            <p>فريق العمل في هذه النسخة تجريبي: مهندسون وباحثون بأسماء تمثيلية.</p>
            <p class="muted">{{ brand.addressAr }} · {{ brand.workingHoursAr }}</p>
          </div>
          <a class="btn contact-cta" routerLink="/contact">
            <svg lucidePhone [size]="18"></svg>
            تواصل معنا
          </a>
        </section>
      </div>
    </article>
  `,
  styles: `
    .about { padding-bottom: var(--space-8); }
    .kicker {
      margin: 0 0 8px;
      color: var(--color-brand);
      font-weight: 700;
      font-size: 0.82rem;
    }
    .about-hero {
      padding: var(--space-6) 0 var(--space-7);
      background:
        linear-gradient(180deg, var(--color-pale), rgb(247 250 247 / 0.4));
    }
    .hero-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
      gap: 28px;
      align-items: stretch;
    }
    .hero-copy { display: grid; gap: 12px; }
    .hero-copy h1 {
      margin: 0;
      color: var(--color-forest);
      font-size: clamp(1.7rem, 3vw, 2.35rem);
      line-height: 1.25;
    }
    .lede { margin: 0; max-width: 38rem; color: var(--color-text); }
    .hero-actions { display: flex; flex-wrap: wrap; gap: 10px; }
    .hero-media,
    .mission-media {
      overflow: hidden;
      border-radius: 22px;
      min-height: 240px;
      box-shadow: var(--shadow-soft);
    }
    .hero-media app-image,
    .mission-media app-image {
      display: block;
      height: 100%;
      min-height: 240px;
    }
    .about-body { display: grid; gap: 40px; padding-top: var(--space-7); }
    .mission {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(220px, 0.72fr);
      gap: 28px;
      align-items: center;
    }
    .mission-copy { display: grid; gap: 10px; }
    .mission-copy h2,
    .about-body h2 {
      margin: 0 0 12px;
      color: var(--color-forest);
    }
    .mission-copy p { margin: 0; }
    .mission-media app-image { aspect-ratio: 4 / 3; }
    .values {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
    }
    .value {
      display: grid;
      gap: 8px;
      padding: 20px;
      border-radius: 20px;
      background: var(--color-warm-white);
      align-content: start;
    }
    .value h3 { margin: 0; font-size: 1.02rem; color: var(--color-forest); }
    .value p { margin: 0; color: var(--color-muted); font-size: 0.92rem; }
    .icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      display: grid;
      place-items: center;
      background: var(--color-mint);
      color: var(--color-forest);
    }
    .note-band {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      padding: 22px 24px;
      border-radius: 20px;
      background: var(--color-sky-pale);
      border: 1px solid var(--color-sky-border);
    }
    .note-band h2 { margin: 0 0 8px; }
    .note-band p { margin: 0 0 6px; }
    .contact-cta { background: var(--color-forest); border-color: var(--color-forest); }
    @media (max-width: 900px) {
      .hero-grid,
      .mission,
      .values { grid-template-columns: 1fr; }
      .hero-media { min-height: 200px; }
    }
    @media (max-width: 560px) {
      .about-hero { padding: var(--space-5) 0 var(--space-5); }
      .hero-media { display: none; }
      .note-band .btn { width: 100%; }
    }
  `,
})
export class AboutPage {
  readonly brand = inject(BRAND);
  private readonly seo = inject(SeoService);
  constructor() {
    this.seo.set({ title: 'عن المنصة', description: this.brand.taglineAr, path: '/about' });
  }
}

@Component({
  selector: 'app-contact-page',
  imports: [ReactiveFormsModule, LucideClock, LucideMail, LucideMapPin, LucideMessageCircle, LucidePhone],
  template: `
    <article class="contact">
      <header class="contact-hero">
        <div class="app-container">
          <p class="kicker">دعم خلال ساعات العمل</p>
          <h1>تواصل معنا</h1>
          <p class="lede">فريق الدعم جاهز عبر الهاتف والواتساب والبريد خلال {{ brand.workingHoursAr }}.</p>
        </div>
      </header>

      <div class="app-container layout">
        <form class="card form-card" [formGroup]="form" (ngSubmit)="send()" novalidate>
          <h2>أرسل رسالة</h2>
          <p class="muted intro">سنرد خلال ساعات العمل. الحقول ذات النجمة مطلوبة.</p>

          <label for="contact-name">الاسم <span aria-hidden="true">*</span>
            <input
              id="contact-name"
              class="input"
              formControlName="name"
              autocomplete="name"
              [attr.aria-invalid]="!!error('name')"
              [attr.aria-describedby]="error('name') ? 'contact-name-err' : null"
            />
          </label>
          @if (error('name'); as msg) {
            <p class="err" id="contact-name-err">{{ msg }}</p>
          }

          <label for="contact-mobile">الهاتف <span aria-hidden="true">*</span>
            <input
              id="contact-mobile"
              class="input"
              formControlName="mobile"
              type="tel"
              inputmode="tel"
              autocomplete="tel"
              [attr.aria-invalid]="!!error('mobile')"
              [attr.aria-describedby]="error('mobile') ? 'contact-mobile-err' : null"
            />
          </label>
          @if (error('mobile'); as msg) {
            <p class="err" id="contact-mobile-err">{{ msg }}</p>
          }

          <label for="contact-email">البريد (اختياري)
            <input id="contact-email" class="input" formControlName="email" type="email" autocomplete="email" />
          </label>

          <label for="contact-type">نوع الاستفسار <span aria-hidden="true">*</span>
            <select id="contact-type" class="input" formControlName="type">
              <option value="product">سؤال عن منتج</option>
              <option value="order">سؤال عن طلب</option>
              <option value="guidance">إرشاد زراعي</option>
              <option value="complaint">شكوى</option>
              <option value="partnership">شراكة</option>
            </select>
          </label>

          <label for="contact-message">الرسالة <span aria-hidden="true">*</span>
            <textarea
              id="contact-message"
              class="input"
              formControlName="message"
              rows="5"
              [attr.aria-invalid]="!!error('message')"
              [attr.aria-describedby]="error('message') ? 'contact-message-err' : null"
            ></textarea>
          </label>
          @if (error('message'); as msg) {
            <p class="err" id="contact-message-err">{{ msg }}</p>
          }

          <button class="btn submit" type="submit" [disabled]="form.invalid || sent">إرسال</button>
          @if (sent) {
            <p class="success" role="status">وصلت رسالتك. سنرد خلال ساعات العمل.</p>
          }
        </form>

        <aside class="channels" aria-label="بيانات التواصل">
          <a class="card channel" [href]="'tel:' + brand.customerServicePhone">
            <span class="icon" aria-hidden="true"><svg lucidePhone [size]="20"></svg></span>
            <span>
              <strong>هاتف</strong>
              <span class="muted">{{ brand.customerServicePhone }}</span>
            </span>
          </a>
          <a class="card channel" [href]="'https://wa.me/' + brand.whatsappNumber" target="_blank" rel="noopener noreferrer">
            <span class="icon" aria-hidden="true"><svg lucideMessageCircle [size]="20"></svg></span>
            <span>
              <strong>واتساب</strong>
              <span class="muted">{{ brand.whatsappDisplay }}</span>
            </span>
          </a>
          <a class="card channel" [href]="'mailto:' + brand.email">
            <span class="icon" aria-hidden="true"><svg lucideMail [size]="20"></svg></span>
            <span>
              <strong>البريد</strong>
              <span class="muted">{{ brand.email }}</span>
            </span>
          </a>
          <div class="card channel">
            <span class="icon" aria-hidden="true"><svg lucideMapPin [size]="20"></svg></span>
            <span>
              <strong>العنوان</strong>
              <span class="muted">{{ brand.addressAr }}</span>
            </span>
          </div>
          <div class="card channel">
            <span class="icon" aria-hidden="true"><svg lucideClock [size]="20"></svg></span>
            <span>
              <strong>ساعات العمل</strong>
              <span class="muted">{{ brand.workingHoursAr }}</span>
            </span>
          </div>
        </aside>
      </div>
    </article>
  `,
  styles: `
    .contact { padding-bottom: calc(var(--space-8) + 24px); }
    .kicker {
      margin: 0 0 8px;
      color: var(--color-brand);
      font-weight: 700;
      font-size: 0.82rem;
    }
    .contact-hero {
      padding: var(--space-6) 0 var(--space-6);
      background: linear-gradient(180deg, var(--color-pale), rgb(247 250 247 / 0.35));
    }
    .contact-hero h1 {
      margin: 0 0 10px;
      color: var(--color-forest);
      font-size: clamp(1.7rem, 3vw, 2.35rem);
    }
    .lede { margin: 0; max-width: 38rem; color: var(--color-muted); }
    .layout {
      display: grid;
      grid-template-columns: minmax(0, 1.15fr) minmax(240px, 0.78fr);
      gap: 24px;
      align-items: start;
      padding-top: var(--space-6);
    }
    .form-card {
      padding: 24px;
      border-radius: 20px;
      display: grid;
      gap: 6px;
      background: var(--color-warm-white);
    }
    .form-card h2 { margin: 0 0 4px; color: var(--color-forest); font-size: 1.2rem; }
    .intro { margin: 0 0 10px; }
    .form-card label {
      display: grid;
      gap: 6px;
      margin: 8px 0 0;
      font-size: 0.92rem;
      color: var(--color-forest);
    }
    .form-card .err { margin: 4px 0 0; font-size: 0.82rem; }
    .submit { justify-self: start; margin-top: 12px; min-width: 140px; background: var(--color-forest); border-color: var(--color-forest); }
    .success {
      margin: 8px 0 0;
      color: var(--color-success);
      font-weight: 700;
    }
    .channels { display: grid; gap: 12px; }
    .channel {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      padding: 16px;
      border-radius: 18px;
      color: inherit;
      background: var(--color-warm-white);
    }
    a.channel:hover { color: inherit; border-color: var(--color-fresh); }
    .channel strong { display: block; color: var(--color-forest); }
    .channel .muted { display: block; margin-top: 2px; overflow-wrap: anywhere; }
    .icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      display: grid;
      place-items: center;
      background: var(--color-mint);
      color: var(--color-forest);
      flex-shrink: 0;
    }
    @media (max-width: 900px) {
      .layout { grid-template-columns: 1fr; }
    }
    @media (max-width: 560px) {
      .submit { width: 100%; justify-self: stretch; }
      .contact { padding-bottom: calc(96px + env(safe-area-inset-bottom, 0px)); }
    }
  `,
})
export class ContactPage {
  readonly brand = inject(BRAND);
  private readonly fb = inject(FormBuilder);
  private readonly accounts = inject(AccountRepository);
  private readonly seo = inject(SeoService);
  private readonly ui = inject(UiStore);
  sent = false;
  submitted = false;
  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    mobile: ['', [Validators.required, egyptianMobileValidator()]],
    email: [''],
    type: ['product' as const, Validators.required],
    message: ['', Validators.required],
  });
  constructor() {
    this.seo.set({ title: 'تواصل معنا', description: 'خدمة عملاء نبته', path: '/contact' });
  }
  error(name: 'name' | 'mobile' | 'message'): string {
    const control = this.form.get(name);
    if (!control?.errors || !(control.touched || this.submitted)) {
      return '';
    }
    const key = Object.keys(control.errors)[0];
    return VALIDATION_MESSAGES[key] ?? '';
  }
  send(): void {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.accounts.sendContact({ ...v, email: v.email || null }).subscribe(() => {
      this.sent = true;
      this.ui.toast('تم إرسال الرسالة.');
    });
  }
}

@Component({
  selector: 'app-faq-page',
  standalone: true,
  template: `
    <div class="app-container section">
      <h1>الأسئلة الشائعة</h1>
      @for (f of faqs; track f.id) {
        <details class="card pad">
          <summary>{{ f.questionAr }}</summary>
          <p>{{ f.answerAr }}</p>
        </details>
      }
    </div>
  `,
})
export class FaqPage {
  readonly faqs = FAQS;
  private readonly seo = inject(SeoService);
  constructor() {
    this.seo.set({ title: 'الأسئلة الشائعة', description: 'إجابات الطلب والشحن والاستعمال', path: '/faq' });
  }
}
