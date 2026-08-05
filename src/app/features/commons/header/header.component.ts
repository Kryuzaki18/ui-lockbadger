import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

  private readonly localStorageService = inject(LocalStorageService);

  readonly theme = this.localStorageService.getLocalStorageSignal<'light' | 'dark'>(STORAGE.theme, 'dark');

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
}
