import { Component, inject } from '@angular/core';
import { DashboardStore } from '../dashboard.store';
import { PageHeader } from '../shared/page-header';

@Component({
  imports: [PageHeader],
  template: `<app-page-header
      title="الإعدادات"
      description="إعدادات المتجر الأساسية والتنبيهات."
    ></app-page-header>
    <form class="settings" (submit)="save($event)">
      <section>
        <header>
          <h2>بيانات المتجر</h2>
          <p>المعلومات التي تظهر للعملاء في الفواتير والتواصل.</p>
        </header>
        <div class="fields">
          <label>اسم المتجر<input value="نبته للحلول الزراعية" /></label
          ><label>البريد الإلكتروني<input type="email" value="hello@nabtah.example" /></label
          ><label>رقم خدمة العملاء<input dir="ltr" value="+20 100 000 0000" /></label
          ><label
            >العملة<select>
              <option>الجنيه المصري (ج.م)</option>
            </select></label
          >
        </div>
      </section>
      <section>
        <header>
          <h2>التنبيهات</h2>
          <p>اختر الأحداث المهمة التي تريد متابعتها.</p>
        </header>
        <div class="preferences">
          @for (item of preferences; track item.label) {
            <label
              ><span
                ><strong>{{ item.label }}</strong
                ><small>{{ item.description }}</small></span
              ><input type="checkbox" [checked]="item.checked"
            /></label>
          }
        </div>
      </section>
      <footer>
        <button class="btn secondary" type="reset">إلغاء التغييرات</button
        ><button class="btn" type="submit">حفظ الإعدادات</button>
      </footer>
    </form>`,
  styles: [
    `
      .settings {
        display: grid;
        gap: 1rem;
      }
      .settings section {
        display: grid;
        grid-template-columns: minmax(13rem, 0.55fr) minmax(0, 1.4fr);
        gap: 2rem;
        padding: 1.25rem;
        border: 1px solid var(--border);
        border-radius: var(--radius);
        background: #fff;
        box-shadow: var(--shadow);
      }
      h2 {
        margin: 0;
        color: var(--forest);
        font: 700 1rem var(--font-display);
      }
      header p {
        margin: 0.25rem 0;
        color: var(--muted);
        font-size: 0.75rem;
      }
      .fields {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }
      .fields label {
        display: grid;
        gap: 0.3rem;
        color: var(--text);
        font-size: 0.78rem;
      }
      .preferences {
        display: grid;
      }
      .preferences label {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 0.75rem 0;
        border-bottom: 1px solid var(--border);
      }
      .preferences label:last-child {
        border: 0;
      }
      .preferences span {
        display: grid;
      }
      .preferences strong {
        font-size: 0.8rem;
      }
      .preferences small {
        color: var(--muted);
        font-size: 0.7rem;
      }
      .preferences input {
        width: 1.1rem;
        height: 1.1rem;
        accent-color: var(--brand);
      }
      form > footer {
        display: flex;
        justify-content: flex-end;
        gap: 0.6rem;
      }
      @media (max-width: 750px) {
        .settings section {
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        .fields {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class SettingsPage {
  readonly store = inject(DashboardStore);
  readonly preferences = [
    { label: 'الطلبات الجديدة', description: 'إشعار عند وصول طلب جديد.', checked: true },
    { label: 'المخزون المنخفض', description: 'إشعار عندما يصل منتج إلى حد الأمان.', checked: true },
    { label: 'رسائل العملاء', description: 'إشعار عند وصول رسالة من صفحة التواصل.', checked: true },
    {
      label: 'المراجعات الجديدة',
      description: 'إشعار عند إضافة مراجعة تحتاج إلى اعتماد.',
      checked: false,
    },
  ];
  save(event: Event): void {
    event.preventDefault();
    this.store.showToast('تم حفظ الإعدادات بنجاح');
  }
}
