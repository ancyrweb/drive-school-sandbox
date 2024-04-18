import { ApikeyGenerator } from './apikey-generator.js';
import { RamInstructorRepository } from '../../../infrastructure/persistence/ram/ram-instructor-repository.js';
import { Role } from '../../../domain/model/role.js';
import { Instructor } from '../../../domain/entities/instructor-entity.js';
import { ApikeyEntity } from '../../../domain/entities/apikey-entity.js';
import { InstructorId } from '../../../domain/entities/instructor-id.js';

class TestableRandomApiKeyGenerator extends ApikeyGenerator {
  private availableKeys = ['key1', 'key2'];
  private index = 0;

  randomString(): string {
    return this.availableKeys[this.index++];
  }
}

test('when the apikey is available, it should use the first one', async () => {
  const userRepository = new RamInstructorRepository();
  const generator = new TestableRandomApiKeyGenerator(userRepository);

  const apikey = await generator.generate();
  expect(apikey.value).toBe('key1');
});

test('when the apikey is not available, should pick another one', async () => {
  const userRepository = new RamInstructorRepository([
    Instructor.create({
      id: new InstructorId(),
      emailAddress: 'johndoe@gmail.com',
      password: 'azerty',
      role: Role.ADMIN,
      apiKey: ApikeyEntity.generate('key1'),
      firstName: 'John',
      lastName: 'Doe',
    }),
  ]);

  const generator = new TestableRandomApiKeyGenerator(userRepository);

  const apikey = await generator.generate();
  expect(apikey.value).toBe('key2');
});
