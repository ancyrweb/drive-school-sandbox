import { BaseFixture } from '../../../tests/fixture.js';
import { User } from '../../domain/entities/user-entity.js';
import { TestApp } from '../../../tests/test-app.js';
import {
  I_USER_REPOSITORY,
  IUserRepository,
} from '../../application/ports/user-repository.js';

export class UserFixture extends BaseFixture<User> {
  getRepository(app: TestApp) {
    return app.get<IUserRepository>(I_USER_REPOSITORY);
  }
}
