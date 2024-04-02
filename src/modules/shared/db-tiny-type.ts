import { Type } from '@mikro-orm/core';
import { TinyType } from 'tiny-types';

export abstract class DbTinyType<T extends TinyType> extends Type<T, string> {
  abstract create(value: string): T;

  convertToDatabaseValue(value: T): string {
    return value.toString();
  }

  convertToJSValue(value: string): T {
    return this.create(value);
  }

  getColumnType() {
    return 'varchar(255)';
  }
}
