import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  template: `<div class="app-container section"><h1>الصفحة غير موجودة</h1><p>تحقق من الرابط.</p><a class="btn" routerLink="/">الرئيسية</a></div>`,
})
export class NotFoundPage {}

@Component({
  selector: 'app-unauthorized-page',
  imports: [RouterLink],
  template: `<div class="app-container section"><h1>غير مصرح</h1><p>هذا المسار يتطلب صلاحية مختلفة.</p><a class="btn" routerLink="/">الرئيسية</a></div>`,
})
export class UnauthorizedPage {}

@Component({
  selector: 'app-error-page',
  imports: [RouterLink],
  template: `<div class="app-container section"><h1>حدث خطأ</h1><p>حاول لاحقًا أو تواصل مع الدعم.</p><a class="btn" routerLink="/">الرئيسية</a></div>`,
})
export class ErrorPage {}
