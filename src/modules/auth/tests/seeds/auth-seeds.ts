import { AuthContext } from '../../domain/model/auth-context.js';
import { Role } from '../../domain/entities/role.js';

export class AuthSeeds {
  static admin() {
    return new AuthContext({
      id: '123',
      type: Role.ADMIN,
    });
  }

  static instructor() {
    return new AuthContext({
      id: '123',
      type: Role.INSTRUCTOR,
    });
  }

  static student() {
    return new AuthContext({
      id: '123',
      type: Role.STUDENT,
    });
  }
}
