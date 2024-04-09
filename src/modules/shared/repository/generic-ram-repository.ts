import { Optional } from '../utils/optional.js';
import { IRepository } from './repository.js';
import { Id } from '../domain/id.js';
import { Nullable } from '../utils/types.js';

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
    this.createSync(entity);
  }

  async update(entity: TEntity): Promise<void> {
    const index = this.entities.findIndex((e) => e.id.equals(entity.id));
    if (index === -1) {
      throw new Error('Entity not found');
    }

    this.entities[index] = entity;
  }

  async delete(entity: TEntity): Promise<void> {
    const index = this.entities.findIndex((e) => e.id.equals(entity.id));
    if (index === -1) {
      throw new Error('Entity not found');
    }

    this.entities.splice(index, 1);
  }

  async clear(): Promise<void> {
    this.entities = [];
  }

  findByIdSync(id: TId): Nullable<TEntity> {
    return this.entities.find((entity) => entity.id.equals(id)) ?? null;
  }

  createSync(entity: TEntity): void {
    this.entities.push(entity);
  }
}
