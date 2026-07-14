import { ElementRef, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import {
  LucideBell,
  LucideCircleCheck,
  LucideClock,
  LucideKeyRound,
  LucideMenu,
  LucidePlus,
  LucideSearch,
  LucideShieldAlert,
  LucideUserPlus,
} from '@lucide/angular';

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
    LucidePlus,
    LucideSearch,
    LucideShieldAlert,
    LucideUserPlus,
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  @Input() title = 'Dashboard';
  @Output() menuClick = new EventEmitter<void>();

  isNotifOpen = false;

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

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  toggleNotif(): void {
    this.isNotifOpen = !this.isNotifOpen;
  }

  closeNotif(): void {
    this.isNotifOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isNotifOpen && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.isNotifOpen = false;
    }
  }
}
