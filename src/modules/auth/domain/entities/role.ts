import { Type } from '@mikro-orm/core';
import { InvariantException } from '../../../shared/exceptions/invariant-exception.js';

export const rolesAsStrings = ['admin', 'student', 'instructor'] as const;

export class Role {
  static ADMIN = new Role('admin');
  static STUDENT = new Role('student');
  static INSTRUCTOR = new Role('instructor');

  private constructor(public readonly value: string) {
    if (!rolesAsStrings.includes(value as any)) {
      throw new InvariantException('Invalid user type');
    }
  }

  static create(value: string) {
    return new Role(value);
  }

  equals(role: Role) {
    return this.value === role.value;
  }
}

export class RoleDbType extends Type<Role, string> {
  convertToDatabaseValue(obj: Role): string {
    return obj.value;
  }

  convertToJSValue(value: string): Role {
    return Role.create(value);
  }

  getColumnType() {
    return 'varchar(32)';
  }
}
