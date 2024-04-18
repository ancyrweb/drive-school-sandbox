import { RamUserRepository } from '../../infrastructure/persistence/ram/ram-user-repository.js';
import { Argon2Strategy } from '../services/password-strategy/argon2-strategy.js';
import { CreateUserCommand, CreateUserCommandHandler } from './create-user.js';
import { AuthSeeds } from '../../tests/seeds/auth-seeds.js';
import { UserId } from '../../domain/entities/user-id.js';
import { Role } from '../../domain/entities/role.js';
import { User } from '../../domain/entities/user-entity.js';
import { BadRequestException } from '../../../shared/exceptions/bad-request-exception.js';
import { IApiKeyGenerator } from '../services/apikey-generator/apikey-generator.interface.js';

class StubApiKeyGenerator implements IApiKeyGenerator {
  static VALUE = '123456';

  async generate() {
    return StubApiKeyGenerator.VALUE;
  }
}

describe('Feature: creating a user', () => {
  const userRepository = new RamUserRepository();
  const passwordStrategy = new Argon2Strategy();
  const apiKeyGenerator = new StubApiKeyGenerator();

  const commandHandler = new CreateUserCommandHandler(
    userRepository,
    passwordStrategy,
    apiKeyGenerator,
  );

  beforeEach(() => {
    userRepository.clear();
  });

  describe('Scenario: happy path', () => {
    const command = new CreateUserCommand(AuthSeeds.admin(), {
      emailAddress: 'johndoe@gmail.com',
      password: 'azerty123',
      role: 'admin',
    });

    it('should create a new user', async () => {
      const result = await commandHandler.execute(command);
      const user = userRepository.findByIdSync(new UserId(result.id))!;

      expect(user).not.toBeNull();
      expect(user.role).toEqual(Role.ADMIN);
      expect(user.emailAddress).toEqual('johndoe@gmail.com');
    });

    it('should generate an apikey', async () => {
      const result = await commandHandler.execute(command);
      const user = userRepository.findByIdSync(new UserId(result.id))!;
      expect(user.apiKey).toBe(StubApiKeyGenerator.VALUE);
    });

    it('should generate an apikey', async () => {
      const result = await commandHandler.execute(command);
      const user = userRepository.findByIdSync(new UserId(result.id))!;

      const isValid = await passwordStrategy.equals('azerty123', user.password);
      expect(isValid).toBe(true);
    });
  });

  describe('Scenario: the e-mail address is already taken', () => {
    beforeEach(() => {
      userRepository.createSync(
        User.create({
          id: new UserId(),
          emailAddress: 'johndoe@gmail.com',
          password: 'azerty123',
          apiKey: '',
          role: Role.ADMIN,
        }),
      );
    });

    it('should fail', async () => {
      const command = new CreateUserCommand(AuthSeeds.admin(), {
        emailAddress: 'johndoe@gmail.com',
        password: 'azerty123',
        role: 'admin',
      });

      expect(() => commandHandler.execute(command)).rejects.toThrow(
        new BadRequestException('Email address is already taken'),
      );
    });
  });
});
