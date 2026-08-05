export interface HeaderNotification {
  id: number;
  icon: 'shield' | 'key' | 'user' | 'check';
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

export const HEADER_NOTIFICATIONS: HeaderNotification[] = [
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

