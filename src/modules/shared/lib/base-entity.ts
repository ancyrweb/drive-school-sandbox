import { Property } from '@mikro-orm/core';

/**
 * Base class for all entities
 */
export abstract class BaseEntity {
  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
