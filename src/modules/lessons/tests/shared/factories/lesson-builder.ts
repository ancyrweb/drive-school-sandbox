import { GetFactoryProps } from '../../../../shared/utils/types.js';
import { Lesson } from '../../../domain/entities/lesson.js';
import { LessonId } from '../../../domain/entities/lesson-id.js';
import { StudentId } from '../../../../auth/domain/entities/student-id.js';
import { InstructorId } from '../../../../auth/domain/entities/instructor-id.js';
import { DateRange } from '../../../domain/model/date-range.js';
import { CreditPoints } from '../../../../auth/domain/model/credit-points.js';

type Props = GetFactoryProps<typeof Lesson>;

export class LessonBuilder {
  private props: Props;

  constructor(props?: Partial<Props>) {
    this.props = {
      id: new LessonId(),
      instructorId: new InstructorId(),
      studentId: new StudentId(),
      scheduledAt: new DateRange(
        new Date('2024-01-01T10:00:00Z'),
        new Date('2024-01-01T12:00:00Z'),
      ),
      creditsConsumed: new CreditPoints(2),
    };
  }

  id(id: string) {
    this.props.id = new LessonId(id);
    return this;
  }

  instructorId(id: string) {
    this.props.instructorId = new InstructorId(id);
    return this;
  }

  studentId(id: string) {
    this.props.studentId = new StudentId(id);
    return this;
  }

  scheduledAt(start: Date, end: Date) {
    this.props.scheduledAt = new DateRange(start, end);
    return this;
  }

  creditsConsumed(credits: number) {
    this.props.creditsConsumed = new CreditPoints(credits);
    return this;
  }

  build() {
    return Lesson.create(this.props);
  }
}
