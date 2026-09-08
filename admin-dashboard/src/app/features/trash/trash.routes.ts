import { Routes } from '@angular/router';
export const TRASH_ROUTES: Routes = [{ path: '', title: 'سلة المهملات | نبته', loadComponent: () => import('./trash-page').then((m) => m.TrashPage) }];

