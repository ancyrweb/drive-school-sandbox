import { Nullable } from './types.js';

export class Optional<T> {
  private constructor(private readonly value: Nullable<T>) {}

  static of<T>(value: Nullable<T>) {
    return new Optional(value);
  }

  static empty<T>() {
    return new Optional<T>(null);
  }

  isPresent() {
    return this.value !== null;
  }

  isNull() {
    return this.value === null;
  }

  getOrThrow(factory: () => Error = () => new Error('Not found')) {
    if (this.value === null) {
      throw factory();
    }

    return this.value;
  }

  getOrElse(value: T) {
    return this.value ?? value;
  }
}
