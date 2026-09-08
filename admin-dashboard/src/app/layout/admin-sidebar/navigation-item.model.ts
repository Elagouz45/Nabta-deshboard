import { AdminFeature } from '../../../environments/environment.model';

export type NavigationIcon = 'home' | 'orders' | 'customers' | 'products' | 'inventory' | 'content' | 'settings';
export type RouteMatch = 'exact' | 'prefix';

export interface NavigationItem {
  readonly id: string;
  readonly label: string;
  readonly route: string;
  readonly icon: NavigationIcon;
  readonly permission?: string;
  readonly feature?: AdminFeature;
  readonly match: RouteMatch;
  readonly adminOnly?: boolean;
  readonly demoOnly?: boolean;
}

export interface NavigationGroup {
  readonly id: string;
  readonly label: string;
  readonly items: readonly NavigationItem[];
  readonly keepWhenEmpty?: boolean;
}
