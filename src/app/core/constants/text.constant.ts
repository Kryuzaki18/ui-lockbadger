export const AUTH_TEXT = {
  headline: {
    line1: 'Store smarter.',
    line2: 'Stay protected.',
    description:
      'LockBadger uses bcrypt to secure your password and applies an additional encryption layer on every stored credential — so even if the database is compromised, your data stays unreadable.',
  },
  features: [
    {
      icon: '🔒',
      title: 'bcrypt password',
      description:
        'Your password is hashed with bcrypt — it is never stored in plain text and cannot be reversed.',
    },
    {
      icon: '🛡️',
      title: 'Double-encrypted credentials',
      description:
        'Every stored email, username and password gets an extra encryption pass on top of the vault — two locks, not one.',
    },
    {
      icon: '🗄️',
      title: 'Breach-resistant storage',
      description:
        'Raw credentials are never written to the database. A stolen dump reveals nothing without your key.',
    },
    {
      icon: '🔑',
      title: 'You hold the key',
      description: 'Decryption happens on your end. No server ever sees your plaintext passwords.',
    },
  ],
};