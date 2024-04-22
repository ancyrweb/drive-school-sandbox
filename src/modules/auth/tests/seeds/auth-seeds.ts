import { AuthContext } from '../../domain/model/auth-context.js';
import { UserId } from '../../domain/entities/user-id.js';
import { AdminId } from '../../domain/entities/admin-id.js';
import { StudentId } from '../../domain/entities/student-id.js';
import { InstructorId } from '../../domain/entities/instructor-id.js';
import { Account } from '../../domain/model/account.js';

export class AuthSeeds {
  static admin(id: string = '123') {
    return new AuthContext({
      userId: new UserId(id),
      account: Account.admin(new AdminId(id)),
    });
  }

  static instructor(id: string = '123') {
    return new AuthContext({
      userId: new UserId(id),
      account: Account.instructor(new InstructorId(id)),
    });
  }

  static student(id: string = '123') {
    return new AuthContext({
      userId: new UserId(id),
      account: Account.student(new StudentId(id)),
    });
  }
}
