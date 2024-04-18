import { Entity, PrimaryKey } from '@mikro-orm/core';
import { User, UserCreationProps } from './user-entity.js';
import { AdminId, AdminIdType } from './admin-id.js';

export type AdminCreationProps = UserCreationProps;

@Entity()
export class Admin extends User {
  @PrimaryKey({ type: AdminIdType, unique: true })
  id: AdminId;

  constructor(props: AdminCreationProps) {
    super(props);
  }

  static create(props: AdminCreationProps) {
    return new Admin(props);
  }
}
