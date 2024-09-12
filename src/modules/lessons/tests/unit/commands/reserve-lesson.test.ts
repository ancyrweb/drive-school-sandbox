import { RamInstructorRepository } from '../../../../auth/infrastructure/persistence/ram/ram-instructor-repository.js';
import { RamStudentRepository } from '../../../../auth/infrastructure/persistence/ram/ram-student-repository.js';
import { RamLessonRepository } from '../../../infrastructure/persistence/ram/ram-lesson-repository.js';
import {
  ReserveLessonCommand,
  ReserveLessonCommandHandler,
} from '../../../applications/commands/reserve-lesson.js';
import { IScheduleProvider } from '../../../applications/ports/schedule-provider.js';
import { BrandedId } from '../../../../shared/lib/id.js';
import { InstructorBuilder } from '../../../../auth/tests/shared/factories/instructor-builder.js';
import { InstructorId } from '../../../../auth/domain/entities/instructor-id.js';
import { StudentBuilder } from '../../../../auth/tests/shared/factories/student-builder.js';
import { StudentId } from '../../../../auth/domain/entities/student-id.js';
import { AuthSeeds } from '../../../../auth/tests/shared/seeds/auth-seeds.js';
import { CreditPoints } from '../../../../auth/domain/model/credit-points.js';
import { LessonId } from '../../../domain/entities/lesson-id.js';
import {
  expectEventToBeRaised,
  expectNotFound,
} from '../../../../shared/utils/test-utils.js';
import { BadRequestException } from '../../../../shared/exceptions/bad-request-exception.js';
import { ISchedule } from '../../../domain/model/schedule.interface.js';
import { GetCommandPayload } from '../../../../shared/lib/command.js';
import { LessonReservedEvent } from '../../../domain/events/lesson-reserved-event.js';

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
    const student = studentRepository.findByIdSync(new StudentId(studentId))!;

    expect(student?.getCreditPoints().asNumber()).toEqual(credits);
  };

  const expectLessonToBeReserved = () => {
    const lesson = lessonRepository.findByIdSync(new LessonId('lesson-id'))!;
    const snapshot = lesson.takeSnapshot();

    expect(snapshot.instructorId).toEqual('instructor-id');
    expect(snapshot.studentId).toEqual('student-id');
    expect(snapshot.scheduledAt.start).toEqual(
      new Date('2021-01-01T10:00:00Z'),
    );
    expect(snapshot.scheduledAt.end).toEqual(new Date('2021-01-01T12:00:00Z'));
    expect(snapshot.creditsConsumed).toEqual(2);

    expectEventToBeRaised(
      lesson.getEvents(),
      new LessonReservedEvent({
        lessonId: 'lesson-id',
        instructorId: 'instructor-id',
        studentId: 'student-id',
        scheduledAt: {
          start: new Date('2021-01-01T10:00:00Z'),
          end: new Date('2021-01-01T12:00:00Z'),
        },
        creditsConsumed: 2,
      }),
    );
  };

  beforeEach(() => {
    instructorRepository.clear();
    studentRepository.clear();
    lessonRepository.clear();

    instructorRepository.saveSync(
      new InstructorBuilder().id('instructor-id').build(),
    );
  });

  describe('Scenario: reserving the lesson', () => {
    const command = createCommand();

    beforeEach(() => {
      studentRepository.saveSync(
        new StudentBuilder().id('student-id').creditPoints(4).build(),
      );
    });

    it('should reserve the lesson', async () => {
      const commandHandler = createCommandHandler({
        scheduleProvider: new SlackerScheduleProvider(),
      });

      await commandHandler.execute(command);
      expectLessonToBeReserved();
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
        new StudentBuilder().id('student-id').creditPoints(4).build(),
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
        new StudentBuilder().id('student-id').creditPoints(1).build(),
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
        new StudentBuilder().id('student-id').creditPoints(4).build(),
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
