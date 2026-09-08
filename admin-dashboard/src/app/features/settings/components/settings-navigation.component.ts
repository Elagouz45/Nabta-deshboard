import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SETTINGS_SECTIONS } from '../config/settings-sections.config';

@Component({ selector: 'app-settings-navigation', imports: [RouterLink, RouterLinkActive], changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<nav class="settings-nav" aria-label="أقسام الإعدادات">@for (item of sections; track item.id) {<a [routerLink]="['/settings', item.id]" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">{{ item.label }}</a>}</nav>`,
  styles: [`.settings-nav{display:flex;gap:.35rem;overflow:auto;padding:.35rem;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);scrollbar-width:thin}a{flex:0 0 auto;min-height:2.45rem;padding:.55rem .85rem;border-radius:.6rem;color:var(--muted);font-size:.78rem;font-weight:600;white-space:nowrap}a:hover{background:var(--pale);color:var(--forest)}a.active{background:var(--mint);color:var(--forest);box-shadow:inset 0 -2px 0 var(--brand)}`],
})
export class SettingsNavigationComponent { readonly sections = SETTINGS_SECTIONS; }
