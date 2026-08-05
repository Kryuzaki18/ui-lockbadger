import type { VAULT_CATEGORIES } from '../constants/vault.constant';

export type VaultCategory = (typeof VAULT_CATEGORIES)[number];

export type VaultPasswordStrength = 'weak' | 'fair' | 'strong';

export interface VaultEntry {
  id: string;
  title: string;
  category: VaultCategory;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VaultEntryInput {
  title: string;
  category: VaultCategory;
  username: string;
  password: string;
  url?: string;
  notes?: string;
}

export interface VaultState {
  entries: VaultEntry[];
  isLoading: boolean;
  isSaving: boolean;
  deletingId: string | null;
  error: string | null;
}

export type VaultStatTone = 'neutral' | 'warning' | 'danger' | 'success';
export type VaultStatIcon = 'vault' | 'alert' | 'repeat' | 'gauge';

export interface VaultStat {
  label: string;
  value: string;
  hint: string;
  icon: VaultStatIcon;
  tone: VaultStatTone;
}

export interface SecurityTip {
  icon: 'shield' | 'key' | 'fingerprint';
  title: string;
  description: string;
}
