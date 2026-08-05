const PREFIX = 'lockbadger';

export const STORAGE = {
  session: `${PREFIX}-session`,
  theme: `${PREFIX}-theme`,
  recentSearches: `${PREFIX}-recent-searches`,
} as const;