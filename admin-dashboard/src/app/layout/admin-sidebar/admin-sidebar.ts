import { Component, DestroyRef, ElementRef, computed, effect, inject, input, output, signal, untracked, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideBoxes, LucideChevronDown, LucideFileText, LucideHouse, LucidePanelRightClose, LucidePanelRightOpen, LucidePackage, LucideSettings, LucideShoppingBag, LucideUsersRound, LucideX } from '@lucide/angular';
import { SidebarNavigationService } from './sidebar-navigation.service';

type ViewportMode = 'desktop' | 'tablet' | 'mobile';
const COLLAPSED_STORAGE_KEY = 'nabtah.admin.sidebar.collapsed';

@Component({
  selector: 'app-admin-sidebar',
  imports: [RouterLink, LucideBoxes, LucideChevronDown, LucideFileText, LucideHouse, LucidePanelRightClose, LucidePanelRightOpen, LucidePackage, LucideSettings, LucideShoppingBag, LucideUsersRound, LucideX],
  providers: [SidebarNavigationService],
  host: {
    '[class.is-collapsed]': 'effectiveCollapsed()',
    '[class.is-mobile-open]': 'mobileOpen() && viewportMode() === "mobile"',
  },
  template: `
    <aside #drawer id="admin-sidebar" class="sidebar" aria-label="التنقل الرئيسي" tabindex="-1" (keydown)="handleDrawerKeydown($event)">
      <header class="brand-area">
        <a routerLink="/overview" aria-label="الانتقال إلى نظرة عامة" (click)="requestClose()"><span class="brand-mark" aria-hidden="true">ن</span><span class="brand-copy"><strong>نبته</strong><small>لوحة الإدارة</small></span></a>
        <button class="close-button" type="button" aria-label="إغلاق القائمة" (click)="requestClose()"><svg lucideX></svg></button>
      </header>

      <nav aria-label="أقسام لوحة الإدارة">
        @for(group of navigation.authorizedGroups();track group.id){
          <section class="nav-group" [class.empty]="group.items.length === 0" [attr.data-active]="navigation.activeGroupId() === group.id ? 'true' : null">
            @if(group.items.length){
              <button class="group-toggle" type="button" [class.active-group]="navigation.activeGroupId() === group.id" [attr.aria-expanded]="isGroupOpen(group.id)" [attr.aria-controls]="'nav-group-' + group.id" (click)="toggleGroup(group.id)"><span>{{ group.label }}</span><svg lucideChevronDown [class.rotated]="isGroupOpen(group.id)"></svg></button>
              <div class="group-items" [class.open]="isGroupOpen(group.id)" [id]="'nav-group-' + group.id"><div>
                @for(item of group.items;track item.id){
                  <a class="nav-link" [routerLink]="item.route" [class.active]="navigation.isActive(item)" [attr.aria-current]="navigation.isActive(item) ? 'page' : null" [attr.aria-label]="item.label" [attr.data-tooltip]="item.label" (click)="requestClose()">
                    <span class="nav-icon" aria-hidden="true">@switch(item.icon){@case('home'){<svg lucideHouse></svg>}@case('orders'){<svg lucideShoppingBag></svg>}@case('customers'){<svg lucideUsersRound></svg>}@case('products'){<svg lucidePackage></svg>}@case('inventory'){<svg lucideBoxes></svg>}@case('content'){<svg lucideFileText></svg>}@case('settings'){<svg lucideSettings></svg>}}</span><span class="nav-label">{{ item.label }}</span>
                  </a>
                }
              </div></div>
            }@else{<h2>{{ group.label }}</h2>}
          </section>
        }
      </nav>

      <footer><button class="collapse-button" type="button" [attr.aria-label]="effectiveCollapsed() ? 'توسيع القائمة الجانبية' : 'طي القائمة الجانبية'" [attr.aria-pressed]="effectiveCollapsed()" (click)="toggleCollapsed()">@if(effectiveCollapsed()){<svg lucidePanelRightOpen></svg><span>توسيع القائمة</span>}@else{<svg lucidePanelRightClose></svg><span>طي القائمة</span>}</button></footer>
    </aside>
  `,
  styleUrl: './admin-sidebar.scss',
})
export class AdminSidebar {
  readonly navigation = inject(SidebarNavigationService);
  readonly mobileOpen = input(false);
  readonly closeRequested = output<void>();
  readonly viewportMode = signal<ViewportMode>(this.detectViewport());
  readonly collapsed = signal(this.readCollapsedPreference());
  readonly openGroupIds = signal<ReadonlySet<string>>(new Set());
  readonly effectiveCollapsed = computed(() => this.viewportMode() === 'tablet' || (this.viewportMode() === 'desktop' && this.collapsed()));
  private readonly drawer = viewChild<ElementRef<HTMLElement>>('drawer');

  constructor() {
    const destroyRef = inject(DestroyRef);
    if (typeof window !== 'undefined') {
      const updateViewport = () => this.viewportMode.set(this.detectViewport());
      window.addEventListener('resize', updateViewport, { passive: true });
      destroyRef.onDestroy(() => window.removeEventListener('resize', updateViewport));
    }
    effect((onCleanup) => {
      if (typeof document === 'undefined') return;
      const drawerOpen = this.mobileOpen() && this.viewportMode() === 'mobile';
      document.body.classList.toggle('sidebar-drawer-open', drawerOpen);
      if (drawerOpen) queueMicrotask(() => this.focusableElements()[0]?.focus());
      onCleanup(() => document.body.classList.remove('sidebar-drawer-open'));
    });
    effect(() => {
      const activeGroupId = this.navigation.activeGroupId();
      untracked(() => this.openGroupIds.set(activeGroupId ? new Set([activeGroupId]) : new Set()));
    });
  }

  toggleCollapsed(): void {
    if (this.viewportMode() !== 'desktop') return;
    this.collapsed.update((value) => !value);
    if (typeof localStorage !== 'undefined') localStorage.setItem(COLLAPSED_STORAGE_KEY, String(this.collapsed()));
  }

  isGroupOpen(groupId: string): boolean {
    return this.effectiveCollapsed() || this.openGroupIds().has(groupId);
  }

  toggleGroup(groupId: string): void {
    if (this.effectiveCollapsed()) return;
    this.openGroupIds.update((current) => nextOpenGroupIds(current, groupId));
  }

  requestClose(): void {
    if (this.viewportMode() === 'mobile') this.closeRequested.emit();
  }

  handleDrawerKeydown(event: KeyboardEvent): void {
    if (!this.mobileOpen() || this.viewportMode() !== 'mobile') return;
    if (event.key === 'Escape') { event.preventDefault(); this.closeRequested.emit(); return; }
    if (event.key !== 'Tab') return;
    const elements = this.focusableElements();
    if (!elements.length) return;
    const first = elements[0];
    const last = elements[elements.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  private focusableElements(): HTMLElement[] {
    return Array.from(this.drawer()?.nativeElement.querySelectorAll<HTMLElement>('a[href],button:not([disabled])') ?? []);
  }

  private detectViewport(): ViewportMode {
    if (typeof window === 'undefined') return 'desktop';
    if (window.innerWidth < 768) return 'mobile';
    return window.innerWidth < 1100 ? 'tablet' : 'desktop';
  }

  private readCollapsedPreference(): boolean {
    return typeof localStorage !== 'undefined' && localStorage.getItem(COLLAPSED_STORAGE_KEY) === 'true';
  }
}

export function nextOpenGroupIds(current: ReadonlySet<string>, groupId: string): ReadonlySet<string> {
  return current.has(groupId) ? new Set() : new Set([groupId]);
}
