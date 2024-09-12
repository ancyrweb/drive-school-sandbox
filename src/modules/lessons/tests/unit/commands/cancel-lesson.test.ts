import { RamLessonRepository } from '../../../infrastructure/persistence/ram/ram-lesson-repository.js';
import {
  CancelLessonCommand,
  CancelLessonCommandHandler,
} from '../../../applications/commands/cancel-lesson.js';
import { AuthSeeds } from '../../../../auth/tests/shared/seeds/auth-seeds.js';
import { LessonBuilder } from '../../shared/factories/lesson-builder.js';
import { LessonId } from '../../../domain/entities/lesson-id.js';
import { RamStudentRepository } from '../../../../auth/infrastructure/persistence/ram/ram-student-repository.js';
import { StudentBuilder } from '../../../../auth/tests/shared/factories/student-builder.js';
import { StudentId } from '../../../../auth/domain/entities/student-id.js';
import { NotAuthorizedException } from '../../../../shared/exceptions/not-authorized-exception.js';
import { IDateProvider } from '../../../../shared/services/date-provider/date-provider.interface.js';
import { FixedDateProvider } from '../../../../shared/services/date-provider/fixed-date-provider.js';

describe('Feature: canceling a lesson', () => {
  const lessonRepository = new RamLessonRepository();
  const studentRepository = new RamStudentRepository();

  const createCommandHandler = (props?: { dateProvider: IDateProvider }) => {
    return new CancelLessonCommandHandler(
      lessonRepository,
      studentRepository,
      props?.dateProvider ??
        new FixedDateProvider(new Date('2024-01-10T10:00:00.000Z')),
    );
  };

  const expectCreditsBalanceToBe = (value: number) => {
    const student = studentRepository.findByIdSync(
      new StudentId('student-id'),
    )!;

    expect(student.getCreditPoints().asNumber()).toBe(value);
  };

  const expectLessonToBeCancelled = () => {
    const lesson = lessonRepository.findByIdSync(new LessonId('lesson-id'));
    expect(lesson).toBe(null);
  };

  beforeEach(() => {
    lessonRepository.clear();
    studentRepository.clear();

    studentRepository.save(
      new StudentBuilder().id('student-id').creditPoints(2).build(),
    );

    lessonRepository.save(
      new LessonBuilder()
        .id('lesson-id')
        .studentId('student-id')
        .instructorId('instructor-id')
        .scheduledAt(
          new Date('2024-01-15T10:00:00.000Z'),
          new Date('2024-01-15T12:00:00.000Z'),
        )
        .creditsConsumed(2)
        .build(),
    );
  });

  describe('Scenario: canceling a lesson as an admin', () => {
    const command = new CancelLessonCommand(AuthSeeds.admin(), {
      lessonId: 'lesson-id',
    });

    it('should cancel the lesson', async () => {
      await createCommandHandler().execute(command);
      expectLessonToBeCancelled();
    });

    it('should refund the student', async () => {
      await createCommandHandler().execute(command);
      expectCreditsBalanceToBe(4);
    });
  });

  describe('Context: as an instructor', () => {
    describe('Scenario: canceling the lesson as the instructor of the lesson', () => {
      const command = new CancelLessonCommand(
        AuthSeeds.instructor('instructor-id'),
        {
          lessonId: 'lesson-id',
        },
      );

      it('should cancel the lesson', async () => {
        await createCommandHandler().execute(command);
        expectLessonToBeCancelled();
      });

      it('should give the points back to the student', async () => {
        await createCommandHandler().execute(command);
        expectCreditsBalanceToBe(4);
      });
    });

    describe('Scenario: canceling the lesson as another instructor', () => {
      const command = new CancelLessonCommand(
        AuthSeeds.instructor('another-id'),
        {
          lessonId: 'lesson-id',
        },
      );

      it('should fail to cancel the lesson', async () => {
        await expect(() =>
          createCommandHandler().execute(command),
        ).rejects.toThrow(NotAuthorizedException);
      });
    });
  });

  describe('Context: as a student', () => {
    describe('Scenario: canceling > 24 hours before the lesson', () => {
      const command = new CancelLessonCommand(AuthSeeds.student('student-id'), {
        lessonId: 'lesson-id',
      });

      const fixedDate = new Date('2024-01-14T09:59:00.000Z');

      it('should cancel the lesson', async () => {
        const commandHandler = createCommandHandler({
          dateProvider: new FixedDateProvider(fixedDate),
        });

        await commandHandler.execute(command);
        expectLessonToBeCancelled();
      });

      it('should refund the student', async () => {
        const commandHandler = createCommandHandler({
          dateProvider: new FixedDateProvider(fixedDate),
        });

        await commandHandler.execute(command);
        expectCreditsBalanceToBe(4);
      });
    });

    describe('Scenario: cancling < 24 hours but > 2 hours', () => {
      const command = new CancelLessonCommand(AuthSeeds.student('student-id'), {
        lessonId: 'lesson-id',
      });

      const fixedDate = new Date('2024-01-14T10:01:00.000Z');

      it('should cancel the lesson', async () => {
        const commandHandler = createCommandHandler({
          dateProvider: new FixedDateProvider(fixedDate),
        });

        await commandHandler.execute(command);
        expectLessonToBeCancelled();
      });

      it('should NOT refund the student', async () => {
        const commandHandler = createCommandHandler({
          dateProvider: new FixedDateProvider(fixedDate),
        });

        await commandHandler.execute(command);
        expectCreditsBalanceToBe(2);
      });
    });

    describe('Scenario: canceling <2 hours before the lesson', () => {
      const command = new CancelLessonCommand(AuthSeeds.student('student-id'), {
        lessonId: 'lesson-id',
      });

      const fixedDate = new Date('2024-01-15T08:01:00.000Z');

      it('should fail', async () => {
        const commandHandler = createCommandHandler({
          dateProvider: new FixedDateProvider(fixedDate),
        });

        await expect(() => commandHandler.execute(command)).rejects.toThrow(
          NotAuthorizedException,
        );
      });
    });
  });
});
