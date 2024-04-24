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
    // Fetch the lesson
    // Three cases :
    // The requester is an admin, he can cancel any lesson
    // The requester is an instructor, he can cancel the lesson if he is the instructor of the lesson
    // The requester is a student, he can cancel the lesson if he is the student of the lesson
    // Then we must 1) cancel the lesson and 2) give back the credits
    // Note : if the requester is a student AND the lesson is in <24 hours, the credits are not given back
    // Note : the admin and instructor can cancel the lesson at any time
    // Note : the student can only cancel the lesson 2 hours before the lesson

    const lesson = await this.getLesson(new LessonId(props.lessonId));

    if (auth.isInstructor()) {
      this.checkInstructorIsAuthorized(auth, lesson);
    }
    const student = await this.getStudent(lesson.getStudentId());

    if (auth.isStudent()) {
      if (!lesson.isCancellableByStudent(this.dateProvider)) {
        throw new NotAuthorizedException();
      }

      if (lesson.isRefundableByStudent(this.dateProvider)) {
        lesson.refund(student);
      }
    } else {
      lesson.refund(student);
    }

    await this.lessonRepository.delete(lesson);
    await this.studentRepository.save(student);
  }

  private checkInstructorIsAuthorized(auth: AuthContext, lesson: Lesson) {
    if (!auth.is(lesson.getInstructorId())) {
      throw new NotAuthorizedException();
    }
  }

  private async getStudent(studentId: StudentId) {
    return await this.studentRepository
      .findById(studentId)
      .then((q) =>
        q.getOrThrow(
          () => new NotFoundException('Student', studentId.asString()),
        ),
      );
  }

  private async getLesson(lessonId: LessonId) {
    return await this.lessonRepository
      .findById(lessonId)
      .then((q) =>
        q.getOrThrow(
          () => new NotFoundException('Lesson', lessonId.asString()),
        ),
      );
  }
}
