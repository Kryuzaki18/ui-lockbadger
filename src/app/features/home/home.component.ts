import { AsyncPipe, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  LucideExternalLink,
  LucideFingerprint,
  LucideGauge,
  LucideKeyRound,
  LucideRepeat,
  LucideShieldAlert,
  LucideAlertTriangle,
} from '@lucide/angular';

import { selectAuthUser } from '../../store/auth/auth.selectors';
import { HeaderComponent } from '../commons/header/header.component';
import { SidebarComponent } from '../commons/sidebar/sidebar.component';
import { RECENT_VAULT_ITEMS, SECURITY_TIPS, VAULT_STATS } from '../../core/constants/data.constants';

@Component({
  selector: 'app-home',
  imports: [
    AsyncPipe,
    NgClass,
    HeaderComponent,
    SidebarComponent,
    LucideExternalLink,
    LucideFingerprint,
    LucideGauge,
    LucideKeyRound,
    LucideRepeat,
    LucideShieldAlert,
    LucideAlertTriangle,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private readonly store = inject(Store);

  readonly user$ = this.store.select(selectAuthUser);

  readonly vaultStats = VAULT_STATS;
  readonly recentItems = RECENT_VAULT_ITEMS;
  readonly securityTips = SECURITY_TIPS;

  sidebarOpen = false;

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  firstName(email: string | null | undefined): string {
    if (!email) return 'there';
    const local = email.split('@')[0];
    return local.charAt(0).toUpperCase() + local.slice(1);
  }
}
