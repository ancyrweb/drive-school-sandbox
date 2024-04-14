import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { AggregateRoot } from '../../../shared/lib/aggregate-root.js';
import { UserId, UserIdType } from './user-id.js';
import { Role, RoleDbType } from './role.js';

@Entity()
export class User extends AggregateRoot {
  @PrimaryKey({ type: UserIdType, unique: true })
  id: UserId;

  @Property({ unique: true })
  emailAddress: string;

  @Property()
  password: string;

  @Property({ type: RoleDbType })
  role: Role;

  @Property({ unique: true })
  apiKey: string;

  constructor(props: {
    id: UserId;
    emailAddress: string;
    password: string;
    role: Role;
    apiKey: string;
  }) {
    super();
    this.id = props.id;
    this.emailAddress = props.emailAddress;
    this.password = props.password;
    this.role = props.role;
    this.apiKey = props.apiKey;
  }

  static create(props: {
    id: UserId;
    emailAddress: string;
    password: string;
    role: Role;
    apiKey: string;
  }) {
    return new User(props);
  }
}
