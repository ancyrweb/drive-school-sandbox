import { DomainEvent } from './domain-event.js';
import { Entity } from './entity.js';
import { BrandedId } from './id.js';

export abstract class AggregateRoot<
  TId extends BrandedId<any>,
  TState extends { id: TId },
  TSnapshot,
> extends Entity<TId, TState, TSnapshot> {
  private _events: DomainEvent[] = [];

  protected raise(event: DomainEvent) {
    this._events.push(event);
  }

  public getEvents(): DomainEvent[] {
    return this._events.slice();
  }

  public clearEvents() {
    this._events = [];
  }
}
