import { DomainEvent } from '../../../shared/lib/domain-event.js';

export class LessonReservedEvent extends DomainEvent<{
  lessonId: string;
  instructorId: string;
  studentId: string;
  scheduledAt: {
    start: Date;
    end: Date;
  };
  creditsConsumed: number;
}> {}
