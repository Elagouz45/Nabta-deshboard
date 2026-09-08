import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({ imports: [RouterLink], template: `<main class="system-page"><section><span>403</span><h1>ليست لديك الصلاحية</h1><p>لا يملك حسابك الإذن المطلوب لفتح هذه الصفحة.</p><a class="btn" routerLink="/overview">العودة إلى النظرة العامة</a></section></main>`, styles: [`.system-page{min-height:100dvh;display:grid;place-items:center;padding:1rem}.system-page section{text-align:center}.system-page span{color:var(--brand);font:700 3rem var(--font-display)}h1{margin:.4rem 0;color:var(--forest);font:700 1.5rem var(--font-display)}p{margin:0 0 1rem;color:var(--muted)}`] })
export class ForbiddenPage {}
