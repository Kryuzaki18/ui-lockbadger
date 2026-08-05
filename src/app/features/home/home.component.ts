import { AsyncPipe, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import {
  LucideExternalLink,
  LucideFingerprint,
  LucideGauge,
  LucideKeyRound,
  LucideRepeat,
  LucideShieldAlert,
  LucideAlertTriangle,
} from '@lucide/angular';

import { HeaderComponent } from '../commons/header/header.component';
import { SidebarComponent } from '../commons/sidebar/sidebar.component';

import { selectAuthUser } from '../../store/auth/auth.selectors';
import * as VaultActions from '../../store/vault/vault.actions';
import { selectVaultEntries } from '../../store/vault/vault.selectors';

import { SecurityTip, VaultEntry, VaultStat } from '../../core/types/vault.model';
import {
  computeRecentItems,
  computeSecurityTips,
  computeVaultStats,
  formatRelativeTime,
} from '../../core/utils/vault.util';

interface DashboardViewModel {
  stats: VaultStat[];
  recentItems: VaultEntry[];
  totalCount: number;
  tips: SecurityTip[];
}

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
export class HomeComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  readonly user$ = this.store.select(selectAuthUser);

  readonly vm$: Observable<DashboardViewModel> = this.store.select(selectVaultEntries).pipe(
    map((entries) => ({
      stats: computeVaultStats(entries),
      recentItems: computeRecentItems(entries),
      totalCount: entries.length,
      tips: computeSecurityTips(entries),
    })),
  );

  sidebarOpen = false;

  ngOnInit(): void {
    this.store.dispatch(VaultActions.loadVaultEntries());
  }

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

  relativeUpdatedAt(updatedAt: string): string {
    return formatRelativeTime(updatedAt);
  }

  openInVault(item: VaultEntry): void {
    this.router.navigate(['/vault'], { queryParams: { search: item.title } });
  }
}
