import { RamInstructorRepository } from '../../infrastructure/persistence/ram/ram-instructor-repository.js';
import { Argon2Strategy } from '../services/password-strategy/argon2-strategy.js';
import {
  CreateInstructor,
  CreateInstructorCommandHandler,
} from './create-instructor.js';
import { AuthSeeds } from '../../tests/seeds/auth-seeds.js';
import { BadRequestException } from '../../../shared/exceptions/bad-request-exception.js';
import { IApiKeyGenerator } from '../services/apikey-generator/apikey-generator.interface.js';
import { InstructorId } from '../../domain/entities/instructor-id.js';
import { RamUserRepository } from '../../infrastructure/persistence/ram/ram-user-repository.js';
import { UserId } from '../../domain/entities/user-id.js';
import { Apikey } from '../../domain/entities/apikey.js';
import { User } from '../../domain/entities/user.js';
import { UserCreatedEvent } from '../../domain/events/user-created-event.js';
import { expectEventToBeRaised } from '../../../shared/utils/test-utils.js';
import { InstructorCreatedEvent } from '../../domain/events/instructor-created-event.js';
import { InstructorAccount } from '../../domain/model/account.js';

class StubApiKeyGenerator implements IApiKeyGenerator {
  static VALUE = '123456';

  async generate() {
    return Apikey.generate(StubApiKeyGenerator.VALUE);
  }
}

describe('Feature: creating an instructor', () => {
  const userRepository = new RamUserRepository();
  const instructorRepository = new RamInstructorRepository();
  const passwordStrategy = new Argon2Strategy();
  const apiKeyGenerator = new StubApiKeyGenerator();

  const commandHandler = new CreateInstructorCommandHandler(
    userRepository,
    instructorRepository,
    passwordStrategy,
    apiKeyGenerator,
  );

  beforeEach(() => {
    userRepository.clear();
    instructorRepository.clear();
  });

  describe('Scenario: happy path', () => {
    const command = new CreateInstructor(AuthSeeds.admin(), {
      id: 'my-id',
      emailAddress: 'johndoe@gmail.com',
      password: 'azerty123',
      firstName: 'John',
      lastName: 'Doe',
    });

    it('should create a new user', async () => {
      const result = await commandHandler.execute(command);
      const instructor = instructorRepository
        .findByIdSync(new InstructorId('my-id'))!
        .takeSnapshot();

      const user = userRepository
        .findByIdSync(new UserId('my-id'))!
        .takeSnapshot();

      expect(user.emailAddress).toEqual('johndoe@gmail.com');
      expect(instructor.firstName).toEqual('John');
      expect(instructor.lastName).toEqual('Doe');
    });

    it('should generate events', async () => {
      const result = await commandHandler.execute(command);
      const instructor = instructorRepository.findByIdSync(
        new InstructorId('my-id'),
      )!;
      const user = userRepository.findByIdSync(new UserId('my-id'))!;

      expectEventToBeRaised(
        user.getEvents(),
        new UserCreatedEvent({
          id: 'my-id',
          account: {
            type: 'instructor',
            id: 'my-id',
          },
          emailAddress: 'johndoe@gmail.com',
        }),
      );

      expectEventToBeRaised(
        instructor.getEvents(),
        new InstructorCreatedEvent({
          id: 'my-id',
          firstName: 'John',
          lastName: 'Doe',
        }),
      );
    });

    it('should generate an apikey', async () => {
      const result = await commandHandler.execute(command);
      const user = userRepository
        .findByIdSync(new UserId('my-id'))!
        .takeSnapshot();

      expect(user.apikey.value).toBe(StubApiKeyGenerator.VALUE);
    });

    it('should hash the password', async () => {
      const result = await commandHandler.execute(command);
      const user = userRepository.findByIdSync(new UserId('my-id'))!;

      const isValid = await passwordStrategy.equals(
        'azerty123',
        user.getPassword(),
      );

      expect(isValid).toBe(true);
    });
  });

  describe('Scenario: the e-mail address is already taken', () => {
    beforeEach(() => {
      userRepository.saveSync(
        User.create({
          id: new UserId('existing-user'),
          account: new InstructorAccount(new InstructorId('existing-user')),
          emailAddress: 'johndoe@gmail.com',
          password: 'azerty123',
          apikey: Apikey.generate('123456'),
        }),
      );
    });

    it('should fail', async () => {
      const command = new CreateInstructor(AuthSeeds.admin(), {
        id: 'my-id',
        emailAddress: 'johndoe@gmail.com',
        password: 'azerty123',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(() => commandHandler.execute(command)).rejects.toThrow(
        new BadRequestException('Email address is already taken'),
      );
    });
  });
});
