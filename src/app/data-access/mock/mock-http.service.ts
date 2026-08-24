import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, delay, of, switchMap, throwError } from 'rxjs';
import { MOCK_LATENCY_MS } from '@core/constants/app.constants';
import { ApiError } from '@core/models';

@Injectable({ providedIn: 'root' })
export class MockHttp {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  ok<T>(data: T, latency = MOCK_LATENCY_MS): Observable<T> {
    return of(structuredClone(data)).pipe(delay(this.isBrowser ? latency : 0));
  }

  fail(error: Omit<ApiError, 'status'> & { status?: number }, latency = MOCK_LATENCY_MS): Observable<never> {
    const full: ApiError = {
      status: error.status ?? 400,
      code: error.code,
      messageAr: error.messageAr,
      messageEn: error.messageEn,
      fieldErrors: error.fieldErrors,
    };
    return of(null).pipe(
      delay(this.isBrowser ? latency : 0),
      switchMap(() => throwError(() => full)),
    );
  }
}

export function notFound(entityAr: string, entityEn: string): ApiError {
  return {
    status: 404,
    code: 'not_found',
    messageAr: `${entityAr} غير موجود.`,
    messageEn: `${entityEn} was not found.`,
  };
}
