import { Routes } from '@angular/router';

export const OVERVIEW_ROUTES: Routes = [
  { path: '', title: 'نظرة عامة | نبته', loadComponent: () => import('../../pages/overview.page').then((m) => m.OverviewPage) },
];
