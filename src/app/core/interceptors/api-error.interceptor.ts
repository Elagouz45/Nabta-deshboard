import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ApiError } from '@core/models';
import { UiStore } from '@state/ui/ui.store';

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const ui = inject(UiStore);
  return next(req).pipe(
    catchError((error: unknown) => {
      const mapped = mapError(error);
      if (mapped.status >= 500) {
        ui.toast(mapped.messageAr, 'error');
      }
      return throwError(() => mapped);
    }),
  );
};

function mapError(error: unknown): ApiError {
  if (isApiError(error)) {
    return error;
  }
  if (error instanceof HttpErrorResponse) {
    const body = error.error as Partial<ApiError> | undefined;
    return {
      status: error.status || 500,
      code: body?.code ?? 'http_error',
      messageAr: body?.messageAr ?? 'تعذر إكمال الطلب. حاول مرة أخرى.',
      messageEn: body?.messageEn ?? 'The request could not be completed.',
      fieldErrors: body?.fieldErrors,
    };
  }
  return {
    status: 500,
    code: 'unknown',
    messageAr: 'حدث خطأ غير متوقع.',
    messageEn: 'An unexpected error occurred.',
  };
}

function isApiError(value: unknown): value is ApiError {
  return !!value && typeof value === 'object' && 'code' in value && 'messageAr' in value && 'status' in value;
}
