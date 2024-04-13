import { Type } from '@mikro-orm/core';
import { InvariantException } from '../../../shared/exceptions/invariant-exception.js';

export class Role {
  static ADMIN = new Role('admin');
  static STUDENT = new Role('student');
  static INSTRUCTOR = new Role('instructor');

  constructor(public readonly value: string) {
    if (value != 'admin' && value != 'student' && value != 'instructor') {
      throw new InvariantException('Invalid user type');
    }
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
    return new Role(value);
  }

  getColumnType() {
    return 'varchar(32)';
  }
}
