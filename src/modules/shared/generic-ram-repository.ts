import { Optional } from './optional.js';
import { IRepository } from './repository.js';
import { Id } from './id.js';
import { Nullable } from './types.js';

export abstract class GenericRamRepository<
  TId extends Id,
  TEntity extends { id: TId },
> implements IRepository<TId, TEntity>
{
  protected entities: TEntity[] = [];

  async findById(id: TId): Promise<Optional<TEntity>> {
    return Optional.of(
      this.entities.find((entity) => entity.id.equals(id)) ?? null,
    );
  }

  async create(entity: TEntity): Promise<void> {
    this.entities.push(entity);
  }

  async clear(): Promise<void> {
    this.entities = [];
  }

  findByIdSync(id: TId): Nullable<TEntity> {
    return this.entities.find((entity) => entity.id.equals(id)) ?? null;
  }
}
