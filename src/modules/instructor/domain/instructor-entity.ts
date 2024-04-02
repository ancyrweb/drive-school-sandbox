import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { AggregateRoot } from '../../shared/aggregate-root.js';
import { FirstName, FirstNameType } from './first-name.js';
import { LastName, LastNameType } from './last-name.js';
import { InstructorId, InstructorIdType } from './instructor-id.js';

@Entity()
export class Instructor extends AggregateRoot {
  @PrimaryKey({ type: InstructorIdType })
  id: InstructorId;

  @Property({ type: FirstNameType })
  firstName: FirstName;

  @Property({ type: LastNameType })
  lastName: LastName;
}
