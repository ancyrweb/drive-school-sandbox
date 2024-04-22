export type Nullable<T> = T | null;

export type GetFactoryProps<T extends { create: (...args: any[]) => any }> =
  Parameters<T['create']>[0];
