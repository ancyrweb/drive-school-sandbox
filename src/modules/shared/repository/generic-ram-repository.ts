import { Optional } from '../utils/optional.js';
import { IRepository } from './repository.js';
import { Nullable } from '../utils/types.js';
import { AggregateRoot } from '../lib/aggregate-root.js';
import { GetId } from '../lib/entity.js';
import { BrandedId } from '../lib/id.js';

export abstract class GenericRamRepository<
  TId extends BrandedId<any>,
  TEntity extends AggregateRoot<TId, any, any>,
> implements IRepository<TId, TEntity>
{
  constructor(protected entities: TEntity[] = []) {}

  async findById(id: TId): Promise<Optional<TEntity>> {
    return Optional.of(
      this.entities.find((entity) => entity.getId().equals(id)) ?? null,
    );
  }

  async save(entity: TEntity): Promise<void> {
    return this.saveSync(entity);
  }

  async delete(entity: TEntity): Promise<void> {
    const index = this.entities.findIndex((e) =>
      entity.getId().equals(e.getId()),
    );

    if (index === -1) {
      throw new Error('Entity not found');
    }

    this.entities.splice(index, 1);
  }

  async clear(): Promise<void> {
    this.clearSync();
  }

  findByIdSync(id: GetId<TEntity>): Nullable<TEntity> {
    return this.entities.find((entity) => entity.getId().equals(id)) ?? null;
  }

  saveSync(entity: TEntity): void {
    const index = this.entities.findIndex((e) =>
      entity.getId().equals(e.getId()),
    );

    if (index === -1) {
      this.entities.push(entity);
      return;
    }

    this.entities[index] = entity;
  }

  clearSync(): void {
    this.entities = [];
  }
}
