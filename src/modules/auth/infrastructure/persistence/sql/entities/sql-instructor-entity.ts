import { Entity, OneToOne, PrimaryKey, Property, Ref } from '@mikro-orm/core';
import { InstructorCreatedEvent } from '../../../../domain/events/instructor-created-event.js';
import { SqlUserEntity } from './sql-user-entity.js';
import {
  InstructorId,
  InstructorIdType,
} from '../../../../domain/entities/instructor-id.js';
import { SqlAggregateRoot } from '../../../../../shared/lib/sql-aggregate-root.js';
import { UserId } from '../../../../domain/entities/user-id.js';

export type InstructorCreationProps = {
  id: InstructorId;
  userId: UserId;
  firstName: string;
  lastName: string;
};

@Entity()
export class SqlInstructorEntity extends SqlAggregateRoot {
  @PrimaryKey({ type: InstructorIdType, unique: true })
  id: InstructorId;

  @Property()
  firstName: string;

  @Property()
  lastName: string;

  @OneToOne(() => SqlUserEntity)
  user!: Ref<SqlUserEntity>;

  constructor(props: InstructorCreationProps) {
    super();
    this.id = props.id;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
  }

  static create(props: InstructorCreationProps) {
    const instructor = new SqlInstructorEntity(props);
    instructor.raise(
      new InstructorCreatedEvent({
        id: instructor.id.value,
      }),
    );

    return instructor;
  }
}
