import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { BRAND_CONFIG } from '@core/config/brand.config';
import { environment } from '@env/environment';
import { LocaleService } from '@core/i18n/locale.service';
import { BreadcrumbItem, Product, Article } from '@core/models';
import { unitPrice, discountPercent } from '@core/utils/pricing.util';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly locale = inject(LocaleService);

  set(input: {
    title: string;
    description: string;
    path: string;
    image?: string;
    type?: 'website' | 'article' | 'product';
    noindex?: boolean;
  }): void {
    const fullTitle = `${input.title} | ${this.locale.text(BRAND_CONFIG.shortNameAr, BRAND_CONFIG.shortNameEn)}`;
    const url = `${environment.siteUrl}${input.path}`;
    const image = `${environment.siteUrl}${input.image ?? BRAND_CONFIG.logoPath}`;
    this.title.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: input.description });
    this.meta.updateTag({ name: 'robots', content: input.noindex ? 'noindex,nofollow' : 'index,follow' });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: input.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:type', content: input.type ?? 'website' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: input.description });
    this.setCanonical(url);
  }

  setJsonLd(id: string, data: Record<string, unknown>): void {
    const existing = this.document.getElementById(id);
    existing?.remove();
    const script = this.document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    this.document.head.appendChild(script);
  }

  productJsonLd(product: Product, path: string): void {
    this.setJsonLd('jsonld-product', {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: this.locale.text(product.nameAr, product.nameEn),
      description: this.locale.text(product.shortDescriptionAr, product.shortDescriptionEn),
      sku: product.sku,
      image: product.images.map((i) => `${environment.siteUrl}${i.url}`),
      brand: { '@type': 'Brand', name: product.brandId },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'EGP',
        price: unitPrice(product),
        availability:
          product.stockStatus === 'out_of_stock'
            ? 'https://schema.org/OutOfStock'
            : 'https://schema.org/InStock',
        url: `${environment.siteUrl}${path}`,
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewsCount,
      },
    });
    void discountPercent(product);
  }

  articleJsonLd(article: Article, path: string): void {
    this.setJsonLd('jsonld-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: this.locale.text(article.titleAr, article.titleEn),
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      image: `${environment.siteUrl}${article.socialImage || article.coverImage}`,
      mainEntityOfPage: `${environment.siteUrl}${path}`,
    });
  }

  breadcrumbsJsonLd(items: BreadcrumbItem[]): void {
    this.setJsonLd('jsonld-breadcrumb', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: this.locale.text(item.labelAr, item.labelEn),
        item: item.url ? `${environment.siteUrl}${item.url}` : undefined,
      })),
    });
  }

  organizationJsonLd(): void {
    this.setJsonLd('jsonld-org', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: this.locale.text(BRAND_CONFIG.nameAr, BRAND_CONFIG.nameEn),
      url: environment.siteUrl,
      logo: `${environment.siteUrl}${BRAND_CONFIG.logoPath}`,
      telephone: BRAND_CONFIG.customerServicePhone,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'EG',
        streetAddress: this.locale.text(BRAND_CONFIG.addressAr, BRAND_CONFIG.addressEn),
      },
    });
    this.setJsonLd('jsonld-website', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: this.locale.text(BRAND_CONFIG.shortNameAr, BRAND_CONFIG.shortNameEn),
      url: environment.siteUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${environment.siteUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    });
  }

  private setCanonical(url: string): void {
    let link = this.document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
