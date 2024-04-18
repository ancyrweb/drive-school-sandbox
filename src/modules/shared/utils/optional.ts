import { Nullable } from './types.js';

export class Optional<T> {
  private constructor(private readonly value: Nullable<T>) {}

  static of<T>(value: T | null | undefined): Optional<T> {
    return value === null || value == undefined
      ? Optional.empty()
      : new Optional(value);
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
