import { Component, computed, input } from '@angular/core';
import { OrderStatus, StockStatus } from '../models';

const LABELS: Record<OrderStatus | StockStatus, string> = {
  pending: 'قيد المراجعة', confirmed: 'تم التأكيد', processing: 'قيد التجهيز', shipped: 'تم الشحن', delivered: 'مكتمل', cancelled: 'ملغي',
  in_stock: 'متوفر', low_stock: 'مخزون منخفض', out_of_stock: 'نفد المخزون',
};

@Component({
  selector: 'app-status-badge',
  template: `<span class="status" [class]="'status status--' + value()"><span aria-hidden="true"></span>{{ label() }}</span>`,
  styles: [`
    .status{display:inline-flex;align-items:center;justify-content:center;gap:.45rem;width:7.5rem;min-height:1.9rem;box-sizing:border-box;padding:.2rem .7rem;border-radius:999px;font-size:.82rem;font-weight:600;white-space:nowrap;background:#eff3f0;color:#445048}
    .status span{width:.42rem;height:.42rem;border-radius:50%;background:currentColor}
    .status--delivered,.status--in_stock{background:#e8f5ec;color:#16794a}.status--pending,.status--low_stock{background:#fff4d6;color:#986000}
    .status--processing,.status--shipped{background:#e8f5fa;color:#17627d}.status--confirmed{background:#ebf3ff;color:#245b9e}
    .status--cancelled,.status--out_of_stock{background:#fcebea;color:#a52a21}
  `],
})
export class StatusBadge {
  readonly value = input.required<OrderStatus | StockStatus>();
  readonly label = computed(() => LABELS[this.value()]);
}


