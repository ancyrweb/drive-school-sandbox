import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { AggregateRoot } from '../../../shared/lib/aggregate-root.js';
import { UserId, UserIdType } from './user-id.js';
import { Role, RoleDbType } from './role.js';
import { UserCreatedEvent } from '../events/user-created-event.js';

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
    const user = new User(props);
    user.raise(
      new UserCreatedEvent({
        id: user.id.value,
        emailAddress: user.emailAddress,
        role: user.role.value,
        apiKey: user.apiKey,
      }),
    );

    return user;
  }
}
