import { RamInstructorRepository } from '../../infrastructure/persistence/ram/ram-instructor-repository.js';
import {
  CreateInstructorCommand,
  CreateInstructorCommandHandler,
} from './create-instructor.js';
import { InstructorId } from '../../domain/entities/instructor-id.js';
import { AuthSeeds } from '../../../auth/tests/seeds/auth-seeds.js';

describe('Feature: creating an instructor', () => {
  const instructorRepository = new RamInstructorRepository();
  const commandHandler = new CreateInstructorCommandHandler(
    instructorRepository,
  );

  beforeEach(() => {
    instructorRepository.clear();
  });

  describe('Scenario: happy path', () => {
    it('should save the instructor', async () => {
      const command = new CreateInstructorCommand(AuthSeeds.admin(), {
        firstName: 'John',
        lastName: 'Doe',
      });

      const result = await commandHandler.execute(command);

      const instructor = instructorRepository.findByIdSync(
        new InstructorId(result.id),
      )!;

      expect(instructor).not.toBeNull();

      expect(instructor.firstName).toEqual('John');
      expect(instructor.lastName).toEqual('Doe');
    });
  });
});
