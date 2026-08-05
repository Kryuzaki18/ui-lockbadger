import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  LucideBell,
  LucideCircleCheck,
  LucideClock,
  LucideKeyRound,
  LucideMenu,
  LucideMoon,
  LucideSearch,
  LucideShieldAlert,
  LucideSun,
  LucideUserPlus,
  LucideX,
} from '@lucide/angular';

import { NzBadgeComponent } from 'ng-zorro-antd/badge';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import {
  NzInputDirective,
  NzInputPrefixDirective,
  NzInputSuffixDirective,
  NzInputWrapperComponent,
} from 'ng-zorro-antd/input';
import { NzPopoverDirective } from 'ng-zorro-antd/popover';

import { STORAGE } from '../../../core/constants/storage.constant';
import { HEADER_NOTIFICATIONS } from '../../../core/constants/data.constants';

import { LocalStorageService } from '../../../core/services/local-storage.service';

const MAX_RECENT_SEARCHES = 5;

@Component({
  selector: 'app-header',
  imports: [
    FormsModule,
    LucideBell,
    LucideCircleCheck,
    LucideClock,
    LucideKeyRound,
    LucideMenu,
    LucideMoon,
    LucideSearch,
    LucideShieldAlert,
    LucideSun,
    LucideUserPlus,
    LucideX,
    NzBadgeComponent,
    NzButtonComponent,
    NzInputDirective,
    NzInputPrefixDirective,
    NzInputSuffixDirective,
    NzInputWrapperComponent,
    NzPopoverDirective,
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  @Input() title = 'Dashboard';
  @Output() menuClick = new EventEmitter<void>();

  isNotifOpen = false;
  searchTerm = '';
  showSuggestions = false;

  private readonly router = inject(Router);
  private readonly localStorageService = inject(LocalStorageService);

  readonly theme = this.localStorageService.getLocalStorageSignal<'light' | 'dark'>(STORAGE.theme, 'dark');
  readonly recentSearches = this.localStorageService.getLocalStorageSignal<string[]>(STORAGE.recentSearches, []);

  readonly notifications = HEADER_NOTIFICATIONS;

  get unreadCount(): number {
    return this.notifications.filter((n) => n.unread).length;
  }

  toggleTheme(): void {
    this.localStorageService.updateLocalStorageSignal(STORAGE.theme, this.theme() === 'dark' ? 'light' : 'dark');
  }

  clearSearch(): void {
    this.searchTerm = '';
  }

  onSearchFocus(): void {
    this.showSuggestions = true;
  }

  onSearchBlur(): void {
    this.showSuggestions = false;
  }

  submitSearch(term: string = this.searchTerm): void {
    const trimmed = term.trim();
    if (!trimmed) return;

    this.searchTerm = trimmed;
    this.showSuggestions = false;
    this.saveRecentSearch(trimmed);
    this.router.navigate(['/vault'], { queryParams: { search: trimmed } });
  }

  selectRecentSearch(term: string): void {
    this.submitSearch(term);
  }

  clearRecentSearches(): void {
    this.localStorageService.updateLocalStorageSignal(STORAGE.recentSearches, []);
  }

  private saveRecentSearch(term: string): void {
    const withoutDuplicate = this.recentSearches().filter((s) => s.toLowerCase() !== term.toLowerCase());
    this.localStorageService.updateLocalStorageSignal(
      STORAGE.recentSearches,
      [term, ...withoutDuplicate].slice(0, MAX_RECENT_SEARCHES),
    );
  }
}
