import { RamInstructorRepository } from '../../infrastructure/persistence/ram/ram-instructor-repository.js';
import { InstructorId } from '../../domain/entities/instructor-id.js';
import { Instructor } from '../../domain/entities/instructor-entity.js';
import { AuthSeeds } from '../../../auth/tests/seeds/auth-seeds.js';
import {
  DeleteInstructorCommand,
  DeleteInstructorCommandHandler,
} from './delete-instructor.js';

describe('Feature: deleting an instructor', () => {
  const instructorRepository = new RamInstructorRepository();
  const commandHandler = new DeleteInstructorCommandHandler(
    instructorRepository,
  );

  beforeEach(() => {
    instructorRepository.clear();

    const instructor = Instructor.create({
      id: new InstructorId('instructor'),
      firstName: 'John',
      lastName: 'Doe',
    });

    instructorRepository.createSync(instructor);
  });

  describe('Scenario: happy path', () => {
    it('should delete the instructor', async () => {
      const command = new DeleteInstructorCommand(AuthSeeds.admin(), {
        instructorId: 'instructor',
      });

      await commandHandler.execute(command);

      const instructor = instructorRepository.findByIdSync(
        new InstructorId('instructor'),
      )!;

      expect(instructor).toBeNull();
    });
  });

  describe('Scenario: instructor does not exist', () => {
    it('should fail', async () => {
      const command = new DeleteInstructorCommand(AuthSeeds.admin(), {
        instructorId: '123',
      });

      await expect(() => commandHandler.execute(command)).rejects.toThrow(
        'Instructor with id 123 not found',
      );
    });
  });
});
