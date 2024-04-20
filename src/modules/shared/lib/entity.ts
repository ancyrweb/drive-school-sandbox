import { BrandedId } from './id.js';

export abstract class Entity<
  TId extends BrandedId<any>,
  TState extends { id: TId },
  TSnapshot,
> {
  protected _state: TState;
  abstract takeSnapshot(): TSnapshot;

  protected constructor(state: TState) {
    this._state = state;
  }

  getId(): TId {
    return this._state.id;
  }
}

export type GetId<T> = T extends Entity<infer I, infer S, infer U> ? I : never;
export type GetState<T> =
  T extends Entity<infer I, infer S, infer U> ? S : never;
export type GetSnapshot<T> =
  T extends Entity<infer I, infer S, infer U> ? U : never;
