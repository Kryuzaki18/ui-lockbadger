import { AsyncPipe, NgClass } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';

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
  LucideX,
} from '@lucide/angular';

import { NzAvatarComponent } from 'ng-zorro-antd/avatar';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzDropdownMenuComponent, NzDropdownDirective } from 'ng-zorro-antd/dropdown';
import { NzEmptyComponent } from 'ng-zorro-antd/empty';
import {
  NzInputDirective,
  NzInputPrefixDirective,
  NzInputSuffixDirective,
  NzInputWrapperComponent,
} from 'ng-zorro-antd/input';
import { NzMenuDirective, NzMenuItemComponent } from 'ng-zorro-antd/menu';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzProgressComponent } from 'ng-zorro-antd/progress';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { NzTagComponent } from 'ng-zorro-antd/tag';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';

import { HeaderComponent } from '../commons/header/header.component';
import { SidebarComponent } from '../commons/sidebar/sidebar.component';
import { AddEntryDialogComponent } from './add-entry-dialog/add-entry-dialog.component';

import { VaultCategory, VaultEntry } from '../../core/types/vault.model';
import { VAULT_CATEGORIES, VAULT_STRENGTH_META } from '../../core/constants/vault.constant';
import { computePasswordStrength, formatRelativeTime } from '../../core/utils/vault.util';

import * as VaultActions from '../../store/vault/vault.actions';
import { selectVaultDeletingId, selectVaultEntries, selectVaultLoading } from '../../store/vault/vault.selectors';

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
    NzInputSuffixDirective,
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
    LucideX,
  ],
  providers: [NzModalService],
  templateUrl: './vault.component.html'
})
export class VaultComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly route = inject(ActivatedRoute);
  private readonly modal = inject(NzModalService);
  private readonly message = inject(NzMessageService);
  private readonly destroyRef = inject(DestroyRef);

  readonly categories = VAULT_CATEGORIES;

  readonly entries$ = this.store.select(selectVaultEntries);
  readonly isLoading$ = this.store.select(selectVaultLoading);
  readonly deletingId$ = this.store.select(selectVaultDeletingId);

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
  isEntryDialogOpen = false;
  editingEntry: VaultEntry | null = null;

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

    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const searchParam = params.get('search');
      if (searchParam) {
        this.searchTerm = searchParam;
      }
    });

    this.actions$
      .pipe(ofType(VaultActions.deleteVaultEntrySuccess), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.message.success('Password deleted.');
      });

    this.actions$
      .pipe(ofType(VaultActions.deleteVaultEntryFailure), takeUntilDestroyed(this.destroyRef))
      .subscribe(({ error }) => {
        this.message.error(error);
      });
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  openAddModal(): void {
    this.editingEntry = null;
    this.isEntryDialogOpen = true;
  }

  openEditModal(entry: VaultEntry): void {
    this.editingEntry = entry;
    this.isEntryDialogOpen = true;
  }

  closeEntryDialog(): void {
    this.isEntryDialogOpen = false;
  }

  isDeleting(entry: VaultEntry, deletingId: string | null): boolean {
    return deletingId === entry.id;
  }

  confirmDelete(entry: VaultEntry): void {
    this.modal.confirm({
      nzTitle: 'Delete this password?',
      nzContent: `"${entry.title}" will be permanently removed from your vault.`,
      nzOkText: 'Delete',
      nzOkDanger: true,
      nzOnOk: () => this.store.dispatch(VaultActions.deleteVaultEntry({ id: entry.id })),
      nzCancelText: 'Cancel',
    });
  }

  selectCategory(category: VaultCategory | 'All'): void {
    this.activeCategory$.next(category);
  }

  clearSearch(): void {
    this.searchTerm = '';
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
    return VAULT_STRENGTH_META[computePasswordStrength(entry.password)];
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
