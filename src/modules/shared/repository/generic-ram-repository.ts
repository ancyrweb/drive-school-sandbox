import { Optional } from '../utils/optional.js';
import { IRepository } from './repository.js';
import { BrandedId } from '../lib/id.js';
import { Nullable } from '../utils/types.js';

export abstract class GenericRamRepository<
  TId extends BrandedId<any>,
  TEntity extends { id: TId },
> implements IRepository<TId, TEntity>
{
  constructor(protected entities: TEntity[] = []) {}

  async findById(id: TId): Promise<Optional<TEntity>> {
    return Optional.of(
      this.entities.find((entity) => entity.id.value === id.value) ?? null,
    );
  }

  async create(entity: TEntity): Promise<void> {
    this.createSync(entity);
  }

  async update(entity: TEntity): Promise<void> {
    const index = this.entities.findIndex(
      (e) => entity.id.value === e.id.value,
    );
    if (index === -1) {
      throw new Error('Entity not found');
    }

    this.entities[index] = entity;
  }

  async delete(entity: TEntity): Promise<void> {
    const index = this.entities.findIndex(
      (e) => entity.id.value === e.id.value,
    );
    if (index === -1) {
      throw new Error('Entity not found');
    }

    this.entities.splice(index, 1);
  }

  async clear(): Promise<void> {
    this.clearSync();
  }

  findByIdSync(id: TId): Nullable<TEntity> {
    return this.entities.find((entity) => entity.id.value === id.value) ?? null;
  }

  createSync(entity: TEntity): void {
    this.entities.push(entity);
  }

  clearSync(): void {
    this.entities = [];
  }
}
