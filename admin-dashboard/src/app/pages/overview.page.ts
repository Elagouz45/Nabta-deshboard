import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideArrowLeft, LucideBoxes, LucideCalendarDays, LucidePackageX, LucideRefreshCw, LucideShoppingBag, LucideTrendingUp, LucideTriangleAlert } from '@lucide/angular';
import { DashboardStore } from '../dashboard.store';
import { FeatureAvailability } from '../core/feature-availability';
import { StatusBadge } from '../shared/status-badge';

@Component({
  imports: [RouterLink, LucideArrowLeft, LucideBoxes, LucideCalendarDays, LucidePackageX, LucideRefreshCw, LucideShoppingBag, LucideTrendingUp, LucideTriangleAlert, StatusBadge],
  template: `
    <header class="overview-header">
      <div><p>الرئيسية</p><h1>نظرة عامة</h1><span>تابع المبيعات والمخزون وسير العمل من مكان واحد</span></div>
      <div class="header-actions"><div class="date-control"><svg lucideCalendarDays></svg><span>{{ currentDate }}</span></div><button class="refresh-button" type="button" [disabled]="store.loading()" (click)="store.loadOverview()"><svg lucideRefreshCw [class.spinning]="store.loading()"></svg>تحديث</button></div>
    </header>

    @if(store.loading()){
      <section class="stats" aria-label="جارٍ تحميل مؤشرات الأداء">@for(item of [1,2,3,4];track item){<article class="stat skeleton"></article>}</section>
    }@else if(store.error()){
      <section class="state error" role="alert"><strong>تعذر تحميل لوحة التحكم</strong><p>{{ store.error() }}</p><button class="btn" type="button" (click)="store.loadOverview()">إعادة المحاولة</button></section>
    }@else{
      <section class="stats" aria-label="مؤشرات الأداء">
        <article class="stat"><span class="stat-icon green"><svg lucideTrendingUp></svg></span><div><small>إجمالي المبيعات</small><strong>{{ store.revenue().toLocaleString('ar-EG') }} <em>ج.م</em></strong><p>حسب الطلبات الحالية</p></div></article>
        <article class="stat"><span class="stat-icon teal"><svg lucideShoppingBag></svg></span><div><small>الطلبات الجديدة</small><strong>{{ store.pendingOrders().toLocaleString('ar-EG') }}</strong><p>{{ store.pendingOrders() ? 'تحتاج إلى مراجعة' : 'لا توجد طلبات معلقة' }}</p></div></article>
        <article class="stat"><span class="stat-icon amber"><svg lucideTriangleAlert></svg></span><div><small>تنبيهات المخزون</small><strong>{{ store.lowStock().toLocaleString('ar-EG') }}</strong><p>{{ outOfStock().toLocaleString('ar-EG') }} نافد · {{ lowOnly().toLocaleString('ar-EG') }} منخفض</p></div></article>
        <article class="stat"><span class="stat-icon red"><svg lucidePackageX></svg></span><div><small>المنتجات النشطة</small><strong>{{ store.activeProducts().toLocaleString('ar-EG') }}</strong><p>متاحة حاليًا في المتجر</p></div></article>
      </section>

      <section class="dashboard-grid">
        <article class="panel chart-panel"><header><div><h2>المبيعات خلال آخر ٧ أيام</h2><p>ملخص بصري لحركة المبيعات</p></div><div class="chart-summary"><small>إجمالي الأسبوع</small><strong>{{ weeklySalesTotal.toLocaleString('ar-EG') }} <span>ج.م</span></strong></div></header>
          @if(features.demoMode()){
            <div class="chart" role="img" aria-label="مخطط تجريبي للمبيعات خلال سبعة أيام، أعلى قيمة يوم الاثنين">
              <div class="y-labels"><span>٦٠ ألف</span><span>٤٠ ألف</span><span>٢٠ ألف</span><span>٠</span></div>
              <div class="plot-area">
                <svg viewBox="0 0 700 210" preserveAspectRatio="none" aria-hidden="true">
                  <g class="grid-lines"><line x1="0" y1="14" x2="700" y2="14"/><line x1="0" y1="76" x2="700" y2="76"/><line x1="0" y1="138" x2="700" y2="138"/><line x1="0" y1="199" x2="700" y2="199"/></g>
                  <path class="area" d="M0 126 C42 126 76 86 116 82 S194 145 233 143 S311 108 350 105 S427 43 466 42 S544 66 583 68 S661 91 700 94 L700 199 L0 199 Z"/>
                  <path class="line" d="M0 126 C42 126 76 86 116 82 S194 145 233 143 S311 108 350 105 S427 43 466 42 S544 66 583 68 S661 91 700 94"/>
                  @for(point of chartPoints;track point.x){<circle [class.peak]="point.peak" [attr.cx]="point.x" [attr.cy]="point.y" r="4.5"/>}
                </svg>
                <div class="peak-label" aria-hidden="true"><small>أعلى مبيعات</small><strong>٥١٬٢٠٠ ج.م</strong></div>
              </div>
              <div class="x-labels">@for(day of weekDays;track day){<span>{{ day }}</span>}</div>
            </div>
          }@else{<div class="chart-empty"><strong>بيانات الرسم غير متاحة</strong><p>يلزم عقد تقارير مبيعات موثّق من Laravel.</p></div>}
        </article>

        <article class="panel attention-panel"><header><div><h2>يحتاج إلى إجراء</h2><p>الأولوية حسب البيانات الحالية</p></div><span class="attention-count">{{ attentionCount().toLocaleString('ar-EG') }}</span></header><div class="attention-list">
          @if(lowOnly()){<a routerLink="/inventory"><span class="attention-icon amber"><svg lucideBoxes></svg></span><div><strong>منتجات منخفضة المخزون</strong><small>{{ lowOnly().toLocaleString('ar-EG') }} منتجًا</small></div><svg lucideArrowLeft></svg></a>}
          @if(outOfStock()){<a routerLink="/inventory"><span class="attention-icon red"><svg lucidePackageX></svg></span><div><strong>منتجات نفدت</strong><small>{{ outOfStock().toLocaleString('ar-EG') }} منتجات</small></div><svg lucideArrowLeft></svg></a>}
          @if(store.pendingOrders()){<a routerLink="/orders"><span class="attention-icon teal"><svg lucideShoppingBag></svg></span><div><strong>طلبات تنتظر المراجعة</strong><small>{{ store.pendingOrders().toLocaleString('ar-EG') }} طلبات</small></div><svg lucideArrowLeft></svg></a>}
          @if(!attentionCount()){<div class="all-clear"><strong>لا توجد إجراءات عاجلة</strong><small>كل المؤشرات مستقرة حاليًا.</small></div>}
        </div></article>
      </section>

      <section class="panel recent"><header><div><h2>أحدث الطلبات</h2><p>آخر الطلبات المسترجعة من النظام</p></div></header>
        @if(store.orders().length){<div class="table-wrap"><table><thead><tr><th>رقم الطلب</th><th>العميل</th><th>الإجمالي</th><th>عدد المنتجات</th><th>الحالة</th><th>التاريخ</th></tr></thead><tbody>@for(order of store.orders().slice(0,6);track order.id){<tr><td><a [routerLink]="['/orders',order.id]">{{ order.orderNumber }}</a></td><td><strong>{{ order.customer }}</strong><small>{{ order.mobile }}</small></td><td>{{ order.total.toLocaleString('ar-EG') }} ج.م</td><td>{{ order.itemsCount.toLocaleString('ar-EG') }}</td><td><app-status-badge [value]="order.status"/></td><td>{{ order.createdAt }}</td></tr>}</tbody></table></div><footer><a routerLink="/orders"><svg lucideArrowLeft></svg>عرض كل الطلبات</a></footer>}@else{<div class="state"><strong>لا توجد طلبات بعد</strong><p>ستظهر الطلبات الجديدة هنا فور وصولها.</p></div>}
      </section>
    }
  `,
  styleUrl: './overview.page.scss',
})
export class OverviewPage {
  readonly store = inject(DashboardStore);
  readonly features = inject(FeatureAvailability);
  readonly outOfStock = computed(() => this.store.products().filter((product) => product.status === 'out_of_stock').length);
  readonly lowOnly = computed(() => this.store.products().filter((product) => product.status === 'low_stock').length);
  readonly attentionCount = computed(() => this.store.pendingOrders() + this.store.lowStock());
  readonly currentDate = new Intl.DateTimeFormat('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
  readonly weekDays = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
  readonly weeklySales = [31_000, 40_500, 27_500, 36_000, 51_200, 44_500, 38_000];
  readonly weeklySalesTotal = this.weeklySales.reduce((total, value) => total + value, 0);
  readonly chartPoints = [{ x: 0, y: 126 }, { x: 116, y: 82 }, { x: 233, y: 143 }, { x: 350, y: 105 }, { x: 466, y: 42, peak: true }, { x: 583, y: 68 }, { x: 700, y: 94 }];
}
