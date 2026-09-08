import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  template: `<main class="system-page"><section><span aria-hidden="true">API</span><h1>هذه الميزة غير متاحة بعد</h1><p>لم يتم توفير عقد Laravel موثّق لهذه الشاشة، لذلك لن تعرض اللوحة بيانات وهمية أو تنفذ إجراءً غير حقيقي.</p><a class="btn secondary" routerLink="/overview">العودة إلى النظرة العامة</a></section></main>`,
  styles: [`.system-page{min-height:100dvh;display:grid;place-items:center;padding:1rem}.system-page section{max-width:34rem;text-align:center}.system-page span{color:var(--brand);font:700 2rem var(--font-display)}h1{margin:.5rem 0;color:var(--forest);font:700 1.4rem var(--font-display)}p{margin:0 0 1.25rem;color:var(--muted)}`],
})
export class UnavailablePage {}
