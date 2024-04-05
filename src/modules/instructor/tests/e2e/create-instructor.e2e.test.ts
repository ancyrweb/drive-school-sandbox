import { TestApp } from '../../../tests/test-app.js';
import {
  I_INSTRUCTOR_REPOSITORY,
  IInstructorRepository,
} from '../../application/ports/instructor-repository.js';
import { InstructorId } from '../../domain/instructor-id.js';

describe('Feature: creating an instructor', () => {
  let testApp = new TestApp();

  beforeEach(async () => {
    await testApp.setup();
  });

  afterEach(async () => {
    await testApp.teardown();
  });

  test('Scenario: happy path', async () => {
    const result = await testApp.request((req) => {
      return req.post('/instructors/create-instructor').send({
        firstName: 'John',
        lastName: 'Doe',
      });
    });

    expect(result.status).toBe(201);

    const repository = testApp.get<IInstructorRepository>(
      I_INSTRUCTOR_REPOSITORY,
    );

    const instructorQuery = await repository.findById(
      new InstructorId(result.body.id),
    );

    const instructor = instructorQuery.getOrThrow();

    expect(instructor.firstName).toBe('John');
    expect(instructor.lastName).toBe('Doe');
  });
});
