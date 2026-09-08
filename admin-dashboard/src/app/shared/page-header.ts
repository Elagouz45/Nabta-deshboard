import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  template: `<header class="page-header"><div><p>{{ eyebrow() }}</p><h1>{{ title() }}</h1>@if(description()){<span>{{ description() }}</span>}</div><div class="actions"><ng-content /></div></header>`,
  styles: [`
    .page-header{display:flex;align-items:flex-end;justify-content:space-between;gap:1.5rem;margin-bottom:1.6rem}.page-header p{margin:0 0 .25rem;color:var(--brand);font-size:.85rem;font-weight:700}.page-header h1{margin:0;color:var(--forest);font:700 clamp(1.45rem,2vw,1.9rem)/1.35 var(--font-display)}.page-header span{display:block;margin-top:.35rem;color:var(--muted);font-size:.92rem}.actions{display:flex;gap:.6rem}@media(max-width:640px){.page-header{align-items:flex-start;flex-direction:column}.actions{width:100%}.actions ::ng-deep .btn{flex:1}}
  `],
})
export class PageHeader {
  readonly eyebrow = input('مساحة الإدارة');
  readonly title = input.required<string>();
  readonly description = input('');
}


