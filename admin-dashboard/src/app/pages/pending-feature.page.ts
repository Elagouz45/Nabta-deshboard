import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideClock3 } from '@lucide/angular';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ADMIN_NAVIGATION } from '../layout/admin-sidebar/admin-navigation.config';

@Component({
  imports: [RouterLink, LucideClock3],
  template: `
    <main class="pending-page">
      <section>
        <span class="icon" aria-hidden="true"><svg lucideClock3></svg></span>
        <p>مساحة الإدارة</p>
        <h1>{{ featureLabel() }}</h1>
        <strong>هذه الشاشة قيد الربط</strong>
        <p class="description">أُضيفت إلى قائمة الإدارة حسب الهيكل المطلوب، لكنها لن تعرض بيانات أو تنفذ إجراءات حتى يتوفر عقد Laravel الموثّق الخاص بها.</p>
        <a class="btn secondary" routerLink="/overview">العودة إلى نظرة عامة</a>
      </section>
    </main>
  `,
  styles: [`.pending-page{display:grid;place-items:center;min-height:calc(100dvh - 8rem);padding:1.5rem}.pending-page section{display:grid;justify-items:center;max-width:34rem;padding:2.25rem;border:1px solid var(--border);border-radius:.85rem;background:#fff;text-align:center;box-shadow:var(--shadow)}.icon{display:grid;place-items:center;width:3rem;height:3rem;margin-bottom:.75rem;border-radius:50%;background:#edf4ef;color:var(--brand)}.icon svg{width:1.35rem}.pending-page p{margin:0;color:var(--muted);font-size:.78rem}.pending-page h1{margin:.25rem 0 .6rem;color:var(--forest);font:600 1.45rem var(--font-display)}.pending-page strong{color:var(--text);font-size:.9rem}.pending-page .description{max-width:29rem;margin:.5rem 0 1.25rem;line-height:1.9}`],
})
export class PendingFeaturePage {
  private readonly route = inject(ActivatedRoute);
  private readonly featureId = toSignal(this.route.paramMap.pipe(map((params) => params.get('feature') ?? '')), { initialValue: '' });
  readonly featureLabel = computed(() => ADMIN_NAVIGATION.flatMap((group) => group.items).find((item) => item.route === `/pending/${this.featureId()}`)?.label ?? 'ميزة إدارية');
}
