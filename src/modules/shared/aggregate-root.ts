import { Property } from '@mikro-orm/core';

export abstract class AggregateRoot {
  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
