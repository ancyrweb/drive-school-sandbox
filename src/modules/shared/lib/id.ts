import { randomUUID } from 'crypto';

/**
 * Generates random IDs
 */
export class IdProvider {
  static generate(): string {
    return randomUUID();
  }
}

/**
 * Class factory that creates a branded ID.
 * A branded ID is an ID associated to a specific class.
 * This technique allows to avoid mixing IDs from different classes.
 * Such that a UserId can be used where a PostId is expected.
 * @see https://egghead.io/blog/using-branded-types-in-typescript
 * @param brand
 * @constructor
 */
export class BrandedId<T extends string> {
  protected __brand: T;

  constructor(public readonly value: string = IdProvider.generate()) {}

  public asString() {
    return this.value;
  }

  public equals(other: BrandedId<any>) {
    return this.value === other.value;
  }
}

/**
 * A MikroORM type to convert our branded ID to a database value and back.
 * It is required because MikroORM does not support custom types out of the box.
 */
export function BrandedIdType(klass: new (value?: string) => BrandedId<any>) {
  return class {
    convertToDatabaseValue(obj: BrandedId<any>): string {
      return obj.value;
    }

    convertToJSValue(value: string): BrandedId<any> {
      return new klass(value);
    }

    getColumnType(): string {
      return 'varchar(36)';
    }
  };
}
