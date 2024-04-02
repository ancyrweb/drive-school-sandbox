import { ensure, isNotBlank, isString, TinyTypeOf } from 'tiny-types';
import { DbTinyType } from '../../shared/db-tiny-type.js';

export class LastName extends TinyTypeOf<string>() {
  constructor(public readonly value: string) {
    super(value);
    ensure('lastName', value, isString(), isNotBlank());
  }
}

export class LastNameType extends DbTinyType<LastName> {
  create(value: string): LastName {
    return new LastName(value);
  }
}
