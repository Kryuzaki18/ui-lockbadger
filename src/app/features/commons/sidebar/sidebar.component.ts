import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  LucideGauge,
  LucideKeyRound,
  LucideLayoutDashboard,
  LucideLogOut,
  LucideSettings,
  LucideWand2,
  LucideX,
} from '@lucide/angular';
import { NzAvatarComponent } from 'ng-zorro-antd/avatar';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzMenuDirective, NzMenuItemComponent } from 'ng-zorro-antd/menu';
import { NzTagComponent } from 'ng-zorro-antd/tag';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';

import * as AuthActions from '../../../store/auth/auth.actions';
import { selectAuthUser } from '../../../store/auth/auth.selectors';

interface NavItem {
  label: string;
  icon: 'dashboard' | 'vault' | 'generator' | 'reports' | 'settings';
  route: string | null;
}

@Component({
  selector: 'app-sidebar',
  imports: [
    AsyncPipe,
    LucideGauge,
    LucideKeyRound,
    LucideLayoutDashboard,
    LucideLogOut,
    LucideSettings,
    LucideWand2,
    LucideX,
    NzAvatarComponent,
    NzButtonComponent,
    NzMenuDirective,
    NzMenuItemComponent,
    NzTagComponent,
    NzTooltipDirective,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  private readonly store = inject(Store);

  @Input() open = false;
  @Output() closeSidebar = new EventEmitter<void>();

  readonly user$ = this.store.select(selectAuthUser);

  readonly navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/home' },
    { label: 'Vault', icon: 'vault', route: '/vault' },
    { label: 'Generator', icon: 'generator', route: null },
    { label: 'Reports', icon: 'reports', route: null },
    { label: 'Settings', icon: 'settings', route: null },
  ];

  onLogout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  getInitials(email: string | null | undefined): string {
    if (!email) {
      return '?';
    }

    const localPart = email.split('@')[0];
    const segments = localPart.split(/[._-]+/).filter(Boolean);

    if (segments.length >= 2) {
      return (segments[0][0] + segments[1][0]).toUpperCase();
    }

    return localPart.slice(0, 2).toUpperCase() || '?';
  }
}
