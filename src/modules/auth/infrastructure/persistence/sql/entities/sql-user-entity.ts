import { Entity, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { SqlAggregateRoot } from '../../../../../shared/lib/sql-aggregate-root.js';
import { Role, RoleDbType } from '../../../../domain/model/role.js';
import { SqlApikeyEntity } from './sql-apikey-entity.js';
import { UserId, UserIdType } from '../../../../domain/entities/user-id.js';

export type UserCreationProps = {
  id: UserId;
  emailAddress: string;
  password: string;
  role: Role;
  apiKey: SqlApikeyEntity;
};

@Entity()
export class SqlUserEntity extends SqlAggregateRoot {
  @PrimaryKey({ type: UserIdType })
  id: UserId;

  @Property({ unique: true })
  emailAddress: string;

  @Property()
  password: string;

  @Property({ type: RoleDbType })
  role: Role;

  @OneToOne()
  apiKey: SqlApikeyEntity;

  private constructor(props: UserCreationProps) {
    super();
    this.id = props.id;
    this.emailAddress = props.emailAddress;
    this.password = props.password;
    this.role = props.role;
    this.apiKey = props.apiKey;
  }

  static create(props: UserCreationProps) {
    return new SqlUserEntity(props);
  }
}
