import { AggregateRoot } from './aggregate-root.js';
import { SqlEntity } from './sql-entity.js';

export abstract class Mapper<
  TDomain extends AggregateRoot<any, any, any>,
  TPersistence extends SqlEntity<any>,
> {
  abstract toPersistence(obj: TDomain): TPersistence;
  abstract toDomain(obj: TPersistence): TDomain;
}
