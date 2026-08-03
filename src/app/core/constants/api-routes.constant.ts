const prefix = '/api/v1';

export const API_ROUTES = {
  auth: {
    me: `${prefix}/auth/me`,
    signup: `${prefix}/auth/signup`,
    login: `${prefix}/auth/login`,
    logout: `${prefix}/auth/logout`,
  },
} as const;