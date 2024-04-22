import { LessonId } from './lesson-id.js';
import { DateRange, DateRangeSnapshot } from '../model/date-range.js';
import { CreditPoints } from '../../../auth/domain/model/credit-points.js';
import { InstructorId } from '../../../auth/domain/entities/instructor-id.js';
import { StudentId } from '../../../auth/domain/entities/student-id.js';
import { AggregateRoot } from '../../../shared/lib/aggregate-root.js';

type State = {
  id: LessonId;
  instructorId: InstructorId;
  studentId: StudentId;
  scheduledAt: DateRange;
  creditsConsumed: CreditPoints;
};

type Props = State;

type Snapshot = {
  id: string;
  instructorId: string;
  studentId: string;
  scheduledAt: DateRangeSnapshot;
  creditsConsumed: number;
};

export class Lesson extends AggregateRoot<LessonId, State, Snapshot> {
  static create(props: State): Lesson {
    return new Lesson(props);
  }

  static newLesson(props: Props): Lesson {
    return new Lesson(props);
  }

  takeSnapshot(): Snapshot {
    return {
      id: this._state.id.value,
      instructorId: this._state.instructorId.value,
      studentId: this._state.studentId.value,
      scheduledAt: this._state.scheduledAt.takeSnapshot(),
      creditsConsumed: this._state.creditsConsumed.getValue(),
    };
  }
}
