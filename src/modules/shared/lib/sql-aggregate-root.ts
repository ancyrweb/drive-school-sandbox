import { Property } from '@mikro-orm/core';
import { DomainEvent } from './domain-event.js';
import { SqlEntity } from './sql-entity.js';

/**
 * Base class for all aggregate roots.
 */
export abstract class SqlAggregateRoot extends SqlEntity {
  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  private events: DomainEvent[] = [];

  raise<T extends Record<string, any>>(event: DomainEvent<T>) {
    if (!this.events) {
      this.events = [];
    }

    this.events.push(event);
  }

  getEvents(): DomainEvent[] {
    return this.events;
  }
}
