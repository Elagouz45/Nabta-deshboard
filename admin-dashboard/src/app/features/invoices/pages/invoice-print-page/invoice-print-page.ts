import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InvoicesApiService } from '../../data-access/invoices-api.service';
import { InvoicesStore } from '../../data-access/invoices.store';
import { Invoice } from '../../models/invoice.models';

@Component({ selector: 'app-invoice-print-page', imports: [CurrencyPipe, DatePipe], providers: [InvoicesApiService, InvoicesStore], changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './invoice-print-page.html', styleUrl: './invoice-print-page.scss' })
export class InvoicePrintPage {
  readonly invoice = signal<Invoice | null>(null); private readonly store = inject(InvoicesStore); private readonly route = inject(ActivatedRoute);
  constructor(){ this.store.getById(this.route.snapshot.paramMap.get('invoice-id') ?? '').pipe(takeUntilDestroyed(inject(DestroyRef))).subscribe((invoice)=>this.invoice.set(invoice)); }
  print(): void { window.print(); }
}
