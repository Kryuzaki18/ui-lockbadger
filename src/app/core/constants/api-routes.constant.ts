const prefix = '/api/v1';

export const API_ROUTES = {
  auth: {
    me: `${prefix}/auth/me`,
    signup: `${prefix}/auth/signup`,
    login: `${prefix}/auth/login`,
    logout: `${prefix}/auth/logout`,
  },
  vault: {
    root: `${prefix}/vault/`,
    byId: (id: string) => `${prefix}/vault/${id}`,
  },
} as const;