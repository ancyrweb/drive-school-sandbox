import { LessonId } from './lesson-id.js';
import { DateRange, DateRangeSnapshot } from '../model/date-range.js';
import { CreditPoints } from '../../../auth/domain/model/credit-points.js';
import { InstructorId } from '../../../auth/domain/entities/instructor-id.js';
import { StudentId } from '../../../auth/domain/entities/student-id.js';
import { AggregateRoot } from '../../../shared/lib/aggregate-root.js';
import { Student } from '../../../auth/domain/entities/student.js';
import { IDateProvider } from '../../../shared/services/date-provider/date-provider.interface.js';
import { Seconds } from '../../../shared/domain/seconds.js';
import { LessonReservedEvent } from '../events/lesson-reserved-event.js';

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

  static reserve(props: Props): Lesson {
    const lesson = new Lesson(props);
    lesson.raise(
      new LessonReservedEvent({
        lessonId: lesson._state.id.asString(),
        instructorId: lesson._state.instructorId.asString(),
        studentId: lesson._state.studentId.asString(),
        scheduledAt: lesson._state.scheduledAt.takeSnapshot(),
        creditsConsumed: lesson._state.creditsConsumed.getValue(),
      }),
    );
    return lesson;
  }

  getStudentId(): StudentId {
    return this._state.studentId;
  }

  getInstructorId(): InstructorId {
    return this._state.instructorId;
  }

  refund(student: Student) {
    student.refund(this._state.creditsConsumed);
  }

  isRefundableByStudent(dateProvider: IDateProvider): boolean {
    const startsIn = this._state.scheduledAt.startsIn(dateProvider.now());
    return !startsIn.isLessThan(Seconds.hours(24));
  }

  isCancellableByStudent(dateProvider: IDateProvider): boolean {
    const startsIn = this._state.scheduledAt.startsIn(dateProvider.now());
    return !startsIn.isLessThan(Seconds.hours(2));
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
