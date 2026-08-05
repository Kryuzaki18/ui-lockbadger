import { SecurityTip, VaultEntry, VaultPasswordStrength, VaultStat } from '../types/vault.model';

const STRENGTH_SCORE: Record<VaultPasswordStrength, number> = { weak: 20, fair: 60, strong: 100 };

export function computePasswordStrength(password: string): VaultPasswordStrength {
  if (!password) return 'weak';

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score >= 4) return 'strong';
  if (score >= 2) return 'fair';
  return 'weak';
}

export function formatRelativeTime(input: string | Date): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;

  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? '' : 's'} ago`;
}

function countReusedPasswords(entries: VaultEntry[]): number {
  const occurrences = new Map<string, number>();
  for (const entry of entries) {
    occurrences.set(entry.password, (occurrences.get(entry.password) ?? 0) + 1);
  }

  return entries.filter((entry) => (occurrences.get(entry.password) ?? 0) > 1).length;
}

export function computeSecurityScore(entries: VaultEntry[]): number {
  if (entries.length === 0) return 100;

  const total = entries.reduce(
    (sum, entry) => sum + STRENGTH_SCORE[computePasswordStrength(entry.password)],
    0,
  );

  return Math.round(total / entries.length);
}

export function computeVaultStats(entries: VaultEntry[]): VaultStat[] {
  const total = entries.length;
  const weakCount = entries.filter((entry) => computePasswordStrength(entry.password) === 'weak').length;
  const reusedCount = countReusedPasswords(entries);
  const score = computeSecurityScore(entries);
  const categoryCount = new Set(entries.map((entry) => entry.category)).size;

  return [
    {
      label: 'Total items',
      value: String(total),
      hint: total === 0 ? 'Your vault is empty' : `Across ${categoryCount} categor${categoryCount === 1 ? 'y' : 'ies'}`,
      icon: 'vault',
      tone: 'neutral',
    },
    {
      label: 'Weak passwords',
      value: String(weakCount),
      hint: weakCount === 0 ? 'None found' : 'Should be updated',
      icon: 'alert',
      tone: weakCount === 0 ? 'neutral' : 'warning',
    },
    {
      label: 'Reused passwords',
      value: String(reusedCount),
      hint: reusedCount === 0 ? 'No duplicates found' : 'Used on multiple sites',
      icon: 'repeat',
      tone: reusedCount === 0 ? 'neutral' : 'danger',
    },
    {
      label: 'Security score',
      value: `${score}%`,
      hint: score >= 80 ? 'Nice and secure' : score >= 50 ? 'Could use some work' : 'Needs attention',
      icon: 'gauge',
      tone: score >= 80 ? 'success' : score >= 50 ? 'warning' : 'danger',
    },
  ];
}

export function computeRecentItems(entries: VaultEntry[], limit = 5): VaultEntry[] {
  return [...entries]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);
}

export function computeSecurityTips(entries: VaultEntry[]): SecurityTip[] {
  const weakCount = entries.filter((entry) => computePasswordStrength(entry.password) === 'weak').length;
  const reusedCount = countReusedPasswords(entries);

  const tips: SecurityTip[] = [
    {
      icon: 'shield',
      title: 'Enable two-factor auth',
      description: 'Add an extra layer of protection to your most important accounts.',
    },
  ];

  if (weakCount > 0) {
    tips.push({
      icon: 'key',
      title: 'Fix weak passwords',
      description: `You have ${weakCount} password${weakCount === 1 ? '' : 's'} that ${weakCount === 1 ? 'is' : 'are'} short or easy to guess.`,
    });
  }

  if (reusedCount > 0) {
    tips.push({
      icon: 'fingerprint',
      title: 'Stop reusing passwords',
      description: `${reusedCount} of your saved logins share a password with another entry.`,
    });
  }

  return tips;
}
