import { HttpErrorResponse } from '@angular/common/http';

export interface NormalizedApiError {
  readonly status: number;
  readonly message: string;
  readonly fieldErrors: Readonly<Record<string, readonly string[]>>;
}

interface LaravelErrorBody {
  message?: string;
  messageAr?: string;
  errors?: Record<string, string[]>;
}

export function normalizeApiError(error: unknown): NormalizedApiError {
  if (!(error instanceof HttpErrorResponse)) {
    return { status: -1, message: 'حدث خطأ غير متوقع.', fieldErrors: {} };
  }

  const body = isLaravelErrorBody(error.error) ? error.error : null;
  const fallback = error.status === 0
    ? 'تعذر الاتصال بالخادم. تحقق من الشبكة ثم حاول مرة أخرى.'
    : error.status === 401
      ? 'انتهت الجلسة أو بيانات الدخول غير صحيحة.'
      : error.status === 403
        ? 'ليس لديك صلاحية لتنفيذ هذا الإجراء.'
        : error.status === 409
          ? 'تغيرت البيانات على الخادم. حدّث الصفحة وحاول مرة أخرى.'
          : 'تعذر إتمام الطلب. حاول مرة أخرى.';

  return {
    status: error.status,
    message: body?.messageAr ?? body?.message ?? fallback,
    fieldErrors: body?.errors ?? {},
  };
}

function isLaravelErrorBody(value: unknown): value is LaravelErrorBody {
  return typeof value === 'object' && value !== null;
}
