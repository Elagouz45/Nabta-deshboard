export type AppLocale = 'ar' | 'en';

export interface BrandSocialLinks {
  facebook: string;
  instagram: string;
  youtube: string;
  linkedin: string;
}

export interface BrandConfig {
  nameAr: string;
  nameEn: string;
  shortNameAr: string;
  shortNameEn: string;
  taglineAr: string;
  taglineEn: string;
  logoPath: string;
  logoMarkPath: string;
  faviconPath: string;
  currencyCode: string;
  currencySymbolAr: string;
  currencySymbolEn: string;
  defaultLocale: AppLocale;
  defaultLocaleTag: string;
  defaultDirection: 'rtl' | 'ltr';
  customerServicePhone: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  email: string;
  addressAr: string;
  addressEn: string;
  workingHoursAr: string;
  workingHoursEn: string;
  taxNumberPlaceholder: string;
  social: BrandSocialLinks;
}

export const BRAND_CONFIG: BrandConfig = {
  nameAr: 'نبته للمنتجات والحلول الزراعية',
  nameEn: 'Nabtah Agricultural Solutions',
  shortNameAr: 'نبته',
  shortNameEn: 'Nabtah',
  taglineAr: 'كل ما يحتاجه محصولك… من التشخيص إلى المنتج المناسب',
  taglineEn: 'Everything your crop needs — from diagnosis to the right product',
  logoPath: '/assets/images/brand/logo.png',
  logoMarkPath: '/assets/images/brand/mark.png',
  faviconPath: '/assets/images/brand/mark.png',
  currencyCode: 'EGP',
  currencySymbolAr: 'ج.م',
  currencySymbolEn: 'EGP',
  defaultLocale: 'ar',
  defaultLocaleTag: 'ar-EG',
  defaultDirection: 'rtl',
  customerServicePhone: '01000000900',
  whatsappNumber: '201000000900',
  whatsappDisplay: '01000000900',
  email: 'hello@nabtah.example',
  addressAr: 'القطامية، القاهرة الجديدة، محافظة القاهرة، مصر',
  addressEn: 'Katameya, New Cairo, Cairo Governorate, Egypt',
  workingHoursAr: 'السبت–الخميس، 9 صباحًا – 6 مساءً',
  workingHoursEn: 'Saturday–Thursday, 9:00 AM – 6:00 PM',
  taxNumberPlaceholder: 'XXX-XXX-XXX (رقم ضريبي تجريبي)',
  social: {
    facebook: 'https://www.facebook.com/',
    instagram: 'https://www.instagram.com/',
    youtube: 'https://www.youtube.com/',
    linkedin: 'https://www.linkedin.com/',
  },
};
