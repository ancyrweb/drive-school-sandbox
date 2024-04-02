import { ensure, isNotBlank, isString, TinyTypeOf } from 'tiny-types';
import { DbTinyType } from '../../shared/db-tiny-type.js';

export class FirstName extends TinyTypeOf<string>() {
  constructor(public readonly value: string) {
    super(value);
    ensure('firstName', value, isString(), isNotBlank());
  }
}

export class FirstNameType extends DbTinyType<FirstName> {
  create(value: string): FirstName {
    return new FirstName(value);
  }
}
