import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
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
} from '@lucide/angular';
import { NzBadgeComponent } from 'ng-zorro-antd/badge';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzInputDirective, NzInputPrefixDirective, NzInputWrapperComponent } from 'ng-zorro-antd/input';
import { NzPopoverDirective } from 'ng-zorro-antd/popover';

import { STORAGE } from '../../../core/constants/storage.constant';
import { LocalStorageService } from '../../../core/services/local-storage.service';

interface Notification {
  id: number;
  icon: 'shield' | 'key' | 'user' | 'check';
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

@Component({
  selector: 'app-header',
  imports: [
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
    NzBadgeComponent,
    NzButtonComponent,
    NzInputDirective,
    NzInputPrefixDirective,
    NzInputWrapperComponent,
    NzPopoverDirective,
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  @Input() title = 'Dashboard';
  @Output() menuClick = new EventEmitter<void>();

  isNotifOpen = false;

  private readonly localStorageService = inject(LocalStorageService);

  readonly theme = this.localStorageService.getLocalStorageSignal<'light' | 'dark'>(STORAGE.theme, 'dark');

  readonly notifications: Notification[] = [
    {
      id: 1,
      icon: 'shield',
      title: 'Weak password detected',
      message: '"Netflix" reuses a password from another vault entry.',
      time: '10m ago',
      unread: true,
    },
    {
      id: 2,
      icon: 'key',
      title: 'Password rotated',
      message: '"GitHub" credentials were updated successfully.',
      time: '1h ago',
      unread: true,
    },
    {
      id: 3,
      icon: 'user',
      title: 'New device sign-in',
      message: 'Your vault was accessed from a new device in Manila, PH.',
      time: '3h ago',
      unread: true,
    },
    {
      id: 4,
      icon: 'check',
      title: 'Backup complete',
      message: 'Your vault was backed up successfully.',
      time: 'Yesterday',
      unread: false,
    },
  ];

  get unreadCount(): number {
    return this.notifications.filter((n) => n.unread).length;
  }

  toggleTheme(): void {
    this.localStorageService.updateLocalStorageSignal(STORAGE.theme, this.theme() === 'dark' ? 'light' : 'dark');
  }
}
