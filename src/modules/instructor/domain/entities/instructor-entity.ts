import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { AggregateRoot } from '../../../shared/lib/aggregate-root.js';
import { InstructorId, InstructorIdType } from './instructor-id.js';
import { InstructorRenamedEvent } from '../events/InstructorRenamedEvent.js';

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

  static create(props: {
    id: InstructorId;
    firstName: string;
    lastName: string;
  }) {
    return new Instructor(props);
  }

  rename(firstName: string, lastName: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.raise(
      new InstructorRenamedEvent({
        instructorId: this.id.value,
        firstName,
        lastName,
      }),
    );
  }
}
