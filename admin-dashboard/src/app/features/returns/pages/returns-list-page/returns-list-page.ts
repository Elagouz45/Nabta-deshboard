import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LucideDownload, LucideEllipsisVertical, LucideInfo, LucideRotateCcw, LucideSearch } from '@lucide/angular';
import { debounceTime, distinctUntilChanged, startWith, switchMap } from 'rxjs';
import { ReturnStatusBadge } from '../../components/return-status-badge/return-status-badge';
import { ReturnsSummaryComponent } from '../../components/returns-summary/returns-summary';
import { ReturnsApiService } from '../../data-access/returns-api.service';
import { ReturnsStore } from '../../data-access/returns.store';
import { RefundMethod, ReturnStatus } from '../../models/returns.models';

@Component({ selector: 'app-returns-list-page', imports: [CurrencyPipe, DecimalPipe, ReactiveFormsModule, RouterLink, LucideDownload, LucideEllipsisVertical, LucideInfo, LucideRotateCcw, LucideSearch, ReturnStatusBadge, ReturnsSummaryComponent], providers: [ReturnsApiService, ReturnsStore], changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './returns-list-page.html', styleUrl: './returns-list-page.scss' })
export class ReturnsListPage {
  readonly store = inject(ReturnsStore); readonly search = new FormControl('', { nonNullable: true }); private readonly route = inject(ActivatedRoute); private readonly router = inject(Router); private readonly destroyRef = inject(DestroyRef);
  constructor() { const params = this.route.snapshot.queryParamMap; const status = params.get('status'); const method = params.get('refundMethod'); const period = params.get('period'); this.store.setFilters({ search: params.get('search') ?? '', status: this.isStatus(status) ? status : '', refundMethod: this.isMethod(method) ? method : '', period: period === 'today' || period === 'week' || period === 'month' ? period : 'all', page: Math.max(1, Number(params.get('page')) || 1) }); this.search.setValue(this.store.filters().search, { emitEvent: false }); this.search.valueChanges.pipe(startWith(this.search.value), debounceTime(300), distinctUntilChanged(), switchMap((search) => { this.store.setFilters({ search, page: 1 }); this.sync(); return this.store.load(); }), takeUntilDestroyed(this.destroyRef)).subscribe(); }
  setFilter(key: 'status' | 'refundMethod' | 'period', value: string): void { this.store.setFilters({ [key]: value, page: 1 }); this.reload(); }
  reset(): void { this.store.reset(); this.search.setValue('', { emitEvent: false }); this.reload(); }
  setPage(page: number): void { if (page < 1 || page > this.store.totalPages()) return; this.store.setFilters({ page }); this.reload(); }
  private reload(): void { this.sync(); this.store.load().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(); }
  private sync(): void { const f = this.store.filters(); void this.router.navigate([], { relativeTo: this.route, replaceUrl: true, queryParams: { search: f.search || null, status: f.status || null, refundMethod: f.refundMethod || null, period: f.period === 'all' ? null : f.period, page: f.page === 1 ? null : f.page } }); }
  private isStatus(value: string | null): value is ReturnStatus { return value === 'new' || value === 'awaiting_receipt' || value === 'inspecting' || value === 'approved' || value === 'rejected'; }
  private isMethod(value: string | null): value is RefundMethod { return value === 'original' || value === 'wallet' || value === 'bank'; }
}
