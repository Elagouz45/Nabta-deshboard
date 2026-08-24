import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import {
  hasArabicLetters,
  isEgyptianMobile,
  isEmail,
  isSlug,
  normalizeEgyptianMobile,
  passwordStrength,
} from '@core/utils/validation.util';

export function egyptianMobileValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '').trim();
    if (!value) {
      return null;
    }
    return isEgyptianMobile(normalizeEgyptianMobile(value)) ? null : { egyptianMobile: true };
  };
}

export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '').trim();
    if (!value) {
      return null;
    }
    return isEmail(value) ? null : { email: true };
  };
}

export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '');
    if (!value) {
      return null;
    }
    return passwordStrength(value) ? null : { passwordStrength: true };
  };
}

export function matchControlValidator(otherName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const parent = control.parent;
    if (!parent) {
      return null;
    }
    const other = parent.get(otherName);
    if (!other) {
      return null;
    }
    return control.value === other.value ? null : { mismatch: true };
  };
}

export function positiveQuantityValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = Number(control.value);
    return Number.isInteger(value) && value >= 1 ? null : { positiveQuantity: true };
  };
}

export function salePriceValidator(regularName = 'regularPrice'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const parent = control.parent;
    if (!parent || control.value === null || control.value === '') {
      return null;
    }
    const regular = Number(parent.get(regularName)?.value);
    const sale = Number(control.value);
    return sale < regular ? null : { salePrice: true };
  };
}

export function arabicNameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '').trim();
    if (!value) {
      return null;
    }
    return hasArabicLetters(value) ? null : { arabicName: true };
  };
}

export function slugValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '').trim();
    if (!value) {
      return null;
    }
    return isSlug(value) ? null : { slug: true };
  };
}

export function stockValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = Number(control.value);
    return Number.isInteger(value) && value >= 0 ? null : { stock: true };
  };
}

export const VALIDATION_MESSAGES: Record<string, string> = {
  required: 'هذا الحقل مطلوب.',
  egyptianMobile: 'أدخل رقم هاتف مصري صحيح يبدأ بـ 01 ويتكون من 11 رقمًا.',
  email: 'أدخل بريدًا إلكترونيًا صحيحًا.',
  passwordStrength: 'كلمة المرور 8 أحرف على الأقل وتتضمن حرفًا كبيرًا وصغيرًا ورقمًا.',
  mismatch: 'القيمتان غير متطابقتين.',
  positiveQuantity: 'الكمية يجب أن تكون رقمًا صحيحًا أكبر من صفر.',
  salePrice: 'سعر العرض يجب أن يكون أقل من السعر الأساسي.',
  arabicName: 'أدخل اسمًا عربيًا واضحًا.',
  slug: 'المسار يجب أن يكون حروفًا إنجليزية صغيرة وأرقامًا وشرطات فقط.',
  stock: 'المخزون يجب أن يكون صفرًا أو أكثر.',
  minlength: 'القيمة أقصر من الحد الأدنى.',
  maxlength: 'القيمة أطول من الحد الأقصى.',
  min: 'القيمة أقل من الحد الأدنى.',
  max: 'القيمة أعلى من الحد الأقصى.',
};
