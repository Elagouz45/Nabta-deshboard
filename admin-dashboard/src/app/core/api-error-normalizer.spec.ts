import { HttpErrorResponse } from '@angular/common/http';
import { describe, expect, it } from 'vitest';
import { normalizeApiError } from './api-error-normalizer';

describe('normalizeApiError', () => {
  it('maps Laravel validation errors without losing field messages', () => {
    const result = normalizeApiError(new HttpErrorResponse({
      status: 422,
      error: { message: 'The given data was invalid.', errors: { mobile: ['رقم الهاتف غير صالح.'] } },
    }));

    expect(result.status).toBe(422);
    expect(result.fieldErrors['mobile']).toEqual(['رقم الهاتف غير صالح.']);
  });

  it('provides an Arabic message for a conflict response', () => {
    const result = normalizeApiError(new HttpErrorResponse({ status: 409 }));
    expect(result.message).toContain('تغيرت البيانات');
  });

  it('does not expose unknown thrown values', () => {
    expect(normalizeApiError('raw failure').message).toBe('حدث خطأ غير متوقع.');
  });
});
