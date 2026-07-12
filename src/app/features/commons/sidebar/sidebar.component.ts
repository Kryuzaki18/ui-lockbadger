import { AsyncPipe, NgClass } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
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

import * as AuthActions from '../../../store/auth/auth.actions';
import { selectAuthUser } from '../../../store/auth/auth.selectors';

interface NavItem {
  label: string;
  icon: 'dashboard' | 'vault' | 'generator' | 'reports' | 'settings';
  active: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [
    AsyncPipe,
    NgClass,
    LucideGauge,
    LucideKeyRound,
    LucideLayoutDashboard,
    LucideLogOut,
    LucideSettings,
    LucideWand2,
    LucideX,
  ],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  private readonly store = inject(Store);

  @Input() open = false;
  @Output() closeSidebar = new EventEmitter<void>();

  readonly user$ = this.store.select(selectAuthUser);

  readonly navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', active: true },
    { label: 'Vault', icon: 'vault', active: false },
    { label: 'Generator', icon: 'generator', active: false },
    { label: 'Reports', icon: 'reports', active: false },
    { label: 'Settings', icon: 'settings', active: false },
  ];

  onLogout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
