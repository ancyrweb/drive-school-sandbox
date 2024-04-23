import { z } from 'zod';
import { CommandHandler } from '@nestjs/cqrs';
import { startOfDay } from 'date-fns';

import { AbstractCommand } from '../../../shared/lib/command.js';
import { InstructorId } from '../../../auth/domain/entities/instructor-id.js';
import { NotFoundException } from '../../../shared/exceptions/not-found-exception.js';
import { StudentId } from '../../../auth/domain/entities/student-id.js';
import { DateRange } from '../../domain/model/date-range.js';
import { BadRequestException } from '../../../shared/exceptions/bad-request-exception.js';
import { CreditPoints } from '../../../auth/domain/model/credit-points.js';
import { Lesson } from '../../domain/entities/lesson.js';
import { LessonId } from '../../domain/entities/lesson-id.js';
import {
  I_INSTRUCTOR_REPOSITORY,
  IInstructorRepository,
} from '../../../auth/application/ports/instructor-repository.js';
import {
  I_STUDENT_REPOSITORY,
  IStudentRepository,
} from '../../../auth/application/ports/student-repository.js';
import {
  I_SCHEDULE_PROVIDER,
  IScheduleProvider,
} from '../ports/schedule-provider.js';
import {
  I_LESSON_REPOSITORY,
  ILessonRepository,
} from '../ports/lesson-repository.js';
import { AuthContext } from '../../../auth/domain/model/auth-context.js';
import { Inject } from '@nestjs/common';
import { Student } from '../../../auth/domain/entities/student.js';
import { Instructor } from '../../../auth/domain/entities/instructor.js';

export class ReserveLessonCommand extends AbstractCommand<{
  lessonId: string;
  instructorId: string;
  scheduledAt: {
    start: Date;
    end: Date;
  };
}> {
  getSchema() {
    return z.object({
      lessonId: z.string(),
      instructorId: z.string(),
      scheduledAt: z.object({
        start: z.coerce.date(),
        end: z.coerce.date(),
      }),
    });
  }

  /**
   * Only a student can reserve a lesson because it implies
   * consuming credit points
   * @param auth
   * @protected
   */
  protected isAuthorized(auth: AuthContext): boolean {
    return auth.isStudent();
  }
}

@CommandHandler(ReserveLessonCommand)
export class ReserveLessonCommandHandler {
  constructor(
    @Inject(I_INSTRUCTOR_REPOSITORY)
    private readonly instructorRepository: IInstructorRepository,
    @Inject(I_STUDENT_REPOSITORY)
    private readonly studentRepository: IStudentRepository,
    @Inject(I_SCHEDULE_PROVIDER)
    private readonly scheduleProvider: IScheduleProvider,
    @Inject(I_LESSON_REPOSITORY)
    private readonly lessonRepository: ILessonRepository,
  ) {}

  async execute({ auth, props }: ReserveLessonCommand) {
    const instructor = await this.findInstructor(
      new InstructorId(props.instructorId),
    );
    const student = await this.findStudent(auth.getStudentId());

    const dayOfLesson = startOfDay(props.scheduledAt.start);
    const range = new DateRange(props.scheduledAt.start, props.scheduledAt.end);
    const creditsToConsume = new CreditPoints(range.duration().asHours());

    await this.checkInstructorSchedule(instructor, dayOfLesson, range);
    await this.checkStudentSchedule(student, dayOfLesson, range);
    this.checkStudentsCredits(student, creditsToConsume);

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

  private checkStudentsCredits(
    student: Student,
    creditsToConsume: CreditPoints,
  ) {
    if (!student.canConsume(creditsToConsume)) {
      throw new BadRequestException(
        "You don't have enough points to schedule this lesson",
      );
    }
  }

  private async checkStudentSchedule(
    student: Student,
    dayOfLesson: Date,
    range: DateRange,
  ) {
    const studentSchedule = await this.scheduleProvider.findAtDay(
      student.getId(),
      dayOfLesson,
    );

    if (!studentSchedule.isAvailable(range)) {
      throw new BadRequestException('Student is not available');
    }
  }

  private async checkInstructorSchedule(
    instructor: Instructor,
    dayOfLesson: Date,
    range: DateRange,
  ) {
    const instructorSchedule = await this.scheduleProvider.findAtDay(
      instructor.getId(),
      dayOfLesson,
    );

    if (!instructorSchedule.isAvailable(range)) {
      throw new BadRequestException('Instructor is not available');
    }
  }

  private findInstructor(id: InstructorId) {
    return this.instructorRepository
      .findById(id)
      .then((q) =>
        q.getOrThrow(() => new NotFoundException('Instructor', id.asString())),
      );
  }

  private findStudent(id: StudentId) {
    return this.studentRepository
      .findById(id)
      .then((q) =>
        q.getOrThrow(() => new NotFoundException('Student', id.asString())),
      );
  }
}
