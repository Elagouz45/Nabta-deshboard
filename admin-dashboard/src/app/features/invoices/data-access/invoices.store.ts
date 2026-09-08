import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, delay, finalize, Observable, of, take, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Invoice, InvoicePage, InvoiceQuery, InvoiceSummary } from '../models/invoice.models';
import { DEMO_INVOICES } from './invoices.demo';
import { InvoicesApiService } from './invoices-api.service';
import { TrashService } from '../../../core/trash/trash.service';

export const DEFAULT_INVOICE_QUERY: InvoiceQuery = { search: '', paymentStatus: '', branchId: '', dateFrom: '', dateTo: '', sort: 'issuedAt', direction: 'desc', page: 1, perPage: 7 };

@Injectable()
export class InvoicesStore {
  private readonly api = inject(InvoicesApiService);
  private readonly trash = inject(TrashService);
  private readonly pageState = signal<InvoicePage | null>(null);
  private readonly queryState = signal<InvoiceQuery>(DEFAULT_INVOICE_QUERY);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);
  private readonly downloadingState = signal(false);
  private readonly demoInvoicesState = signal<readonly Invoice[]>(DEMO_INVOICES.filter(item=>!this.trash.isTrashed('invoice',item.id)));
  readonly page = this.pageState.asReadonly();
  readonly query = this.queryState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly downloading = this.downloadingState.asReadonly();
  readonly items = computed(() => this.pageState()?.items ?? []);
  readonly summary = computed<InvoiceSummary>(() => this.pageState()?.summary ?? { total: 0, paid: 0, collecting: 0, refunded: 0 });
  readonly hasFilters = computed(() => { const q = this.queryState(); return !!(q.search || q.paymentStatus || q.branchId || q.dateFrom || q.dateTo); });
  readonly rangeLabel = computed(() => { const p = this.pageState(); if (!p?.total) return 'عرض 0 من 0'; const start = (p.page - 1) * p.perPage + 1; return `عرض ${start}–${Math.min(start + p.items.length - 1, p.total)} من ${p.total}`; });
  readonly totalPages = computed(() => Math.max(1, Math.ceil((this.pageState()?.total ?? 0) / this.queryState().perPage)));

  setQuery(patch: Partial<InvoiceQuery>): void { this.queryState.update((query) => ({ ...query, ...patch })); }
  reset(): void { this.queryState.set(DEFAULT_INVOICE_QUERY); }
  load(): Observable<InvoicePage> {
    this.loadingState.set(true); this.errorState.set(null);
    const request = environment.demoAdmin ? this.demoList(this.queryState()) : this.api.list(this.queryState());
    return request.pipe(tap((page) => this.pageState.set(page)), catchError(() => { this.errorState.set('تعذر تحميل الفواتير. حاول مرة أخرى.'); return of(this.pageState() ?? { items: [], summary: { total: 0, paid: 0, collecting: 0, refunded: 0 }, page: 1, perPage: this.queryState().perPage, total: 0 }); }), finalize(() => this.loadingState.set(false)));
  }
  getById(id: string): Observable<Invoice> { return environment.demoAdmin ? of(this.demoInvoicesState().find((invoice) => invoice.id === id)!).pipe(delay(180)) : this.api.details(id); }
  delete(invoice:Invoice):void{if(!environment.demoAdmin){this.errorState.set('حذف الفواتير ينتظر عقد Laravel والصلاحية المعتمدة.');return;}this.demoInvoicesState.update(items=>items.filter(item=>item.id!==invoice.id));this.load().pipe(take(1)).subscribe();}
  downloadReport(): void {
    if (this.downloadingState()) return;
    this.downloadingState.set(true);
    const source = environment.demoAdmin ? of(this.createCsv()).pipe(delay(250)) : this.api.report(this.queryState());
    source.pipe(take(1), tap((blob) => this.saveBlob(blob, `invoices-${new Date().toISOString().slice(0, 10)}.csv`)), catchError(() => { this.errorState.set('تعذر تنزيل تقرير الفواتير.'); return of(null); }), finalize(() => this.downloadingState.set(false))).subscribe();
  }

  private demoList(query: InvoiceQuery): Observable<InvoicePage> {
    const search = query.search.trim().toLocaleLowerCase('ar');
    let rows = this.demoInvoicesState().filter((invoice) => (!search || [invoice.invoiceNumber, invoice.orderNumber, invoice.customerName].some((value) => value.toLocaleLowerCase('ar').includes(search))) && (!query.paymentStatus || invoice.paymentStatus === query.paymentStatus) && (!query.branchId || invoice.branchId === query.branchId) && (!query.dateFrom || invoice.issuedAt.slice(0, 10) >= query.dateFrom) && (!query.dateTo || invoice.issuedAt.slice(0, 10) <= query.dateTo));
    const summary = { total: rows.length, paid: rows.filter((item) => item.paymentStatus === 'paid').length, collecting: rows.filter((item) => item.paymentStatus === 'collecting' || item.paymentStatus === 'partially_paid').length, refunded: rows.filter((item) => item.paymentStatus === 'refunded').length };
    rows = [...rows].sort((a, b) => this.compare(a, b, query));
    const start = (query.page - 1) * query.perPage;
    return of({ items: rows.slice(start, start + query.perPage), summary, page: query.page, perPage: query.perPage, total: rows.length }).pipe(delay(220));
  }
  private compare(a: Invoice, b: Invoice, query: InvoiceQuery): number { const left = query.sort === 'invoiceNumber' ? a.invoiceNumber : query.sort === 'total' ? a.total : query.sort === 'paymentStatus' ? a.paymentStatus : a.issuedAt; const right = query.sort === 'invoiceNumber' ? b.invoiceNumber : query.sort === 'total' ? b.total : query.sort === 'paymentStatus' ? b.paymentStatus : b.issuedAt; const value = left < right ? -1 : left > right ? 1 : 0; return query.direction === 'asc' ? value : -value; }
  private createCsv(): Blob { const rows = this.demoRows().map((invoice) => [invoice.invoiceNumber, invoice.orderNumber, invoice.customerName, invoice.issuedAt.slice(0, 10), invoice.branchName, invoice.total, invoice.paidAmount, invoice.refundedAmount, invoice.remainingAmount, invoice.paymentStatus]); return new Blob(['\ufeff', [['رقم الفاتورة','رقم الطلب','العميل','تاريخ الإصدار','الفرع','الإجمالي','المدفوع','المسترد','المتبقي','حالة الدفع'], ...rows].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' }); }
  private demoRows(): readonly Invoice[] { const q = this.queryState(); const search = q.search.trim().toLocaleLowerCase('ar'); return this.demoInvoicesState().filter((i) => (!search || [i.invoiceNumber,i.orderNumber,i.customerName].some((v) => v.toLocaleLowerCase('ar').includes(search))) && (!q.paymentStatus || i.paymentStatus === q.paymentStatus) && (!q.branchId || i.branchId === q.branchId) && (!q.dateFrom || i.issuedAt.slice(0,10) >= q.dateFrom) && (!q.dateTo || i.issuedAt.slice(0,10) <= q.dateTo)); }
  private saveBlob(blob: Blob, filename: string): void { const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = filename; link.click(); URL.revokeObjectURL(url); }
}
