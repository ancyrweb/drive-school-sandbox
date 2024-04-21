import { BrandedId } from './id.js';

export abstract class Entity<
  TId extends BrandedId<any>,
  TState extends { id: TId },
  TSnapshot,
> {
  protected constructor(
    protected _state: TState,
    private _record: any = null,
  ) {}

  getId(): TId {
    return this._state.id;
  }

  attachRecord<T>(record: T): this {
    this._record = record;
    return this;
  }

  getRecord<T>(): T {
    return this._record;
  }

  abstract takeSnapshot(): TSnapshot;
}

export type GetId<T> = T extends Entity<infer I, infer S, infer U> ? I : never;
export type GetState<T> =
  T extends Entity<infer I, infer S, infer U> ? S : never;
export type GetSnapshot<T> =
  T extends Entity<infer I, infer S, infer U> ? U : never;
