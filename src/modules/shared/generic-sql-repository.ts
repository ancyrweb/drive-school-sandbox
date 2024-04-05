import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Optional } from './optional.js';
import { IRepository } from './repository.js';
import { Id } from './id.js';

export abstract class GenericSqlRepository<
  TId extends Id,
  TEntity extends { id: TId },
> implements IRepository<TId, TEntity>
{
  constructor(
    protected readonly repository: EntityRepository<TEntity>,
    protected readonly em: EntityManager,
  ) {}

  async findById(id: TId) {
    const result = await this.repository.findOne({ id } as any);
    return Optional.of(result ?? null);
  }

  async create(entity: TEntity) {
    await this.em.persistAndFlush(entity);
  }

  async clear() {
    await this.repository.nativeDelete({});
  }
}
