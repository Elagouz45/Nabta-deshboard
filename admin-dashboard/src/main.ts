import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeArEg from '@angular/common/locales/ar-EG';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { AuthStore } from './app/core/auth.store';
import { authInterceptor } from './app/core/auth.interceptor';
import { FeatureAvailability } from './app/core/feature-availability';

registerLocaleData(localeArEg);

bootstrapApplication(App, {
  providers: [{ provide: LOCALE_ID, useValue: 'ar-EG' }, AuthStore, FeatureAvailability, provideHttpClient(withInterceptors([authInterceptor])), provideRouter(routes, withComponentInputBinding())],
}).catch((error: unknown) => console.error(error));
