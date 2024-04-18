import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { InstructorCreatedEvent } from '../events/instructor-created-event.js';
import { User, UserCreationProps } from './user-entity.js';
import { InstructorId, InstructorIdType } from './instructor-id.js';

export type InstructorCreationProps = UserCreationProps & {
  id: InstructorId;
  firstName: string;
  lastName: string;
};

@Entity()
export class Instructor extends User {
  @PrimaryKey({ type: InstructorIdType, unique: true })
  id: InstructorId;

  @Property()
  firstName: string;

  @Property()
  lastName: string;

  constructor(props: InstructorCreationProps) {
    super(props);
    this.id = props.id;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
  }

  static create(props: InstructorCreationProps) {
    const instructor = new Instructor(props);
    instructor.raise(
      new InstructorCreatedEvent({
        id: instructor.id.value,
        emailAddress: instructor.emailAddress,
        role: instructor.role.value,
        apiKey: instructor.apiKey.value,
      }),
    );

    return instructor;
  }
}
