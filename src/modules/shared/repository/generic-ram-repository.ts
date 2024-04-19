import { Optional } from '../utils/optional.js';
import { IRepository } from './repository.js';
import { Nullable } from '../utils/types.js';
import { AggregateRoot } from '../lib/aggregate-root.js';
import { GetId } from '../lib/entity.js';

export abstract class GenericRamRepository<
  TEntity extends AggregateRoot<any, any, any>,
> implements IRepository<GetId<TEntity>, TEntity>
{
  constructor(protected entities: TEntity[] = []) {}

  async findById(id: GetId<TEntity>): Promise<Optional<TEntity>> {
    return Optional.of(
      this.entities.find((entity) => entity.getId().value === id.value) ?? null,
    );
  }

  async create(entity: TEntity): Promise<void> {
    this.createSync(entity);
  }

  async update(entity: TEntity): Promise<void> {
    const index = this.entities.findIndex(
      (e) => entity.getId().value === e.getId().value,
    );
    if (index === -1) {
      throw new Error('Entity not found');
    }

    this.entities[index] = entity;
  }

  async delete(entity: TEntity): Promise<void> {
    const index = this.entities.findIndex(
      (e) => entity.getId().value === e.getId().value,
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
    return (
      this.entities.find((entity) => entity.getId().value === id.value) ?? null
    );
  }

  createSync(entity: TEntity): void {
    this.entities.push(entity);
  }

  clearSync(): void {
    this.entities = [];
  }
}
