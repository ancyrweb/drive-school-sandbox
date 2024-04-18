import { Entity, OneToOne, Property } from '@mikro-orm/core';
import { AggregateRoot } from '../../../shared/lib/aggregate-root.js';
import { Role, RoleDbType } from '../model/role.js';
import { ApikeyEntity } from './apikey-entity.js';

export type UserCreationProps = {
  emailAddress: string;
  password: string;
  role: Role;
  apiKey: ApikeyEntity;
};

@Entity({ abstract: true })
export abstract class User extends AggregateRoot {
  @Property({ unique: true })
  emailAddress: string;

  @Property()
  password: string;

  @Property({ type: RoleDbType })
  role: Role;

  @OneToOne()
  apiKey: ApikeyEntity;

  protected constructor(props: UserCreationProps) {
    super();
    this.emailAddress = props.emailAddress;
    this.password = props.password;
    this.role = props.role;
    this.apiKey = props.apiKey;
  }
}
