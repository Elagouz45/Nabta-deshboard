import { describe, expect, it } from 'vitest';
import { stockStatusForQuantity } from './demo-data';

describe('stockStatusForQuantity', () => {
  it('keeps the development demo threshold in one tested function', () => {
    expect(stockStatusForQuantity(0)).toBe('out_of_stock');
    expect(stockStatusForQuantity(8)).toBe('low_stock');
    expect(stockStatusForQuantity(9)).toBe('in_stock');
  });
});
