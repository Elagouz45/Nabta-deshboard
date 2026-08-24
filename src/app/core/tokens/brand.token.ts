import { InjectionToken } from '@angular/core';
import { BRAND_CONFIG, BrandConfig } from '../config/brand.config';

export const BRAND = new InjectionToken<BrandConfig>('BRAND', {
  providedIn: 'root',
  factory: () => BRAND_CONFIG,
});
