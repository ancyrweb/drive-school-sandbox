import { RamInstructorRepository } from '../../infrastructure/persistence/ram/ram-instructor-repository.js';
import { InstructorId } from '../../domain/entities/instructor-id.js';
import { Instructor } from '../../domain/entities/instructor-entity.js';
import {
  RenameInstructorCommand,
  RenameInstructorCommandHandler,
} from './rename-instructor.js';
import { InstructorRenamedEvent } from '../../domain/events/InstructorRenamedEvent.js';
import { expectEventToBeRaised } from '../../../shared/tests.js';
import { AuthSeeds } from '../../../auth/tests/seeds/auth-seeds.js';

describe('Feature: renaming an instructor', () => {
  const instructorRepository = new RamInstructorRepository();
  const commandHandler = new RenameInstructorCommandHandler(
    instructorRepository,
  );

  beforeEach(() => {
    instructorRepository.clear();

    const instructor = new Instructor({
      id: new InstructorId('instructor'),
      firstName: 'John',
      lastName: 'Doe',
    });

    instructorRepository.createSync(instructor);
  });

  describe('Scenario: happy path', () => {
    it('should rename the instructor', async () => {
      const command = new RenameInstructorCommand(AuthSeeds.admin(), {
        instructorId: 'instructor',
        payload: {
          firstName: 'Jack',
          lastName: 'Daniels',
        },
      });

      await commandHandler.execute(command);

      const instructor = instructorRepository.findByIdSync(
        new InstructorId('instructor'),
      )!;

      expect(instructor.firstName).toEqual('Jack');
      expect(instructor.lastName).toEqual('Daniels');

      expectEventToBeRaised(
        instructor,
        new InstructorRenamedEvent({
          instructorId: 'instructor',
          firstName: 'Jack',
          lastName: 'Daniels',
        }),
      );
    });
  });

  describe('Scenario: instructor does not exist', () => {
    it('should fail', async () => {
      const command = new RenameInstructorCommand(AuthSeeds.admin(), {
        instructorId: '123',
        payload: {
          firstName: 'Jonathan',
          lastName: 'Wick',
        },
      });

      await expect(() => commandHandler.execute(command)).rejects.toThrow(
        'Instructor with id 123 not found',
      );
    });
  });
});
