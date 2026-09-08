import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { InvoicePaymentStatus, INVOICE_STATUS_LABELS } from '../../models/invoice.models';

@Component({ selector: 'app-invoice-status-badge', changeDetection: ChangeDetectionStrategy.OnPush, template: `<span class="invoice-status" [class]="'invoice-status invoice-status--' + status()">{{ labels[status()] }}</span>`, styles: [`
  .invoice-status{display:inline-flex;width:7rem;min-height:1.75rem;align-items:center;justify-content:center;padding:.15rem .65rem;border-radius:.5rem;font-size:.75rem;font-weight:600;white-space:nowrap;background:#eef2ef;color:#526159}
  .invoice-status--paid{background:#e8f2ea;color:#37694d}.invoice-status--collecting{background:#fff3df;color:#a46112}.invoice-status--partially_paid{background:#e5f2f4;color:#257087}.invoice-status--refunded{background:#f8e8e6;color:#a54136}
`]} )
export class InvoiceStatusBadge { readonly status = input.required<InvoicePaymentStatus>(); readonly labels = INVOICE_STATUS_LABELS; }
