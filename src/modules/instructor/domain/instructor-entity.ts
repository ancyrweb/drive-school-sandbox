import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { AggregateRoot } from '../../shared/aggregate-root.js';
import { InstructorId, InstructorIdType } from './instructor-id.js';
import { DomainEvent } from '../../shared/domain-event.js';

@Entity()
export class Instructor extends AggregateRoot {
  @PrimaryKey({ type: InstructorIdType })
  id: InstructorId;

  @Property()
  firstName: string;

  @Property()
  lastName: string;

  constructor(props: {
    id: InstructorId;
    firstName: string;
    lastName: string;
  }) {
    super();
    Object.assign(this, props);
  }
}

class InstructorCreatedEvent extends DomainEvent<{}> {
  constructor(public readonly instructor: Instructor) {
    super({});
  }
}
