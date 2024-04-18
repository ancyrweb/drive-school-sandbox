import { ApikeyGenerator } from './apikey-generator.js';
import { RamUserRepository } from '../../../infrastructure/persistence/ram/ram-user-repository.js';
import { User } from '../../../domain/entities/user-entity.js';
import { UserId } from '../../../domain/entities/user-id.js';
import { Role } from '../../../domain/entities/role.js';

class TestableRandomApiKeyGenerator extends ApikeyGenerator {
  private availableKeys = ['key1', 'key2'];
  private index = 0;

  randomString(): string {
    return this.availableKeys[this.index++];
  }
}

test('when the apikey is available, it should use the first one', async () => {
  const userRepository = new RamUserRepository();
  const generator = new TestableRandomApiKeyGenerator(userRepository);

  const key = await generator.generate();
  expect(key).toBe('key1');
});

test('when the apikey is not available, should pick another one', async () => {
  const userRepository = new RamUserRepository([
    User.create({
      id: new UserId(),
      emailAddress: 'johndoe@gmail.com',
      password: 'azerty',
      role: Role.ADMIN,
      apiKey: 'key1',
    }),
  ]);

  const generator = new TestableRandomApiKeyGenerator(userRepository);

  const key = await generator.generate();
  expect(key).toBe('key2');
});
