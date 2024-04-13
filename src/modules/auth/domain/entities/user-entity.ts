import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { AggregateRoot } from '../../../shared/lib/aggregate-root.js';
import { UserId, UserIdType } from './user-id.js';
import { Role, RoleDbType } from './role.js';

@Entity()
export class User extends AggregateRoot {
  @PrimaryKey({ type: UserIdType })
  id: UserId;

  @Property()
  emailAddress: string;

  @Property()
  password: string;

  @Property({ type: RoleDbType })
  role: Role;
}
