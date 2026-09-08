import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { LucideClock3, LucideFileText, LucideRotateCcw, LucideBadgeCheck } from '@lucide/angular';
import { InvoiceSummary } from '../../models/invoice.models';

@Component({ selector: 'app-invoice-summary-strip', imports: [DecimalPipe, LucideClock3, LucideFileText, LucideRotateCcw, LucideBadgeCheck], changeDetection: ChangeDetectionStrategy.OnPush, template: `
  <section class="summary" aria-label="ملخص الفواتير">
    <article><svg lucideFileText></svg><div><span>إجمالي الفواتير</span><strong>{{ summary().total | number }}</strong><small>خلال الفترة المحددة</small></div></article>
    <article class="paid"><svg lucideBadgeCheck></svg><div><span>مدفوعة</span><strong>{{ summary().paid | number }}</strong><small>فواتير مكتملة التحصيل</small></div></article>
    <article class="collecting"><svg lucideClock3></svg><div><span>قيد التحصيل</span><strong>{{ summary().collecting | number }}</strong><small>تحتاج إلى متابعة</small></div></article>
    <article class="refunded"><svg lucideRotateCcw></svg><div><span>مستردة</span><strong>{{ summary().refunded | number }}</strong><small>من إجمالي الفواتير</small></div></article>
  </section>`, styles: [`
  .summary{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid var(--border);border-radius:.8rem;background:#fff;min-height:7.7rem;overflow:hidden}.summary article{display:flex;align-items:center;justify-content:center;gap:1rem;padding:1rem;border-inline-end:1px solid var(--border)}.summary article:last-child{border:0}.summary svg{width:2rem;height:2rem;color:var(--forest)}.summary div{display:grid;gap:.1rem}.summary span{font-size:.82rem;font-weight:600}.summary strong{font:600 1.45rem var(--font-display);color:var(--forest)}.summary small{font-size:.72rem;color:var(--muted)}.paid svg,.paid strong{color:#226343}.collecting svg,.collecting strong{color:#a9620a}.refunded svg,.refunded strong{color:#a43229}@media(max-width:850px){.summary{grid-template-columns:repeat(2,1fr)}.summary article:nth-child(2){border-inline-end:0}.summary article:nth-child(-n+2){border-block-end:1px solid var(--border)}}@media(max-width:480px){.summary article{padding:.8rem;gap:.6rem}.summary svg{width:1.5rem}.summary strong{font-size:1.2rem}}
`]})
export class InvoiceSummaryStrip { readonly summary = input.required<InvoiceSummary>(); }
