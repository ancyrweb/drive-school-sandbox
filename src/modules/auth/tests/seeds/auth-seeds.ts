import { AuthContext } from '../../domain/model/auth-context.js';
import { UserId } from '../../domain/entities/user-id.js';
import { AdminId } from '../../domain/entities/admin-id.js';
import { StudentId } from '../../domain/entities/student-id.js';
import { InstructorId } from '../../domain/entities/instructor-id.js';
import {
  AdminAccount,
  InstructorAccount,
  StudentAccount,
} from '../../domain/model/account.js';

export class AuthSeeds {
  static admin() {
    return new AuthContext({
      userId: new UserId('123'),
      account: new AdminAccount(new AdminId()),
    });
  }

  static instructor() {
    return new AuthContext({
      userId: new UserId('123'),
      account: new InstructorAccount(new InstructorId()),
    });
  }

  static student() {
    return new AuthContext({
      userId: new UserId('123'),
      account: new StudentAccount(new StudentId()),
    });
  }
}
