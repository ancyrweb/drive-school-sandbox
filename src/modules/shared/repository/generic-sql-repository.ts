import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Optional } from '../utils/optional.js';
import { IRepository } from './repository.js';
import { AggregateRoot } from '../lib/aggregate-root.js';
import { SqlEntity } from '../lib/sql-entity.js';
import { Mapper } from '../lib/mapper.js';
import { BrandedId } from '../lib/id.js';

export abstract class GenericSqlRepository<
  TId extends BrandedId<any>,
  TDomain extends AggregateRoot<TId, any, any>,
  TPersistence extends SqlEntity<any>,
> implements IRepository<TId, TDomain>
{
  abstract mapper: Mapper<TDomain, TPersistence>;

  constructor(
    protected readonly repository: EntityRepository<TPersistence>,
    protected readonly em: EntityManager,
  ) {}

  async findById(id: TId): Promise<Optional<TDomain>> {
    const result = await this.repository.findOne({ id: id.value } as any);

    return result
      ? Optional.of(this.mapper.toDomain(result))
      : Optional.empty();
  }

  async save(entity: TDomain) {
    this.em.persist(this.mapper.toPersistence(entity));
  }

  async delete(entity: TDomain) {
    this.em.remove(this.mapper.toPersistence(entity));
  }

  async clear() {
    await this.repository.nativeDelete({});
  }
}
