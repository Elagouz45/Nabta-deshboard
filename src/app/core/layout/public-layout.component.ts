import { Component, HostListener, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { BRAND } from '@core/tokens/brand.token';
import { AuthStore } from '@state/auth/auth.store';
import { CartStore } from '@state/cart/cart.store';
import { WishlistStore } from '@state/wishlist/wishlist.store';
import { ComparisonStore } from '@state/comparison/comparison.store';
import { UiStore } from '@state/ui/ui.store';
import { TranslatePipe } from '@shared/pipes/namaa.pipes';
import { SearchBarComponent } from '@shared/ui/search-bar.component';
import { STORAGE_KEYS } from '@core/constants/storage-keys';
import { StorageService } from '@core/services/storage.service';
import { SeoService } from '@core/services/seo.service';
import { A11yModule } from '@angular/cdk/a11y';
import { AccountMenuComponent } from './account-menu.component';
import { BrandLogoComponent } from './brand-logo.component';
import {
  LucideSearch,
  LucideShoppingCart,
  LucideHeart,
  LucideGitCompare,
  LucideMenu,
  LucideX,
  LucideHome,
  LucideStore,
  LucideSparkles,
  LucideChevronUp,
  LucideMapPin,
  LucidePhone,
  LucideClock,
} from '@lucide/angular';

@Component({
  selector: 'app-public-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
    SearchBarComponent,
    AccountMenuComponent,
    BrandLogoComponent,
    A11yModule,
    LucideSearch,
    LucideShoppingCart,
    LucideHeart,
    LucideGitCompare,
    LucideMenu,
    LucideX,
    LucideHome,
    LucideStore,
    LucideSparkles,
    LucideChevronUp,
    LucideMapPin,
    LucidePhone,
    LucideClock,
  ],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss',
})
export class PublicLayoutComponent {
  readonly brand = inject(BRAND);
  readonly auth = inject(AuthStore);
  readonly cart = inject(CartStore);
  readonly wishlist = inject(WishlistStore);
  readonly compare = inject(ComparisonStore);
  readonly ui = inject(UiStore);
  private readonly router = inject(Router);
  private readonly storage = inject(StorageService);
  private readonly seo = inject(SeoService);

  query = '';
  cookieDecision = this.storage.get<'all' | 'essentials'>(STORAGE_KEYS.cookieConsent);
  showTop = false;

  constructor() {
    this.seo.organizationJsonLd();
  }

  search(): void {
    this.onSearched(this.query);
  }

  onSearched(q: string): void {
    const term = q.trim();
    if (!term) {
      return;
    }
    this.query = term;
    this.ui.searchOpen.set(false);
    this.ui.mobileNavOpen.set(false);
    void this.router.navigate(['/search'], { queryParams: { q: term } });
  }

  openNav(): void {
    this.ui.mobileNavOpen.set(true);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.ui.closeOverlays();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const y = typeof window !== 'undefined' ? window.scrollY : 0;
    this.showTop = y > 400;
    this.ui.headerScrolled.set(y > 8);
  }

  acceptCookies(mode: 'all' | 'essentials'): void {
    this.storage.set(STORAGE_KEYS.cookieConsent, mode);
    this.cookieDecision = mode;
  }

  whatsappHref(): string {
    return `https://wa.me/${this.brand.whatsappNumber}`;
  }

  toTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
