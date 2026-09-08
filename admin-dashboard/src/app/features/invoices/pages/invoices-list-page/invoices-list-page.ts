import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, startWith, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LucideDownload, LucideSearch, LucideRotateCcw, LucideEye, LucidePrinter } from '@lucide/angular';
import { InvoiceSummaryStrip } from '../../components/invoice-summary-strip/invoice-summary-strip';
import { InvoiceStatusBadge } from '../../components/invoice-status-badge/invoice-status-badge';
import { InvoicesApiService } from '../../data-access/invoices-api.service';
import { DEFAULT_INVOICE_QUERY, InvoicesStore } from '../../data-access/invoices.store';
import { InvoicePaymentStatus, InvoiceSortField, SortDirection } from '../../models/invoice.models';
import { DeleteActionComponent } from '../../../../shared/delete-action/delete-action.component';

@Component({
  selector: 'app-invoices-list-page',
  imports: [CurrencyPipe, DatePipe, DecimalPipe, ReactiveFormsModule, RouterLink, InvoiceSummaryStrip, InvoiceStatusBadge, LucideDownload, LucideSearch, LucideRotateCcw,DeleteActionComponent],
  providers: [InvoicesApiService, InvoicesStore], changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './invoices-list-page.html', styleUrl: './invoices-list-page.scss',
})
export class InvoicesListPage {
  readonly store = inject(InvoicesStore);
  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly branches = [{ id: 'cairo', name: 'فرع القاهرة' }, { id: 'giza', name: 'مخزن الجيزة' }, { id: 'alex', name: 'فرع الإسكندرية' }] as const;
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    const params = this.route.snapshot.queryParamMap;
    const paymentStatus = params.get('status');
    const sort = params.get('sort');
    const direction = params.get('direction');
    this.store.setQuery({ search: params.get('search') ?? '', paymentStatus: this.isStatus(paymentStatus) ? paymentStatus : '', branchId: params.get('branch') ?? '', dateFrom: params.get('from') ?? '', dateTo: params.get('to') ?? '', sort: this.isSort(sort) ? sort : 'issuedAt', direction: direction === 'asc' ? 'asc' : 'desc', page: Math.max(1, Number(params.get('page')) || 1) });
    this.searchControl.setValue(this.store.query().search, { emitEvent: false });
    this.searchControl.valueChanges.pipe(startWith(this.searchControl.value), debounceTime(300), distinctUntilChanged(), switchMap((search) => { this.store.setQuery({ search, page: 1 }); this.syncUrl(); return this.store.load(); }), takeUntilDestroyed(this.destroyRef)).subscribe({ error: () => undefined });
  }

  updateFilter(key: 'paymentStatus' | 'branchId' | 'dateFrom' | 'dateTo', value: string): void { this.store.setQuery({ [key]: value, page: 1 }); this.refresh(); }
  sort(field: InvoiceSortField): void { const current = this.store.query(); const direction: SortDirection = current.sort === field && current.direction === 'asc' ? 'desc' : 'asc'; this.store.setQuery({ sort: field, direction, page: 1 }); this.refresh(); }
  goToPage(page: number): void { if (page < 1 || page > this.store.totalPages()) return; this.store.setQuery({ page }); this.refresh(); document.querySelector<HTMLElement>('.invoices-table')?.focus(); }
  reset(): void { this.store.reset(); this.searchControl.setValue('', { emitEvent: false }); this.refresh(); }
  retry(): void { this.refresh(); }
  printInvoice(id: string): void { void this.router.navigate(['/pending/invoices', id, 'print']); }
  private refresh(): void { this.syncUrl(); this.store.load().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({ error: () => undefined }); }
  private syncUrl(): void { const q = this.store.query(); void this.router.navigate([], { relativeTo: this.route, replaceUrl: true, queryParams: { search: q.search || null, status: q.paymentStatus || null, branch: q.branchId || null, from: q.dateFrom || null, to: q.dateTo || null, sort: q.sort === DEFAULT_INVOICE_QUERY.sort ? null : q.sort, direction: q.direction === DEFAULT_INVOICE_QUERY.direction ? null : q.direction, page: q.page === 1 ? null : q.page }, queryParamsHandling: '' }); }
  private isStatus(value: string | null): value is InvoicePaymentStatus { return value === 'paid' || value === 'collecting' || value === 'partially_paid' || value === 'refunded'; }
  private isSort(value: string | null): value is InvoiceSortField { return value === 'invoiceNumber' || value === 'issuedAt' || value === 'total' || value === 'paymentStatus'; }
}
