import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideDownload, LucideSearch } from '@lucide/angular';
import { DashboardStore } from '../dashboard.store';
import { OrderStatus } from '../models';
import { PageHeader } from '../shared/page-header';
import { StatusBadge } from '../shared/status-badge';

@Component({
  imports: [RouterLink, LucideDownload, LucideSearch, PageHeader, StatusBadge],
  template: `
    <app-page-header title="الطلبات" description="تابع الطلبات وحدّث حالتها من مكان واحد."><button class="btn secondary" type="button" (click)="exportOrders()"><svg lucideDownload></svg>تصدير</button></app-page-header>
    <section class="summary-row" aria-label="ملخص الطلبات"><article><span>طلبات اليوم</span><strong>12</strong></article><article><span>قيد المراجعة</span><strong>{{ store.pendingOrders() }}</strong></article><article><span>قيد التجهيز</span><strong>8</strong></article><article><span>تم الشحن</span><strong>16</strong></article></section>
    <section class="data-panel"><div class="toolbar"><label class="search-field"><svg lucideSearch></svg><span class="visually-hidden">بحث في الطلبات</span><input #query type="search" placeholder="رقم الطلب، اسم العميل أو الهاتف" [value]="store.search()" (change)="search(query.value)"></label><label><span class="visually-hidden">فلترة بالحالة</span><select #status [value]="store.orderStatus()" (change)="setStatus(status.value)"><option value="all">كل الحالات</option><option value="pending">قيد المراجعة</option><option value="confirmed">تم التأكيد</option><option value="processing">قيد التجهيز</option><option value="shipped">تم الشحن</option><option value="delivered">مكتمل</option><option value="cancelled">ملغي</option></select></label>@if(store.search() || store.orderStatus() !== 'all'){<button class="link-button" type="button" (click)="store.clearFilters()">مسح الفلاتر</button>}</div>
      <div class="table-wrap"><table><thead><tr><th>رقم الطلب</th><th>العميل</th><th>الموقع</th><th>المنتجات</th><th>الإجمالي</th><th>طريقة الدفع</th><th>الحالة</th><th></th></tr></thead><tbody>@for(order of store.filteredOrders(); track order.id){<tr><td><a [routerLink]="['/orders',order.id]">{{ order.orderNumber }}</a><small>{{ order.createdAt }}</small></td><td><strong>{{ order.customer }}</strong><small>{{ order.mobile }}</small></td><td>{{ order.governorate }}</td><td>{{ order.itemsCount }} منتجات</td><td><strong>{{ order.total.toLocaleString('ar-EG') }} ج.م</strong></td><td>{{ order.payment }}</td><td><app-status-badge [value]="order.status"/></td><td><a class="row-action" [routerLink]="['/orders',order.id]" aria-label="عرض تفاصيل الطلب">عرض</a></td></tr>}@empty{<tr><td colspan="8"><div class="empty"><strong>لا توجد طلبات مطابقة</strong><span>جرّب تغيير كلمة البحث أو حالة الطلب.</span><button type="button" class="btn secondary" (click)="store.clearFilters()">مسح البحث</button></div></td></tr>}</tbody></table></div>
      <footer class="pagination"><span>عرض {{ store.filteredOrders().length }} من {{ store.orders().length }} طلبات</span></footer>
    </section>
  `,
  styles: [`
    .summary-row{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:1rem}.summary-row article{padding:1rem 1.1rem;border:1px solid var(--border);border-radius:var(--radius);background:#fff}.summary-row span{color:var(--muted);font-size:.78rem}.summary-row strong{display:block;margin-top:.15rem;color:var(--forest);font:700 1.35rem var(--font-display)}.data-panel{overflow:hidden;background:#fff;border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}.toolbar{display:flex;gap:.65rem;padding:1rem;border-bottom:1px solid var(--border)}.search-field{position:relative;display:flex;align-items:center;flex:1}.search-field lucide-icon{position:absolute;inset-inline-start:.8rem;width:1.05rem;color:var(--muted)}.search-field input{padding-inline-start:2.4rem}select{min-width:11rem}.link-button{border:0;background:none;color:var(--brand);font:600 .8rem var(--font-body);cursor:pointer}.table-wrap{overflow:auto}table{width:100%;border-collapse:collapse}th,td{padding:.85rem 1rem;border-bottom:1px solid var(--border);white-space:nowrap;text-align:start;font-size:.8rem}th{background:#fafcfa;color:var(--muted);font-size:.72rem}td>a:first-child{color:var(--brand);font-weight:700}td small{display:block;color:var(--muted);font-size:.68rem}.row-action{padding:.35rem .6rem;border-radius:.45rem;background:var(--pale);color:var(--brand)}.empty{display:grid;justify-items:center;gap:.5rem;padding:3rem}.empty span{color:var(--muted)}.pagination{display:flex;justify-content:space-between;align-items:center;padding:.8rem 1rem;color:var(--muted);font-size:.76rem}.pagination div{display:flex;gap:.25rem}.pagination button{min-width:2rem;height:2rem;border:1px solid var(--border);border-radius:.4rem;background:#fff;color:var(--text)}.pagination button.current{background:var(--brand);color:#fff}.pagination button:disabled{opacity:.45}@media(max-width:760px){.summary-row{grid-template-columns:repeat(2,1fr)}.toolbar{flex-wrap:wrap}.search-field{flex-basis:100%}.pagination>span{display:none}.pagination{justify-content:center}}
  `],
})
export class OrdersPage {
  readonly store = inject(DashboardStore);
  setStatus(value: string): void { this.store.orderStatus.set(value as OrderStatus | 'all'); this.store.loadOrders(); }
  search(value: string): void { this.store.setSearch(value); this.store.loadOrders(); }
  exportOrders(): void {
    const rows = this.store.filteredOrders().map((order) => [order.orderNumber, order.customer, order.governorate, order.total, order.payment, order.status]);
    const csv = [['رقم الطلب', 'العميل', 'الموقع', 'الإجمالي', 'طريقة الدفع', 'الحالة'], ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url; link.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`; link.click(); URL.revokeObjectURL(url);
  }
}




