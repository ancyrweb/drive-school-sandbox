import { AggregateRoot } from '../../../shared/lib/aggregate-root.js';
import { StudentId } from './student-id.js';
import { StudentCreatedEvent } from '../events/student-created-event.js';
import { CreditPoints } from '../model/credit-points.js';

type State = {
  id: StudentId;
  firstName: string;
  lastName: string;
  creditPoints: CreditPoints;
};

type Props = State;

type Snapshot = {
  id: string;
  firstName: string;
  lastName: string;
  creditPoints: number;
};

export class Student extends AggregateRoot<StudentId, State, Snapshot> {
  static create(props: Props): Student {
    return new Student(props);
  }

  static newAccount(props: Props): Student {
    const student = new Student(props);
    student.raise(new StudentCreatedEvent(student.takeSnapshot()));

    return student;
  }

  takeSnapshot(): Snapshot {
    return {
      id: this._state.id.value,
      firstName: this._state.firstName,
      lastName: this._state.lastName,
      creditPoints: this._state.creditPoints.asNumber(),
    };
  }

  canConsume(value: CreditPoints): boolean {
    return this._state.creditPoints.canConsume(value);
  }

  pay(value: CreditPoints): void {
    this._state.creditPoints = this._state.creditPoints.subtract(value);
  }

  refund(value: CreditPoints): void {
    this._state.creditPoints = this._state.creditPoints.add(value);
  }

  getCreditPoints() {
    return this._state.creditPoints;
  }
}
