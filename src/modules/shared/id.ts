import { TinyType, TinyTypeOf } from 'tiny-types';
import { randomUUID } from 'crypto';
import { DbTinyType } from './db-tiny-type.js';

export class IdProvider {
  static generate(): string {
    return randomUUID();
  }
}

export function BrandedId<T extends string>(brand: T) {
  return class extends TinyTypeOf<string>() {
    __brand: T;
  };
}

export abstract class DbIdType<T extends TinyType> extends DbTinyType<T> {
  getColumnType(): string {
    return 'varchar(36)';
  }
}
