import { AdminId } from '../entities/admin-id.js';
import { InstructorId } from '../entities/instructor-id.js';
import { StudentId } from '../entities/student-id.js';
import { BrandedId } from '../../../shared/lib/id.js';

export type AccountSnapshot = {
  type: string;
  id: string;
};

type AccountType = 'admin' | 'instructor' | 'student';

export class Account {
  constructor(
    private readonly id: BrandedId<any>,
    private readonly type: AccountType,
  ) {}

  static instructor(id: InstructorId) {
    return new Account(id, 'instructor');
  }

  static student(id: StudentId) {
    return new Account(id, 'student');
  }

  static admin(id: AdminId) {
    return new Account(id, 'admin');
  }

  static fromSnapshot(snapshot: AccountSnapshot) {
    if (snapshot.type === 'instructor') {
      return Account.instructor(new InstructorId(snapshot.id));
    } else if (snapshot.type === 'student') {
      return Account.student(new StudentId(snapshot.id));
    } else {
      return Account.admin(new AdminId(snapshot.id));
    }
  }

  getId() {
    return this.id;
  }

  isInstructor() {
    return this.type === 'instructor';
  }

  isStudent() {
    return this.type === 'student';
  }

  isAdmin() {
    return this.type === 'admin';
  }

  takeSnapshot(): AccountSnapshot {
    return {
      type: this.type,
      id: this.id.asString(),
    };
  }
}
