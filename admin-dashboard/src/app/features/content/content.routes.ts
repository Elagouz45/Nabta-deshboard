import { Routes } from '@angular/router';
import { adminGuard, featureAvailabilityGuard } from '../../core/auth.guards';

export const CONTENT_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'articles' },
  { path: 'articles', canActivate: [featureAvailabilityGuard('content'), adminGuard], children: [
    {
      path: '', pathMatch: 'full', title: 'المقالات الزراعية | نبته',
      loadComponent: () => import('./pages/articles-list-page/articles-list-page').then((m) => m.ArticlesListPage),
    },
    { path: 'new', title: 'إضافة مقال | نبته', loadComponent: () => import('./pages/article-editor-page/article-editor-page').then((m) => m.ArticleEditorPage) },
    { path: ':articleId/edit', title: 'تعديل المقال | نبته', loadComponent: () => import('./pages/article-editor-page/article-editor-page').then((m) => m.ArticleEditorPage) },
    { path: ':articleId/preview', title: 'معاينة المقال | نبته', loadComponent: () => import('./pages/article-details-page/article-details-page').then((m) => m.ArticleDetailsPage) },
    { path: ':articleId', title: 'تفاصيل المقال | نبته', loadComponent: () => import('./pages/article-details-page/article-details-page').then((m) => m.ArticleDetailsPage) },
  ] },
];
