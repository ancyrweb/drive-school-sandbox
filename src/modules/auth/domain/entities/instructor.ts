import { AggregateRoot } from '../../../shared/lib/aggregate-root.js';
import { InstructorId } from './instructor-id.js';

type State = {
  id: InstructorId;
  firstName: string;
  lastName: string;
};

type Snapshot = {
  id: string;
  firstName: string;
  lastName: string;
};

export class Instructor extends AggregateRoot<InstructorId, State, Snapshot> {
  takeSnapshot(): Snapshot {
    return {
      id: this._state.id.value,
      firstName: this._state.firstName,
      lastName: this._state.lastName,
    };
  }
}
