import { AuthContext } from '../../domain/model/auth-context.js';
import { UserId } from '../../domain/entities/user-id.js';
import { AdminId } from '../../domain/entities/admin-id.js';
import { StudentId } from '../../domain/entities/student-id.js';
import { InstructorId } from '../../domain/entities/instructor-id.js';

export class AuthSeeds {
  static admin() {
    return new AuthContext({
      userId: new UserId('123'),
      accountType: {
        type: 'admin',
        id: new AdminId(),
      },
    });
  }

  static instructor() {
    return new AuthContext({
      userId: new UserId('123'),
      accountType: {
        type: 'instructor',
        id: new InstructorId(),
      },
    });
  }

  static student() {
    return new AuthContext({
      userId: new UserId('123'),
      accountType: {
        type: 'student',
        id: new StudentId(),
      },
    });
  }
}
