import { Entity, Property } from '@mikro-orm/core';
import { SqlEntity } from '../../../../../shared/lib/sql-entity.js';

type Props = { id: string; value: string };

@Entity({ tableName: 'apikeys' })
export class SqlApikey extends SqlEntity<Props> {
  @Property({ unique: true })
  value: string;
}
