import { Property } from '@mikro-orm/core';

/**
 * Base class for all entities
 */
export abstract class SqlEntity {
  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
