import { filterProductList, queryProducts } from './product-query.util';
import { Product } from '@core/models';

function p(id: string, extra: Partial<Product> = {}): Product {
  return {
    id,
    slug: id,
    sku: id,
    nameAr: `منتج ${id}`,
    nameEn: `Product ${id}`,
    shortDescriptionAr: 'وصف',
    shortDescriptionEn: 'desc',
    descriptionAr: '',
    descriptionEn: '',
    categoryId: 'cat-a',
    subcategoryId: 'sub',
    brandId: 'br',
    companyId: 'co',
    images: [],
    thumbnail: '',
    imageAltAr: '',
    imageAltEn: '',
    regularPrice: 100,
    salePrice: extra.salePrice ?? null,
    currency: 'EGP',
    stockQuantity: 5,
    stockStatus: 'in_stock',
    unit: 'ml',
    size: '',
    weight: '',
    formulation: 'EC',
    activeIngredients: [{ nameAr: 'مادة', nameEn: 'ActiveX', concentration: '5%' }],
    composition: '',
    countryOfOrigin: 'مصر',
    targetCropIds: ['crop-tomato'],
    targetProblemIds: ['pr-aphid'],
    benefits: [],
    usageInstructions: { ar: '', en: '' },
    dosage: { ar: '', en: '' },
    safetyInstructions: { ar: '', en: '' },
    preHarvestInterval: { ar: '', en: '' },
    rating: 4.5,
    reviewsCount: 2,
    salesCount: extra.salesCount ?? 10,
    isFeatured: false,
    isNew: false,
    isBestSeller: false,
    isOnSale: extra.salePrice != null,
    isActive: extra.isActive ?? true,
    tags: ['من'],
    seoTitleAr: '',
    seoTitleEn: '',
    seoDescriptionAr: '',
    seoDescriptionEn: '',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...extra,
  };
}

describe('product-query.util', () => {
  const catalog = [
    p('a', { regularPrice: 80, salesCount: 3 }),
    p('b', { regularPrice: 140, salePrice: 90, nameAr: 'مبيد خاص', nameEn: 'Special' }),
    p('c', { isActive: false }),
  ];

  it('hides inactive products and matches search', () => {
    const rows = filterProductList(catalog, { q: 'special' });
    expect(rows.map((x) => x.id)).toEqual(['b']);
  });

  it('filters by crop and paginates', () => {
    const page = queryProducts(catalog, { cropId: 'crop-tomato', page: 1, pageSize: 1, sort: 'price_asc' });
    expect(page.total).toBe(2);
    expect(page.items[0].id).toBe('a');
  });

  it('filters by minimum discount and sorts by saving', () => {
    const rows = filterProductList(catalog, { minDiscount: 20 });
    expect(rows.map((x) => x.id)).toEqual(['b']);
    const page = queryProducts(catalog, { sort: 'best_saving' });
    expect(page.items[0].id).toBe('b');
  });
});
