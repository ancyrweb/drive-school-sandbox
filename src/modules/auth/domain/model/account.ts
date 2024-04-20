import { AdminId } from '../entities/admin-id.js';
import { InstructorId } from '../entities/instructor-id.js';
import { StudentId } from '../entities/student-id.js';

export type Account =
  | {
      type: 'instructor';
      id: InstructorId;
    }
  | {
      type: 'student';
      id: StudentId;
    }
  | {
      type: 'admin';
      id: AdminId;
    };

export type AccountType = Account['type'];

export type AccountSnapshot = {
  type: AccountType;
  id: string;
};
