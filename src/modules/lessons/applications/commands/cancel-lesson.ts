import { z } from 'zod';
import { CommandHandler } from '@nestjs/cqrs';

import { AbstractCommand } from '../../../shared/lib/command.js';
import {
  I_LESSON_REPOSITORY,
  ILessonRepository,
} from '../ports/lesson-repository.js';
import { Inject } from '@nestjs/common';
import { LessonId } from '../../domain/entities/lesson-id.js';
import { NotFoundException } from '../../../shared/exceptions/not-found-exception.js';
import {
  I_STUDENT_REPOSITORY,
  IStudentRepository,
} from '../../../auth/application/ports/student-repository.js';
import { NotAuthorizedException } from '../../../shared/exceptions/not-authorized-exception.js';
import { Lesson } from '../../domain/entities/lesson.js';
import { StudentId } from '../../../auth/domain/entities/student-id.js';
import { AuthContext } from '../../../auth/domain/model/auth-context.js';
import {
  I_DATE_PROVIDER,
  IDateProvider,
} from '../../../shared/services/date-provider/date-provider.interface.js';
import { Student } from '../../../auth/domain/entities/student.js';

export class CancelLessonCommand extends AbstractCommand<{
  lessonId: string;
}> {
  getSchema() {
    return z.object({
      lessonId: z.string(),
    });
  }
}

@CommandHandler(CancelLessonCommand)
export class CancelLessonCommandHandler {
  constructor(
    @Inject(I_LESSON_REPOSITORY)
    private readonly lessonRepository: ILessonRepository,
    @Inject(I_STUDENT_REPOSITORY)
    private readonly studentRepository: IStudentRepository,
    @Inject(I_DATE_PROVIDER)
    private readonly dateProvider: IDateProvider,
  ) {}

  async execute({ auth, props }: CancelLessonCommand) {
    const lesson = await this.getLesson(new LessonId(props.lessonId));
    const student = await this.getStudent(lesson.getStudentId());

    this.checkAuthorization(auth, lesson);
    this.eventuallyRefund(auth, lesson, student);

    await this.lessonRepository.delete(lesson);
    await this.studentRepository.save(student);
  }

  private eventuallyRefund(
    auth: AuthContext,
    lesson: Lesson,
    student: Student,
  ) {
    if (auth.isStudent()) {
      if (!lesson.isRefundableByStudent(this.dateProvider)) {
        return;
      }
    }

    lesson.refund(student);
  }

  private checkAuthorization(auth: AuthContext, lesson: Lesson) {
    if (auth.isInstructor()) {
      this.checkInstructorIsAuthorized(auth, lesson);
    } else if (auth.isStudent()) {
      this.checkIfCancellableByStudent(lesson);
    }
  }

  private checkIfCancellableByStudent(lesson: Lesson) {
    if (!lesson.isCancellableByStudent(this.dateProvider)) {
      throw new NotAuthorizedException('you can no longer cancel this lesson');
    }
  }

  private checkInstructorIsAuthorized(auth: AuthContext, lesson: Lesson) {
    if (!auth.is(lesson.getInstructorId())) {
      throw new NotAuthorizedException();
    }
  }

  private async getStudent(studentId: StudentId) {
    return this.studentRepository
      .findById(studentId)
      .then((q) =>
        q.getOrThrow(
          () => new NotFoundException('Student', studentId.asString()),
        ),
      );
  }

  private async getLesson(lessonId: LessonId) {
    return this.lessonRepository
      .findById(lessonId)
      .then((q) =>
        q.getOrThrow(
          () => new NotFoundException('Lesson', lessonId.asString()),
        ),
      );
  }
}
