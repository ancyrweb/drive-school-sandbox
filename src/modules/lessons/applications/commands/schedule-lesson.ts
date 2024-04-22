import { AbstractCommand } from '../../../shared/lib/command.js';
import { z } from 'zod';
import { CommandHandler } from '@nestjs/cqrs';
import { InstructorId } from '../../../auth/domain/entities/instructor-id.js';
import { NotFoundException } from '../../../shared/exceptions/not-found-exception.js';
import { StudentId } from '../../../auth/domain/entities/student-id.js';
import { startOfDay } from 'date-fns';
import { DateRange } from '../../../shared/domain/date-range.js';
import { BadRequestException } from '../../../shared/exceptions/bad-request-exception.js';
import { CreditPoints } from '../../../auth/domain/model/credit-points.js';
import { Lesson } from '../../domain/entities/lesson.js';
import { LessonId } from '../../domain/entities/lesson-id.js';
import { IInstructorRepository } from '../../../auth/application/ports/instructor-repository.js';
import { IStudentRepository } from '../../../auth/application/ports/student-repository.js';
import { IScheduleService } from '../services/schedule-service/schedule-service.interface.js';
import { ILessonRepository } from '../ports/lesson-repository.js';

export class ScheduleLessonCommand extends AbstractCommand<{
  lessonId: string;
  instructorId: string;
  studentId: string;
  scheduledAt: {
    start: Date;
    end: Date;
  };
}> {
  getSchema() {
    return z.object({
      lessonId: z.string(),
      instructorId: z.string(),
      studentId: z.string(),
      scheduledAt: z.object({
        start: z.coerce.date(),
        end: z.coerce.date(),
      }),
    });
  }
}

@CommandHandler(ScheduleLessonCommand)
export class ScheduleLessonCommandHandler {
  constructor(
    private readonly instructorRepository: IInstructorRepository,
    private readonly studentRepository: IStudentRepository,
    private readonly scheduleService: IScheduleService,
    private readonly lessonRepository: ILessonRepository,
  ) {}

  async execute({ auth, props }: ScheduleLessonCommand) {
    const instructor = await this.findInstructor(props.instructorId);
    const student = await this.findStudent(props.studentId);

    // TODO : make auth checks, namely :
    // Only the student can schedule a lesson for himself
    // The instructor can schedule a lesson for any student
    // Admin can schedule a lesson for any student & any instructor

    const dayOfLesson = startOfDay(props.scheduledAt.start);
    const range = new DateRange(props.scheduledAt.start, props.scheduledAt.end);
    const creditsToConsume = new CreditPoints(range.duration().asHours());

    const instructorSchedule = await this.scheduleService.findAtDay(
      instructor.getId(),
      dayOfLesson,
    );

    const studentSchedule = await this.scheduleService.findAtDay(
      student.getId(),
      dayOfLesson,
    );

    if (!instructorSchedule.isAvailable(range)) {
      throw new BadRequestException('Instructor is not available');
    }

    if (!studentSchedule.isAvailable(range)) {
      throw new BadRequestException('Student is not available');
    }

    if (!student.canConsume(creditsToConsume)) {
      throw new BadRequestException(
        "You don't have enough points to schedule this lesson",
      );
    }

    const lesson = Lesson.newLesson({
      id: new LessonId(props.lessonId),
      instructorId: instructor.getId(),
      studentId: student.getId(),
      scheduledAt: range,
      creditsConsumed: creditsToConsume,
    });

    student.consume(creditsToConsume);

    await this.lessonRepository.save(lesson);
    await this.studentRepository.save(student);
  }

  private findInstructor(instructorId: string) {
    return this.instructorRepository
      .findById(new InstructorId(instructorId))
      .then((q) =>
        q.getOrThrow(() => new NotFoundException('Instructor', instructorId)),
      );
  }

  private findStudent(studentId: string) {
    return this.studentRepository
      .findById(new StudentId(studentId))
      .then((q) =>
        q.getOrThrow(() => new NotFoundException('Student', studentId)),
      );
  }
}
