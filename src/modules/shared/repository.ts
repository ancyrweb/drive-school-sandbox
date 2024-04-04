import { Optional } from './optional.js';

export interface IRepository<TId, TEntity extends { id: TId }> {
  findById(id: TId): Promise<Optional<TEntity>>;
  create(entity: TEntity): Promise<void>;
  clear(): Promise<void>;
}
