import { AggregateRoot } from '../../../shared/lib/aggregate-root.js';
import { InstructorId } from './instructor-id.js';
import { InstructorCreatedEvent } from '../events/instructor-created-event.js';
import { InstructorUpdatedEvent } from '../events/instructor-updated-event.js';

type State = {
  id: InstructorId;
  firstName: string;
  lastName: string;
};

type Props = State;

type Snapshot = {
  id: string;
  firstName: string;
  lastName: string;
};

export class Instructor extends AggregateRoot<InstructorId, State, Snapshot> {
  static create(props: Props): Instructor {
    return new Instructor(props);
  }

  static newAccount(props: Props): Instructor {
    const instructor = new Instructor(props);
    instructor.raise(new InstructorCreatedEvent(instructor.takeSnapshot()));

    return instructor;
  }

  takeSnapshot(): Snapshot {
    return {
      id: this._state.id.value,
      firstName: this._state.firstName,
      lastName: this._state.lastName,
    };
  }

  update(props: { firstName: string; lastName: string }) {
    this._state.firstName = props.firstName;
    this._state.lastName = props.lastName;

    this.raise(
      new InstructorUpdatedEvent({
        id: this._state.id.value,
        newFirstName: this._state.firstName,
        newLastName: this._state.lastName,
      }),
    );
  }
}
