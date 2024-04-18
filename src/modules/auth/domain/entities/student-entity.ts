import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { User, UserCreationProps } from './user-entity.js';
import { StudentId, StudentIdType } from './student-id.js';

export type StudentCreationProps = UserCreationProps;

@Entity()
export class Student extends User {
  @PrimaryKey({ type: StudentIdType, unique: true })
  id: StudentId;

  @Property()
  firstName: string;

  @Property()
  lastName: string;

  constructor(props: StudentCreationProps) {
    super(props);
  }

  static create(props: StudentCreationProps) {
    return new Student(props);
  }
}
