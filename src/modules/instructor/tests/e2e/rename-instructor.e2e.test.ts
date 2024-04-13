import { TestApp } from '../../../tests/test-app.js';
import {
  I_INSTRUCTOR_REPOSITORY,
  IInstructorRepository,
} from '../../application/ports/instructor-repository.js';
import { InstructorId } from '../../domain/entities/instructor-id.js';
import { InstructorFixture } from '../fixtures/instructor-fixture.js';
import { Instructor } from '../../domain/entities/instructor-entity.js';

describe('Feature: renaming an instructor', () => {
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
      return req.post('/instructors/rename-instructor').send({
        instructorId: 'johndoe',
        payload: {
          firstName: 'Jack',
          lastName: 'Daniels',
        },
      });
    });

    expect(result.status).toBe(200);

    const repository = testApp.get<IInstructorRepository>(
      I_INSTRUCTOR_REPOSITORY,
    );

    const instructorQuery = await repository.findById(
      new InstructorId('johndoe'),
    );

    const instructor = instructorQuery.getOrThrow();

    expect(instructor.firstName).toBe('Jack');
    expect(instructor.lastName).toBe('Daniels');
  });
});
