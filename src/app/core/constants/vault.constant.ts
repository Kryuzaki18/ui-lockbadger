import type { VaultPasswordStrength } from '../types/vault.model';

export const VAULT_CATEGORIES = ['Logins', 'Social', 'Finance', 'Work', 'Games', 'Shopping'] as const;

export const DEFAULT_VAULT_CATEGORY = VAULT_CATEGORIES[0];

export interface VaultStrengthMeta {
  label: string;
  percent: number;
  strokeColor: string;
}

export const VAULT_STRENGTH_META: Record<VaultPasswordStrength, VaultStrengthMeta> = {
  weak: { label: 'Weak', percent: 33, strokeColor: '#ef4444' },
  fair: { label: 'Fair', percent: 66, strokeColor: '#f59e0b' },
  strong: { label: 'Strong', percent: 100, strokeColor: '#10b981' },
};

export const VAULT_PASSWORD_CHARSET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+';
