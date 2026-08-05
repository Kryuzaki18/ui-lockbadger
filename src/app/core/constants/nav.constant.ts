export interface NavItem {
  label: string;
  icon: 'dashboard' | 'vault' | 'generator' | 'reports' | 'settings';
  route: string | null;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', route: '/home' },
  { label: 'Vault', icon: 'vault', route: '/vault' },
  { label: 'Generator', icon: 'generator', route: null },
  { label: 'Reports', icon: 'reports', route: null },
  { label: 'Settings', icon: 'settings', route: null },
];
