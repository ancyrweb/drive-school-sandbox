import { Optional } from '../utils/optional.js';

export interface IRepository<TId, TEntity> {
  findById(id: TId): Promise<Optional<TEntity>>;
  create(entity: TEntity): Promise<void>;
  update(entity: TEntity): Promise<void>;
  delete(entity: TEntity): Promise<void>;
  clear(): Promise<void>;
}
