import { ApikeyGenerator } from '../../../application/services/apikey-generator/apikey-generator.js';
import { RamUserRepository } from '../../../infrastructure/persistence/ram/ram-user-repository.js';
import { Apikey } from '../../../domain/entities/apikey.js';
import { UserBuilder } from '../../shared/factories/user-builder.js';

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
    new UserBuilder({
      apikey: Apikey.generate('key1'),
    }).build(),
  ]);

  const generator = new TestableRandomApiKeyGenerator(userRepository);

  const apikey = await generator.generate();
  expect(apikey.getValue()).toBe('key2');
});
