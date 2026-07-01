export type Layout = 'list' | 'grid';

const defLayout: Layout = 'grid';
const defPageSize: number = 10;

export const APP_SETTINGS = {
  layout: defLayout,
  pageSize: defPageSize,
} as const;
