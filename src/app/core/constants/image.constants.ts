export type ImageKind = 'product' | 'crop' | 'article' | 'company' | 'avatar' | 'category' | 'problem';

export const IMAGE_DIR = '/assets/images' as const;

export const IMAGE_FALLBACKS: Record<ImageKind, string> = {
  product: `${IMAGE_DIR}/placeholders/product-fallback.svg`,
  crop: `${IMAGE_DIR}/placeholders/crop-fallback.svg`,
  article: `${IMAGE_DIR}/placeholders/article-fallback.svg`,
  company: `${IMAGE_DIR}/placeholders/company-fallback.svg`,
  avatar: `${IMAGE_DIR}/placeholders/avatar-fallback.svg`,
  category: `${IMAGE_DIR}/placeholders/crop-fallback.svg`,
  problem: `${IMAGE_DIR}/placeholders/problem-fallback.svg`,
};

export const IMAGE_SIZES = {
  heroDesktop: { width: 1600, height: 700 },
  heroMobile: { width: 800, height: 1000 },
  product: { width: 800, height: 800 },
  category: { width: 800, height: 600 },
  crop: { width: 800, height: 600 },
  article: { width: 1200, height: 630 },
  problem: { width: 800, height: 600 },
  logo: { width: 240, height: 160 },
  avatar: { width: 160, height: 160 },
} as const;

export function isRasterSrc(src: string): boolean {
  return /\.(webp|avif|jpe?g|png)(\?|$)/i.test(src);
}
