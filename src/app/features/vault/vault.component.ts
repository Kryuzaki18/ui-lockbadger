import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { NzTagComponent } from 'ng-zorro-antd/tag';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';

import { HeaderComponent } from '../commons/header/header.component';
import { SidebarComponent } from '../commons/sidebar/sidebar.component';
import {
  VAULT_CATEGORIES,
  VAULT_PASSWORD_ENTRIES,
  VaultCategory,
  VaultPasswordEntry,
} from '../../core/constants/data.constants';

const STRENGTH_META: Record<VaultPasswordEntry['strength'], { label: string; percent: number; colorClass: string; strokeColor: string }> = {
  weak: { label: 'Weak', percent: 33, colorClass: 'text-red-500', strokeColor: '#ef4444' },
  fair: { label: 'Fair', percent: 66, colorClass: 'text-amber-500', strokeColor: '#f59e0b' },
  strong: { label: 'Strong', percent: 100, colorClass: 'text-emerald-500', strokeColor: '#10b981' },
};

@Component({
  selector: 'app-vault',
  imports: [
    FormsModule,
    NgClass,
    HeaderComponent,
    SidebarComponent,
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
  templateUrl: './vault.component.html',
  styleUrl: './vault.component.scss',
})
export class VaultComponent {
  readonly categories = VAULT_CATEGORIES;
  readonly entries: VaultPasswordEntry[] = VAULT_PASSWORD_ENTRIES;

  sidebarOpen = false;
  searchTerm = '';
  activeCategory: VaultCategory | 'All' = 'All';

  private readonly visiblePasswordIds = new Set<string>();
  private copiedKey: string | null = null;

  get filteredEntries(): VaultPasswordEntry[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.entries.filter((entry) => {
      const matchesCategory = this.activeCategory === 'All' || entry.category === this.activeCategory;
      const matchesTerm =
        !term ||
        entry.title.toLowerCase().includes(term) ||
        entry.username.toLowerCase().includes(term) ||
        entry.url.toLowerCase().includes(term);

      return matchesCategory && matchesTerm;
    });
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  selectCategory(category: VaultCategory | 'All'): void {
    this.activeCategory = category;
  }

  toggleFavorite(entry: VaultPasswordEntry, event: Event): void {
    event.stopPropagation();
    entry.favorite = !entry.favorite;
  }

  isPasswordVisible(entry: VaultPasswordEntry): boolean {
    return this.visiblePasswordIds.has(entry.id);
  }

  togglePasswordVisibility(entry: VaultPasswordEntry): void {
    if (this.visiblePasswordIds.has(entry.id)) {
      this.visiblePasswordIds.delete(entry.id);
    } else {
      this.visiblePasswordIds.add(entry.id);
    }
  }

  strengthMeta(entry: VaultPasswordEntry) {
    return STRENGTH_META[entry.strength];
  }

  isCopied(entry: VaultPasswordEntry, field: 'username' | 'password'): boolean {
    return this.copiedKey === `${entry.id}:${field}`;
  }

  async copyToClipboard(entry: VaultPasswordEntry, field: 'username' | 'password'): Promise<void> {
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
