import { AuthContext } from '../../domain/model/auth-context.js';
import { Role } from '../../domain/model/role.js';
import { UserId } from '../../domain/entities/user-id.js';

export class AuthSeeds {
  static admin() {
    return new AuthContext({
      id: new UserId('123'),
      type: Role.ADMIN,
    });
  }

  static instructor() {
    return new AuthContext({
      id: new UserId('123'),
      type: Role.INSTRUCTOR,
    });
  }

  static student() {
    return new AuthContext({
      id: new UserId('123'),
      type: Role.STUDENT,
    });
  }
}
