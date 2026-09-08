import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LucideDownload, LucideRotateCcw, LucideSearch } from '@lucide/angular';
import { debounceTime, distinctUntilChanged, startWith, switchMap } from 'rxjs';
import { ActionMenuComponent, ActionMenuItem } from '../../../../shared/action-menu/action-menu.component';
import { AppDialogComponent } from '../../../../shared/app-dialog/app-dialog.component';
import { DeleteActionComponent } from '../../../../shared/delete-action/delete-action.component';
import { PaymentStatusBadge } from '../../components/payment-status-badge/payment-status-badge';
import { PaymentSummaryComponent } from '../../components/payment-summary/payment-summary';
import { PaymentsApiService } from '../../data-access/payments-api.service';
import { PaymentsStore } from '../../data-access/payments.store';
import { PAYMENT_METHOD_LABELS, PaymentMethod, PaymentRecord, PaymentStatus } from '../../models/payment.models';

type PaymentDialogMode = 'details' | 'collect' | 'refund';

@Component({ selector: 'app-payments-list-page', imports: [CurrencyPipe, DatePipe, DecimalPipe, ReactiveFormsModule, RouterLink, LucideDownload, LucideRotateCcw, LucideSearch, PaymentStatusBadge, PaymentSummaryComponent, ActionMenuComponent, AppDialogComponent,DeleteActionComponent], providers: [PaymentsApiService, PaymentsStore], changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './payments-list-page.html', styleUrls: ['./payments-list-page.scss', './payment-actions.scss'] })
export class PaymentsListPage {
  readonly store = inject(PaymentsStore); readonly search = new FormControl('', { nonNullable: true }); readonly selectedPayment = signal<PaymentRecord | null>(null); readonly dialogMode = signal<PaymentDialogMode>('details');
  private readonly route = inject(ActivatedRoute); private readonly router = inject(Router); private readonly destroyRef = inject(DestroyRef);
  constructor() { const params = this.route.snapshot.queryParamMap; const status = params.get('status'); const method = params.get('method'); const period = params.get('period'); this.store.setFilters({ search: params.get('search') ?? '', status: this.isStatus(status) ? status : '', method: this.isMethod(method) ? method : '', period: period === 'today' || period === 'week' || period === 'month' ? period : 'all', page: Math.max(1, Number(params.get('page')) || 1) }); this.search.setValue(this.store.filters().search, { emitEvent: false }); this.search.valueChanges.pipe(startWith(this.search.value), debounceTime(300), distinctUntilChanged(), switchMap((search) => { this.store.setFilters({ search, page: 1 }); this.sync(); return this.store.load(); }), takeUntilDestroyed(this.destroyRef)).subscribe(); }
  setFilter(key: 'status' | 'method' | 'period', value: string): void { this.store.setFilters({ [key]: value, page: 1 }); this.reload(); }
  reset(): void { this.store.reset(); this.search.setValue('', { emitEvent: false }); this.reload(); }
  page(value: number): void { if (value < 1 || value > this.store.totalPages()) return; this.store.setFilters({ page: value }); this.reload(); }
  methodLabel(method: PaymentMethod): string { return PAYMENT_METHOD_LABELS[method]; }
  actionsFor(item: PaymentRecord): readonly ActionMenuItem[] { return [{ id: 'details', label: 'عرض تفاصيل العملية' }, { id: 'order', label: 'فتح الطلب المرتبط' }, ...(item.status === 'failed' || item.status === 'pending' ? [{ id: 'collect', label: item.status === 'failed' ? 'إعادة المحاولة' : 'تسجيل كمدفوعة' }] : []), ...(item.status === 'paid' ? [{ id: 'refund', label: 'تسجيل استرداد جزئي', danger: true }] : [])]; }
  handleAction(action: string, item: PaymentRecord): void { if (action === 'order') { void this.router.navigate(['/orders', item.orderId]); return; } this.selectedPayment.set(item); this.dialogMode.set(action === 'collect' ? 'collect' : action === 'refund' ? 'refund' : 'details'); }
  closeDialog(): void { this.selectedPayment.set(null); }
  confirmAction(): void { const item = this.selectedPayment(); if (!item) return; this.store.updateStatus(item.id, this.dialogMode() === 'collect' ? 'paid' : 'partially_refunded'); this.closeDialog(); }
  private reload(): void { this.sync(); this.store.load().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(); }
  private sync(): void { const filters = this.store.filters(); void this.router.navigate([], { relativeTo: this.route, replaceUrl: true, queryParams: { search: filters.search || null, status: filters.status || null, method: filters.method || null, period: filters.period === 'all' ? null : filters.period, page: filters.page === 1 ? null : filters.page } }); }
  private isStatus(value: string | null): value is PaymentStatus { return value === 'paid' || value === 'pending' || value === 'failed' || value === 'partially_refunded'; }
  private isMethod(value: string | null): value is PaymentMethod { return value === 'card' || value === 'cash_on_delivery' || value === 'wallet'; }
}
