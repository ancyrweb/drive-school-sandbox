import { BaseFixture } from '../../../tests/fixture.js';
import { User } from '../../domain/entities/user-entity.js';
import { TestApp } from '../../../tests/test-app.js';
import {
  I_INSTRUCTOR_REPOSITORY,
  IInstructorRepository,
} from '../../application/ports/instructor-repository.js';

export class UserFixture extends BaseFixture<User> {
  getRepository(app: TestApp) {
    return app.get<IInstructorRepository>(I_INSTRUCTOR_REPOSITORY);
  }
}
