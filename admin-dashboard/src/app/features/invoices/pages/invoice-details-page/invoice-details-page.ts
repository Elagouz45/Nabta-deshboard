import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LucideArrowRight, LucidePrinter } from '@lucide/angular';
import { InvoicesApiService } from '../../data-access/invoices-api.service';
import { InvoicesStore } from '../../data-access/invoices.store';
import { Invoice } from '../../models/invoice.models';
import { InvoiceStatusBadge } from '../../components/invoice-status-badge/invoice-status-badge';

@Component({ selector: 'app-invoice-details-page', imports: [CurrencyPipe, DatePipe, RouterLink, LucideArrowRight, LucidePrinter, InvoiceStatusBadge], providers: [InvoicesApiService, InvoicesStore], changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './invoice-details-page.html', styleUrl: './invoice-details-page.scss' })
export class InvoiceDetailsPage {
  readonly invoice = signal<Invoice | null>(null); readonly loading = signal(true); readonly error = signal(false);
  private readonly store = inject(InvoicesStore); private readonly route = inject(ActivatedRoute);
  constructor(){ this.store.getById(this.route.snapshot.paramMap.get('invoice-id') ?? '').pipe(takeUntilDestroyed(inject(DestroyRef))).subscribe({ next:(invoice)=>{this.invoice.set(invoice);this.loading.set(false);}, error:()=>{this.error.set(true);this.loading.set(false);} }); }
  print(): void { window.print(); }
}
