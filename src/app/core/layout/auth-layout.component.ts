import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { BRAND } from '@core/tokens/brand.token';
import { AppImageComponent } from '@shared/ui/app-image.component';
import { BrandLogoComponent } from './brand-logo.component';
import { filter, map, startWith } from 'rxjs';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, RouterLink, AppImageComponent, BrandLogoComponent],
  template: `
    <div class="page-shell auth" [class.centered]="centered()">
      <div class="leaf leaf-a" aria-hidden="true"></div>
      <div class="leaf leaf-b" aria-hidden="true"></div>
      <header class="app-container head">
        <a routerLink="/" class="brand">
          <app-brand-logo />
        </a>
      </header>
      <main id="main" class="app-container split">
        <div class="form-col">
          <router-outlet />
        </div>
        <div class="visual">
          <app-image
            class="photo"
            src="/assets/images/hero/hero-desktop.webp"
            alt="حقل زراعي هادئ"
            [width]="1600"
            [height]="700"
            objectFit="cover"
            fallbackKind="crop"
            [fill]="true"
            [priority]="true"
          />
          <div class="copy">
            <p class="kicker">{{ brand.shortNameAr }}</p>
            <p class="tagline">{{ brand.taglineAr }}</p>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: `
    .auth {
      position: relative;
      isolation: isolate;
      min-height: 100dvh;
      overflow: hidden;
      background: linear-gradient(180deg, var(--color-pale), var(--color-sky-pale));
    }
    .leaf {
      display: none;
      position: absolute;
      z-index: 0;
      width: 220px;
      height: 220px;
      border-radius: 40% 60% 55% 45%;
      background: radial-gradient(circle at 30% 30%, rgb(63 143 90 / 0.22), transparent 64%);
      pointer-events: none;
    }
    .centered .leaf { display: block; }
    .leaf-a { top: -48px; inset-inline-end: -36px; transform: rotate(-18deg); }
    .leaf-b { bottom: -64px; inset-inline-start: -48px; transform: rotate(22deg); width: 280px; height: 280px; }
    .head {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      min-height: 72px;
    }
    .brand { display: inline-flex; }
    .split {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: minmax(280px, 440px) minmax(0, 1fr);
      gap: 32px;
      align-items: stretch;
      padding-bottom: 48px;
      min-height: calc(100dvh - 88px);
    }
    .form-col {
      display: flex;
      align-items: center;
      width: 100%;
      min-width: 0;
    }
    .visual {
      position: relative;
      overflow: hidden;
      border-radius: 24px;
      min-height: 420px;
      background: var(--color-forest);
    }
    .visual .photo {
      position: absolute;
      inset: 0;
    }
    .copy {
      position: relative;
      z-index: 1;
      min-height: 420px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      gap: 8px;
      padding: 28px;
      color: var(--color-white);
      background: linear-gradient(180deg, rgb(18 58 40 / 0.08), rgb(18 58 40 / 0.78));
    }
    .kicker {
      margin: 0;
      font-weight: 700;
      letter-spacing: 0.04em;
    }
    .tagline {
      margin: 0;
      max-width: 22rem;
      font-size: 1.15rem;
      line-height: 1.7;
    }
    .centered {
      background: linear-gradient(180deg, var(--color-mint), var(--color-pale) 42%, var(--color-pale));
    }
    .centered .split {
      grid-template-columns: minmax(0, 440px);
      justify-content: center;
      align-items: center;
      min-height: calc(100dvh - 88px);
    }
    .centered .form-col {
      justify-content: center;
    }
    .centered .visual { display: none; }
    @media (max-width: 900px) {
      .split { grid-template-columns: 1fr; min-height: 0; }
      .visual { display: none; }
      .form-col { align-items: start; width: 100%; }
      .centered .form-col { align-items: center; }
      .centered .split { min-height: calc(100dvh - 88px); padding-inline: 0; }
    }
    @media (max-width: 560px) {
      .head { min-height: 64px; }
      .split { gap: 16px; padding-bottom: 24px; }
    }
  `,
})
export class AuthLayoutComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly brand = inject(BRAND);
  readonly centered = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.isCentered()),
      startWith(this.isCentered()),
    ),
    { initialValue: this.isCentered() },
  );

  private isCentered(): boolean {
    if (this.route.firstChild?.snapshot?.data?.['centeredAuth'] === true) {
      return true;
    }
    const path = this.router.url.split('?')[0];
    return path === '/auth/login' || path === '/auth/register';
  }
}
