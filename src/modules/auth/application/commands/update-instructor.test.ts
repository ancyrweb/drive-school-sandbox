import { RamInstructorRepository } from '../../infrastructure/persistence/ram/ram-instructor-repository.js';
import {
  UpdateInstructorCommand,
  UpdateInstructorCommandHandler,
} from './update-instructor.js';
import { InstructorBuilder } from '../../tests/factories/instructor-builder.js';
import { InstructorId } from '../../domain/entities/instructor-id.js';
import { AuthSeeds } from '../../tests/seeds/auth-seeds.js';
import {
  expectEventToBeRaised,
  expectNotAuthorized,
  expectNotFound,
} from '../../../shared/utils/test-utils.js';
import { InstructorUpdatedEvent } from '../../domain/events/instructor-updated-event.js';

describe('Feature: updating an instructor', () => {
  const instructorRepository = new RamInstructorRepository();
  const commandHandler = new UpdateInstructorCommandHandler(
    instructorRepository,
  );

  const payload = {
    firstName: 'Jonathan',
    lastName: 'Wick',
  };

  beforeEach(() => {
    instructorRepository.clearSync();
    instructorRepository.saveSync(
      new InstructorBuilder({
        id: new InstructorId('johndoe'),
        firstName: 'John',
        lastName: 'Doe',
      }).build(),
    );
  });

  describe.each([AuthSeeds.instructor('johndoe'), AuthSeeds.admin('an-admin')])(
    'Scenario: updating the instructor with an authorized profile',
    (auth) => {
      const command = new UpdateInstructorCommand(auth, {
        instructorId: 'johndoe',
        payload,
      });

      it('should update the instructor', async () => {
        await commandHandler.execute(command);

        const instructor = instructorRepository
          .findByIdSync(new InstructorId('johndoe'))!
          .takeSnapshot();

        expect(instructor.firstName).toBe('Jonathan');
        expect(instructor.lastName).toBe('Wick');
      });

      it('should raise an event', async () => {
        await commandHandler.execute(command);

        const instructor = instructorRepository.findByIdSync(
          new InstructorId('johndoe'),
        )!;

        expectEventToBeRaised(
          instructor.getEvents(),
          new InstructorUpdatedEvent({
            id: 'johndoe',
            newFirstName: 'Jonathan',
            newLastName: 'Wick',
          }),
        );
      });
    },
  );

  describe('Scenario: another instructor is trying to update the profile', () => {
    const command = new UpdateInstructorCommand(
      AuthSeeds.instructor('who-is-this?'),
      {
        instructorId: 'johndoe',
        payload,
      },
    );

    it('should reject', async () => {
      await expectNotAuthorized(() => commandHandler.execute(command));
    });
  });

  describe('Scenario: the instructor does not exist', () => {
    const command = new UpdateInstructorCommand(
      AuthSeeds.instructor('johndoe'),
      {
        instructorId: 'who-is-that?',
        payload,
      },
    );

    it('should reject', async () => {
      await expectNotFound(() => commandHandler.execute(command));
    });
  });
});
