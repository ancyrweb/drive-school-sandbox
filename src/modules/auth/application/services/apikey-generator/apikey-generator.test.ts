import { ApikeyGenerator } from './apikey-generator.js';
import { InstructorId } from '../../../domain/entities/instructor-id.js';
import { RamUserRepository } from '../../../infrastructure/persistence/ram/ram-user-repository.js';
import { UserId } from '../../../domain/entities/user-id.js';
import { User } from '../../../domain/entities/user.js';
import { Apikey } from '../../../domain/entities/apikey.js';

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

  const apikey = await generator.generate();
  expect(apikey.getValue()).toBe('key1');
});

test('when the apikey is not available, should pick another one', async () => {
  const userRepository = new RamUserRepository([
    User.create({
      id: new UserId(),
      accountId: new InstructorId(),
      emailAddress: 'johndoe@gmail.com',
      password: 'azerty123',
      apikey: Apikey.generate('key1'),
    }),
  ]);

  const generator = new TestableRandomApiKeyGenerator(userRepository);

  const apikey = await generator.generate();
  expect(apikey.getValue()).toBe('key2');
});
