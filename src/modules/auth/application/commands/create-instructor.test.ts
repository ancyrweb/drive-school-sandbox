import { RamInstructorRepository } from '../../infrastructure/persistence/ram/ram-instructor-repository.js';
import { Argon2Strategy } from '../services/password-strategy/argon2-strategy.js';
import {
  CreateInstructor,
  CreateInstructorCommandHandler,
} from './create-instructor.js';
import { AuthSeeds } from '../../tests/seeds/auth-seeds.js';
import { Role } from '../../domain/model/role.js';
import { BadRequestException } from '../../../shared/exceptions/bad-request-exception.js';
import { IApiKeyGenerator } from '../services/apikey-generator/apikey-generator.interface.js';
import { Instructor } from '../../domain/entities/instructor-entity.js';
import { ApikeyEntity } from '../../domain/entities/apikey-entity.js';
import { InstructorId } from '../../domain/entities/instructor-id.js';

class StubApiKeyGenerator implements IApiKeyGenerator {
  static VALUE = '123456';

  async generate() {
    return ApikeyEntity.generate(StubApiKeyGenerator.VALUE);
  }
}

describe('Feature: creating a user', () => {
  const instructorRepository = new RamInstructorRepository();
  const passwordStrategy = new Argon2Strategy();
  const apiKeyGenerator = new StubApiKeyGenerator();

  const commandHandler = new CreateInstructorCommandHandler(
    instructorRepository,
    passwordStrategy,
    apiKeyGenerator,
  );

  beforeEach(() => {
    instructorRepository.clear();
  });

  describe('Scenario: happy path', () => {
    const command = new CreateInstructor(AuthSeeds.admin(), {
      emailAddress: 'johndoe@gmail.com',
      password: 'azerty123',
      role: 'ADMIN',
      firstName: 'John',
      lastName: 'Doe',
    });

    it('should create a new user', async () => {
      const result = await commandHandler.execute(command);
      const user = instructorRepository.findByIdSync(
        new InstructorId(result.id),
      )!;

      expect(user).not.toBeNull();
      expect(user.role).toEqual(Role.ADMIN);
      expect(user.emailAddress).toEqual('johndoe@gmail.com');
    });

    it('should generate an apikey', async () => {
      const result = await commandHandler.execute(command);
      const user = instructorRepository.findByIdSync(
        new InstructorId(result.id),
      )!;
      expect(user.apiKey.value).toBe(StubApiKeyGenerator.VALUE);
    });

    it('should generate an apikey', async () => {
      const result = await commandHandler.execute(command);
      const user = instructorRepository.findByIdSync(
        new InstructorId(result.id),
      )!;

      const isValid = await passwordStrategy.equals('azerty123', user.password);
      expect(isValid).toBe(true);
    });
  });

  describe('Scenario: the e-mail address is already taken', () => {
    beforeEach(() => {
      instructorRepository.createSync(
        Instructor.create({
          id: new InstructorId(),
          emailAddress: 'johndoe@gmail.com',
          password: 'azerty123',
          apiKey: ApikeyEntity.generate('123456'),
          role: Role.ADMIN,
          firstName: 'John',
          lastName: 'Doe',
        }),
      );
    });

    it('should fail', async () => {
      const command = new CreateInstructor(AuthSeeds.admin(), {
        emailAddress: 'johndoe@gmail.com',
        password: 'azerty123',
        role: 'ADMIN',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(() => commandHandler.execute(command)).rejects.toThrow(
        new BadRequestException('Email address is already taken'),
      );
    });
  });
});
