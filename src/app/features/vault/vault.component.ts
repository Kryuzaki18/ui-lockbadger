import { AsyncPipe, NgClass } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, map, Observable, Subject, takeUntil } from 'rxjs';
import {
  LucideCopy,
  LucideCopyCheck,
  LucideEye,
  LucideEyeOff,
  LucideKeyRound,
  LucideListFilter,
  LucidePencil,
  LucidePlus,
  LucideSearch,
  LucideStar,
  LucideTrash2,
} from '@lucide/angular';
import { NzAvatarComponent } from 'ng-zorro-antd/avatar';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzDropdownMenuComponent, NzDropdownDirective } from 'ng-zorro-antd/dropdown';
import { NzEmptyComponent } from 'ng-zorro-antd/empty';
import { NzInputDirective, NzInputPrefixDirective, NzInputWrapperComponent } from 'ng-zorro-antd/input';
import { NzMenuDirective, NzMenuItemComponent } from 'ng-zorro-antd/menu';
import { NzProgressComponent } from 'ng-zorro-antd/progress';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { NzTagComponent } from 'ng-zorro-antd/tag';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';

import { HeaderComponent } from '../commons/header/header.component';
import { SidebarComponent } from '../commons/sidebar/sidebar.component';
import { AddEntryDialogComponent } from './add-entry-dialog/add-entry-dialog.component';
import { VAULT_CATEGORIES, VaultCategory, VaultEntry, VaultPasswordStrength } from '../../core/types/vault.model';
import { computePasswordStrength, formatRelativeTime } from '../../core/utils/vault.util';
import * as VaultActions from '../../store/vault/vault.actions';
import { selectVaultEntries, selectVaultLoading } from '../../store/vault/vault.selectors';

const STRENGTH_META: Record<VaultPasswordStrength, { label: string; percent: number; strokeColor: string }> = {
  weak: { label: 'Weak', percent: 33, strokeColor: '#ef4444' },
  fair: { label: 'Fair', percent: 66, strokeColor: '#f59e0b' },
  strong: { label: 'Strong', percent: 100, strokeColor: '#10b981' },
};

@Component({
  selector: 'app-vault',
  imports: [
    AsyncPipe,
    FormsModule,
    NgClass,
    HeaderComponent,
    SidebarComponent,
    AddEntryDialogComponent,
    NzAvatarComponent,
    NzButtonComponent,
    NzDropdownDirective,
    NzDropdownMenuComponent,
    NzEmptyComponent,
    NzInputDirective,
    NzInputPrefixDirective,
    NzInputWrapperComponent,
    NzMenuDirective,
    NzMenuItemComponent,
    NzProgressComponent,
    NzSpinComponent,
    NzTagComponent,
    NzTooltipDirective,
    LucideCopy,
    LucideCopyCheck,
    LucideEye,
    LucideEyeOff,
    LucideKeyRound,
    LucideListFilter,
    LucidePencil,
    LucidePlus,
    LucideSearch,
    LucideStar,
    LucideTrash2,
  ],
  templateUrl: './vault.component.html'
})
export class VaultComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly destroy$ = new Subject<void>();

  readonly categories = VAULT_CATEGORIES;

  readonly entries$ = this.store.select(selectVaultEntries);
  readonly isLoading$ = this.store.select(selectVaultLoading);

  private readonly searchTerm$ = new BehaviorSubject<string>('');
  private readonly activeCategory$ = new BehaviorSubject<VaultCategory | 'All'>('All');

  readonly filteredEntries$: Observable<VaultEntry[]> = combineLatest([
    this.entries$,
    this.searchTerm$,
    this.activeCategory$,
  ]).pipe(
    map(([entries, term, category]) => {
      const normalizedTerm = term.trim().toLowerCase();

      return entries.filter((entry) => {
        const matchesCategory = category === 'All' || entry.category === category;
        const matchesTerm =
          !normalizedTerm ||
          entry.title.toLowerCase().includes(normalizedTerm) ||
          entry.username.toLowerCase().includes(normalizedTerm) ||
          (entry.url ?? '').toLowerCase().includes(normalizedTerm);

        return matchesCategory && matchesTerm;
      });
    }),
  );

  sidebarOpen = false;
  isAddModalOpen = false;

  private readonly favoriteIds = new Set<string>();
  private readonly visiblePasswordIds = new Set<string>();
  private copiedKey: string | null = null;

  get searchTerm(): string {
    return this.searchTerm$.value;
  }

  set searchTerm(value: string) {
    this.searchTerm$.next(value);
  }

  get activeCategory(): VaultCategory | 'All' {
    return this.activeCategory$.value;
  }

  ngOnInit(): void {
    this.store.dispatch(VaultActions.loadVaultEntries());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  openAddModal(): void {
    this.isAddModalOpen = true;
  }

  closeAddModal(): void {
    this.isAddModalOpen = false;
  }

  selectCategory(category: VaultCategory | 'All'): void {
    this.activeCategory$.next(category);
  }

  toggleFavorite(entry: VaultEntry, event: Event): void {
    event.stopPropagation();
    if (this.favoriteIds.has(entry.id)) {
      this.favoriteIds.delete(entry.id);
    } else {
      this.favoriteIds.add(entry.id);
    }
  }

  isFavorite(entry: VaultEntry): boolean {
    return this.favoriteIds.has(entry.id);
  }

  isPasswordVisible(entry: VaultEntry): boolean {
    return this.visiblePasswordIds.has(entry.id);
  }

  togglePasswordVisibility(entry: VaultEntry): void {
    if (this.visiblePasswordIds.has(entry.id)) {
      this.visiblePasswordIds.delete(entry.id);
    } else {
      this.visiblePasswordIds.add(entry.id);
    }
  }

  strengthMeta(entry: VaultEntry) {
    return STRENGTH_META[computePasswordStrength(entry.password)];
  }

  relativeUpdatedAt(entry: VaultEntry): string {
    return formatRelativeTime(entry.updatedAt);
  }

  isCopied(entry: VaultEntry, field: 'username' | 'password'): boolean {
    return this.copiedKey === `${entry.id}:${field}`;
  }

  async copyToClipboard(entry: VaultEntry, field: 'username' | 'password'): Promise<void> {
    const value = field === 'username' ? entry.username : entry.password;

    try {
      await navigator.clipboard.writeText(value);
      this.copiedKey = `${entry.id}:${field}`;
      setTimeout(() => {
        if (this.copiedKey === `${entry.id}:${field}`) {
          this.copiedKey = null;
        }
      }, 1500);
    } catch {
      this.copiedKey = null;
    }
  }

  initials(title: string): string {
    return title.charAt(0).toUpperCase();
  }
}
