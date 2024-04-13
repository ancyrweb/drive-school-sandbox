import { TestApp } from '../../../tests/test-app.js';
import {
  I_INSTRUCTOR_REPOSITORY,
  IInstructorRepository,
} from '../../application/ports/instructor-repository.js';
import { InstructorId } from '../../domain/entities/instructor-id.js';
import { InstructorFixture } from '../fixtures/instructor-fixture.js';
import { Instructor } from '../../domain/entities/instructor-entity.js';

describe('Feature: deleting an instructor', () => {
  const instructor = new InstructorFixture(
    new Instructor({
      id: new InstructorId('johndoe'),
      firstName: 'John',
      lastName: 'Doe',
    }),
  );

  const testApp = new TestApp();

  beforeEach(async () => {
    await testApp.setup();
    await testApp.loadFixtures([instructor]);
  });

  afterEach(async () => {
    await testApp.teardown();
  });

  test('Scenario: happy path', async () => {
    const result = await testApp.request((req) => {
      return req.delete('/instructors/delete-instructor').send({
        instructorId: 'johndoe',
      });
    });

    const repository = testApp.get<IInstructorRepository>(
      I_INSTRUCTOR_REPOSITORY,
    );

    const instructorQuery = await repository.findById(
      new InstructorId('johndoe'),
    );

    expect(instructorQuery.isNull()).toBe(true);
  });
});
