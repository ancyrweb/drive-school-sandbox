import { Entity, OneToOne, Property } from '@mikro-orm/core';
import { SqlApikey } from './sql-apikey.js';
import { SqlEntity } from '../../../../../shared/lib/sql-entity.js';
import { AccountSnapshot } from '../../../../domain/model/account.js';

type Props = {
  id: string;
  emailAddress: string;
  password: string;
  apikey: SqlApikey;
  account: AccountSnapshot;
};

@Entity({ tableName: 'users' })
export class SqlUser extends SqlEntity<Props> {
  @Property({ unique: true })
  emailAddress: string;

  @Property()
  password: string;

  @OneToOne()
  apikey: SqlApikey;

  @Property({ type: 'jsonb' })
  account: AccountSnapshot;
}
