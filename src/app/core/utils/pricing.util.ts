import { Coupon, PriceBreakdown, Product } from '@core/models';

export function unitPrice(product: Product): number {
  if (product.salePrice != null && product.salePrice < product.regularPrice) {
    return product.salePrice;
  }
  return product.regularPrice;
}

export function discountPercent(product: Product): number | null {
  if (product.salePrice == null || product.salePrice >= product.regularPrice) {
    return null;
  }
  return Math.round((1 - product.salePrice / product.regularPrice) * 100);
}

export function lineTotals(product: Product, quantity: number): {
  lineSubtotal: number;
  lineDiscount: number;
  lineTotal: number;
} {
  const qty = Math.max(0, quantity);
  const lineSubtotal = roundMoney(product.regularPrice * qty);
  const lineTotal = roundMoney(unitPrice(product) * qty);
  return {
    lineSubtotal,
    lineDiscount: roundMoney(lineSubtotal - lineTotal),
    lineTotal,
  };
}

export function couponDiscountAmount(subtotalAfterSale: number, coupon: Coupon | null): number {
  if (!coupon || !coupon.active) {
    return 0;
  }
  if (Date.parse(coupon.expiresAt) < Date.now()) {
    return 0;
  }
  if (subtotalAfterSale < coupon.minSubtotal) {
    return 0;
  }
  if (coupon.type === 'percent') {
    return roundMoney((subtotalAfterSale * coupon.value) / 100);
  }
  return roundMoney(Math.min(coupon.value, subtotalAfterSale));
}

export function computePriceBreakdown(input: {
  itemsSubtotal: number;
  saleDiscount: number;
  coupon: Coupon | null;
  shipping: number;
  taxRate?: number;
}): PriceBreakdown {
  const afterSale = roundMoney(input.itemsSubtotal - input.saleDiscount);
  const couponDiscount = couponDiscountAmount(afterSale, input.coupon);
  const taxable = roundMoney(afterSale - couponDiscount + input.shipping);
  const tax = roundMoney(taxable * (input.taxRate ?? 0));
  return {
    itemsSubtotal: roundMoney(input.itemsSubtotal),
    saleDiscount: roundMoney(input.saleDiscount),
    couponDiscount,
    shipping: roundMoney(input.shipping),
    tax,
    total: roundMoney(taxable + tax),
  };
}

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}
