import { TinyType, TinyTypeOf } from 'tiny-types';
import { randomUUID } from 'crypto';
import { DbTinyType } from './db-tiny-type.js';

/**
 * Generates random IDs
 */
export class IdProvider {
  static generate(): string {
    return randomUUID();
  }
}

/**
 * Represents an ID.
 */
export type Id = {
  equals: (value: any) => boolean;
};

/**
 * Class factory that creates a branded ID.
 * A branded ID is an ID associated to a specific class.
 * This technique allows to avoid mixing IDs from different classes.
 * Such that a UserId can be used where a PostId is expected.
 * @see https://egghead.io/blog/using-branded-types-in-typescript
 * @param brand
 * @constructor
 */
export function BrandedId<T extends string>(brand: T) {
  return class extends TinyTypeOf<string>() {
    __brand: T;
  };
}

/**
 * Represent a database ID
 */
export abstract class DbIdType<T extends TinyType> extends DbTinyType<T> {
  getColumnType(): string {
    return 'varchar(36)';
  }
}
