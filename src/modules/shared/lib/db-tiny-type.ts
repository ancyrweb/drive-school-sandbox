import { Type } from '@mikro-orm/core';
import { TinyType } from 'tiny-types';

/**
 * Represents a database type designed for tiny types.
 * Makes it less verbose to create tiny types aka value objects.
 */
export abstract class DbTinyType<T extends TinyType> extends Type<T, string> {
  abstract create(value: string): T;

  convertToDatabaseValue(obj: T): string {
    return (obj as any).value;
  }

  convertToJSValue(value: string): T {
    return this.create(value);
  }

  getColumnType() {
    return 'varchar(255)';
  }
}
