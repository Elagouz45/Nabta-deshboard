const ARABIC_MOBILE = /^01[0125][0-9]{8}$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EASTERN_ARABIC_DIGITS = /[\u0660-\u0669]/g;
const PERSIAN_DIGITS = /[\u06F0-\u06F9]/g;

export function toWesternDigits(value: string): string {
  return value
    .replace(EASTERN_ARABIC_DIGITS, (digit) => String(digit.charCodeAt(0) - 0x0660))
    .replace(PERSIAN_DIGITS, (digit) => String(digit.charCodeAt(0) - 0x06f0));
}

export function normalizeEgyptianMobile(value: string): string {
  return toWesternDigits(value).replace(/\s+/g, '');
}

export function isEgyptianMobile(value: string): boolean {
  return ARABIC_MOBILE.test(normalizeEgyptianMobile(value));
}

export function isEmail(value: string): boolean {
  return EMAIL.test(value.trim());
}

export function passwordStrength(value: string): boolean {
  return value.length >= 8 && /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value);
}

export function isSlug(value: string): boolean {
  return SLUG.test(value);
}

export function hasArabicLetters(value: string): boolean {
  return /[\u0600-\u06FF]/.test(value);
}
