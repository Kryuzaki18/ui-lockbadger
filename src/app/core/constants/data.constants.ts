export interface VaultItemSummary {
  id: string;
  title: string;
  username: string;
  url: string;
  updatedAt: string;
}

export const RECENT_VAULT_ITEMS: VaultItemSummary[] = [
  { id: '1', title: 'GitHub', username: 'sample@gmail.com', url: 'github.com', updatedAt: '2 hours ago' },
  { id: '2', title: 'Netflix', username: 'kelly.j', url: 'netflix.com', updatedAt: 'Yesterday' },
  { id: '3', title: 'AWS Console', username: 'k.jedumapit', url: 'aws.amazon.com', updatedAt: '3 days ago' },
  { id: '4', title: 'Figma', username: 'kelly@lockbadger.io', url: 'figma.com', updatedAt: '1 week ago' },
  { id: '5', title: 'Spotify', username: 'kellyj92', url: 'spotify.com', updatedAt: '2 weeks ago' },
];

export type VaultStatTone = 'neutral' | 'warning' | 'danger' | 'success';
export type VaultStatIcon = 'vault' | 'alert' | 'repeat' | 'gauge';

export interface VaultStat {
  label: string;
  value: string;
  hint: string;
  icon: VaultStatIcon;
  tone: VaultStatTone;
}

export const VAULT_STATS: VaultStat[] = [
  { label: 'Total items', value: '42', hint: 'Across 5 categories', icon: 'vault', tone: 'neutral' },
  { label: 'Weak passwords', value: '5', hint: 'Should be updated', icon: 'alert', tone: 'warning' },
  { label: 'Reused passwords', value: '3', hint: 'Used on multiple sites', icon: 'repeat', tone: 'danger' },
  { label: 'Security score', value: '86%', hint: 'Better than last month', icon: 'gauge', tone: 'success' },
];

export interface SecurityTip {
  icon: 'shield' | 'key' | 'fingerprint';
  title: string;
  description: string;
}

export const SECURITY_TIPS: SecurityTip[] = [
  {
    icon: 'shield',
    title: 'Enable two-factor auth',
    description: 'Add an extra layer of protection to your most important accounts.',
  },
  {
    icon: 'key',
    title: 'Fix weak passwords',
    description: 'You have 5 passwords that are short or easy to guess.',
  },
  {
    icon: 'fingerprint',
    title: 'Stop reusing passwords',
    description: '3 of your saved logins share the same password.',
  },
];
