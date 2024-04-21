import { Entity, Property } from '@mikro-orm/core';
import { SqlEntity } from '../../../../../shared/lib/sql-entity.js';

type Props = {
  id: string;
  firstName: string;
  lastName: string;
};

@Entity({ tableName: 'admins' })
export class SqlAdmin extends SqlEntity<Props> {
  @Property()
  firstName: string;

  @Property()
  lastName: string;
}
