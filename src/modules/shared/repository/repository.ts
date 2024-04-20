import { Optional } from '../utils/optional.js';

export interface IRepository<TId, TEntity> {
  findById(id: TId): Promise<Optional<TEntity>>;
  save(entity: TEntity): Promise<void>;
  delete(entity: TEntity): Promise<void>;
  clear(): Promise<void>;
}
