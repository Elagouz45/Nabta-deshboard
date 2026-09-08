import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  template: `<main class="system-page"><section><span>404</span><h1>الصفحة غير موجودة</h1><p>الرابط الذي طلبته غير متاح في لوحة الإدارة.</p><a class="btn secondary" routerLink="/overview">العودة إلى نظرة عامة</a></section></main>`,
  styles: [`.system-page{min-height:100dvh;display:grid;place-items:center;padding:1rem}.system-page section{text-align:center}.system-page span{color:var(--brand);font:700 2.5rem var(--font-display)}h1{margin:.4rem 0;color:var(--forest);font:700 1.4rem var(--font-display)}p{margin:0 0 1rem;color:var(--muted)}`],
})
export class NotFoundPage {}
