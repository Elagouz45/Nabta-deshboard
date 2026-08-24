import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SeoService } from '@core/services/seo.service';

const POLICIES: Record<string, { title: string; body: string[] }> = {
  privacy: {
    title: 'سياسة الخصوصية (مسودة غير مراجعة قانونيًا)',
    body: [
      'هذه صفحة إرشادية للعرض وليست وثيقة قانونية معتمدة.',
      'نجمع بيانات الحساب والطلبات لتقديم الخدمة. في الوضع التجريبي تُحفظ محليًا على جهازك.',
      'لا نبيع بياناتك لأطراف ثالثة في هذا النموذج.',
    ],
  },
  terms: {
    title: 'شروط الاستخدام (مسودة)',
    body: [
      'استخدام المنصة يعني الموافقة على أن المحتوى الزراعي إرشادي عام.',
      'المنتجات المعروضة لأغراض العرض وقد تختلف عند الربط مع المخزون الحقيقي.',
    ],
  },
  shipping: {
    title: 'سياسة الشحن (مسودة)',
    body: ['الشحن داخل مصر بمدد تقديرية حسب المحافظة.', 'التكلفة تظهر قبل تأكيد الطلب.'],
  },
  returns: {
    title: 'سياسة الإرجاع (مسودة)',
    body: ['العبوات المغلقة غير المستخدمة يمكن طلب إرجاعها ضمن المدة المعلنة.', 'مواد وقاية النبات المفتوحة تُستثنى لأسباب سلامة.'],
  },
  payment: {
    title: 'سياسة الدفع (مسودة)',
    body: ['الدفع عند الاستلام متاح في النموذج التجريبي.', 'بطاقات الدفع والمحافظ ستُربط عبر الخلفية ولن تُجمع أرقام البطاقات على هذا الموقع.'],
  },
  cookies: {
    title: 'سياسة ملفات الارتباط (مسودة)',
    body: ['نستخدم ملفات ضرورية لحفظ السلة واللغة والموافقة.', 'يمكنك اختيار الأساسيات فقط من شريط الموافقة.'],
  },
};

@Component({
  selector: 'app-policy-page',
  standalone: true,
  template: `
    <div class="app-container section">
      <p class="badge">محتوى قانوني غير معتمد — يحتاج مراجعة محامٍ</p>
      <h1>{{ policy.title }}</h1>
      @for (p of policy.body; track p) { <p>{{ p }}</p> }
    </div>
  `,
})
export class PolicyPage {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  policy = POLICIES['privacy'];
  constructor() {
    const key = (this.route.snapshot.data['policy'] as string) || 'privacy';
    this.policy = POLICIES[key] ?? POLICIES['privacy'];
    this.seo.set({ title: this.policy.title, description: this.policy.body[0], path: this.route.snapshot.url.join('/') });
  }
}
