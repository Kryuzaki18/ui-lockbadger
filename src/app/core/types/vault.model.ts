export const VAULT_CATEGORIES = ['Logins', 'Social', 'Finance', 'Work', 'Shopping'] as const;

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
  error: string | null;
}
