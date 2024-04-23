import { RamInstructorRepository } from '../../../auth/infrastructure/persistence/ram/ram-instructor-repository.js';
import { RamStudentRepository } from '../../../auth/infrastructure/persistence/ram/ram-student-repository.js';
import { RamLessonRepository } from '../../infrastructure/persistence/ram/ram-lesson-repository.js';
import {
  ReserveLessonCommand,
  ReserveLessonCommandHandler,
} from './reserve-lesson.js';
import { IScheduleProvider } from '../ports/schedule-provider.js';
import { BrandedId } from '../../../shared/lib/id.js';
import { InstructorBuilder } from '../../../auth/tests/factories/instructor-builder.js';
import { InstructorId } from '../../../auth/domain/entities/instructor-id.js';
import { StudentBuilder } from '../../../auth/tests/factories/student-builder.js';
import { StudentId } from '../../../auth/domain/entities/student-id.js';
import { AuthSeeds } from '../../../auth/tests/seeds/auth-seeds.js';
import { CreditPoints } from '../../../auth/domain/model/credit-points.js';
import { LessonId } from '../../domain/entities/lesson-id.js';
import { expectNotFound } from '../../../shared/utils/test-utils.js';
import { BadRequestException } from '../../../shared/exceptions/bad-request-exception.js';
import { ISchedule } from '../../domain/model/schedule.interface.js';
import { GetCommandPayload } from '../../../shared/lib/command.js';

class NeverAvailableSchedule implements ISchedule {
  isAvailable(): boolean {
    return false;
  }
}

class AlwaysAvailableSchedule implements ISchedule {
  isAvailable(): boolean {
    return true;
  }
}

class SlackerScheduleProvider implements IScheduleProvider {
  async findAtDay(): Promise<ISchedule> {
    return new AlwaysAvailableSchedule();
  }
}

class BusyInstructorFreeStudentScheduleProvider implements IScheduleProvider {
  async findAtDay(accountId: BrandedId<any>): Promise<ISchedule> {
    return accountId instanceof InstructorId
      ? new NeverAvailableSchedule()
      : new AlwaysAvailableSchedule();
  }
}

class FreeInstructorBusyStudentScheduleProvider implements IScheduleProvider {
  async findAtDay(accountId: BrandedId<any>): Promise<ISchedule> {
    return accountId instanceof StudentId
      ? new NeverAvailableSchedule()
      : new AlwaysAvailableSchedule();
  }
}

describe('Feature: reserving a lesson', () => {
  const instructorRepository = new RamInstructorRepository();
  const studentRepository = new RamStudentRepository();
  const lessonRepository = new RamLessonRepository();

  const createCommandHandler = ({
    scheduleProvider,
  }: {
    scheduleProvider: IScheduleProvider;
  }) => {
    return new ReserveLessonCommandHandler(
      instructorRepository,
      studentRepository,
      scheduleProvider,
      lessonRepository,
    );
  };

  const createCommand = (
    props?: Partial<GetCommandPayload<ReserveLessonCommand>>,
  ) =>
    new ReserveLessonCommand(AuthSeeds.student('student-id'), {
      lessonId: 'lesson-id',
      instructorId: 'instructor-id',
      scheduledAt: {
        start: new Date('2021-01-01T10:00:00Z'),
        end: new Date('2021-01-01T12:00:00Z'),
      },
      ...props,
    });

  const expectRemainingCredits = (studentId: string, credits: number) => {
    const student = studentRepository
      .findByIdSync(new StudentId(studentId))!
      .takeSnapshot();

    expect(student.creditPoints).toEqual(credits);
  };

  beforeEach(() => {
    instructorRepository.clear();
    studentRepository.clear();
    lessonRepository.clear();

    instructorRepository.saveSync(
      new InstructorBuilder({ id: new InstructorId('instructor-id') }).build(),
    );
  });

  describe('Scenario: reserving the lesson', () => {
    const command = createCommand();

    beforeEach(() => {
      studentRepository.saveSync(
        new StudentBuilder({
          id: new StudentId('student-id'),
          creditPoints: new CreditPoints(4),
        }).build(),
      );
    });

    it('should reserve the lesson', async () => {
      const commandHandler = createCommandHandler({
        scheduleProvider: new SlackerScheduleProvider(),
      });

      await commandHandler.execute(command);

      const lesson = lessonRepository
        .findByIdSync(new LessonId('lesson-id'))!
        .takeSnapshot();

      expect(lesson.instructorId).toEqual('instructor-id');
      expect(lesson.studentId).toEqual('student-id');
      expect(lesson.scheduledAt.start).toEqual('2021-01-01T10:00:00.000Z');
      expect(lesson.scheduledAt.end).toEqual('2021-01-01T12:00:00.000Z');
      expect(lesson.creditsConsumed).toEqual(2);
    });

    it('should deduce the points from the students credit', async () => {
      const commandHandler = createCommandHandler({
        scheduleProvider: new SlackerScheduleProvider(),
      });

      await commandHandler.execute(command);

      expectRemainingCredits('student-id', 2);
    });
  });

  describe('Scenario: the instructor does not exist', () => {
    beforeEach(() => {
      studentRepository.saveSync(
        new StudentBuilder({
          id: new StudentId('student-id'),
          creditPoints: new CreditPoints(4),
        }).build(),
      );
    });

    it('should fail', async () => {
      const commandHandler = createCommandHandler({
        scheduleProvider: new SlackerScheduleProvider(),
      });

      const command = createCommand({
        instructorId: 'not-an-instructor',
      });

      expectNotFound(() => commandHandler.execute(command));
    });
  });

  describe('Scenario: the student does not have enough credit', () => {
    beforeEach(() => {
      studentRepository.saveSync(
        new StudentBuilder({
          id: new StudentId('student-id'),
          creditPoints: new CreditPoints(1),
        }).build(),
      );
    });

    it('should fail', async () => {
      const commandHandler = createCommandHandler({
        scheduleProvider: new SlackerScheduleProvider(),
      });

      const command = createCommand();

      await expect(() => commandHandler.execute(command)).rejects.toThrow(
        new BadRequestException(
          "You don't have enough points to schedule this lesson",
        ),
      );
    });
  });

  describe('Scenario: the instructor is busy', () => {
    beforeEach(() => {
      studentRepository.saveSync(
        new StudentBuilder({
          id: new StudentId('student-id'),
          creditPoints: new CreditPoints(4),
        }).build(),
      );
    });

    it('should fail', async () => {
      const commandHandler = createCommandHandler({
        scheduleProvider: new BusyInstructorFreeStudentScheduleProvider(),
      });

      const command = createCommand();

      await expect(() => commandHandler.execute(command)).rejects.toThrow(
        new BadRequestException('Instructor is not available'),
      );
    });
  });

  describe('Scenario: the student is busy', () => {
    beforeEach(() => {
      studentRepository.saveSync(
        new StudentBuilder({
          id: new StudentId('student-id'),
          creditPoints: new CreditPoints(4),
        }).build(),
      );
    });

    it('should fail', async () => {
      const commandHandler = createCommandHandler({
        scheduleProvider: new FreeInstructorBusyStudentScheduleProvider(),
      });

      const command = createCommand();

      await expect(() => commandHandler.execute(command)).rejects.toThrow(
        new BadRequestException('Student is not available'),
      );
    });
  });
});
