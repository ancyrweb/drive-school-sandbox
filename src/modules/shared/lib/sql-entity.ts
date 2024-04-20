import { PrimaryKey, Property } from '@mikro-orm/core';
import { DomainEvent } from './domain-event.js';

/**
 * Base class for all entities
 */
export abstract class SqlEntity<TProps> {
  @PrimaryKey({ unique: true })
  id: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  private events: DomainEvent[] = [];

  constructor(props: TProps) {
    Object.assign(this, props);
  }

  setEvents(events: DomainEvent[]) {
    this.events = events;
  }

  getEvents(): DomainEvent[] {
    return this.events;
  }

  clearEvents() {
    this.events = [];
  }
}
