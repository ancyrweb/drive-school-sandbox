import { UserId } from '../entities/user-id.js';
import { Account } from './account.js';
import { BrandedId } from '../../../shared/lib/id.js';
import { StudentId } from '../entities/student-id.js';

export class AuthContext {
  private readonly userId: UserId;
  private readonly account: Account;

  constructor(props: { userId: UserId; account: Account }) {
    this.userId = props.userId;
    this.account = props.account;
  }

  /**
   * Return true if the authenticated user correspond to the ID
   * We can either pass a UserId or any Account ids (InstructorId, StudentId, AdminId)
   * @param id
   */
  is(id: BrandedId<any>) {
    return this.userId.equals(id) || this.account.getId().equals(id);
  }

  isAdmin() {
    return this.account.isAdmin();
  }

  isInstructor() {
    return this.account.isInstructor();
  }

  isStudent() {
    return this.account.isStudent();
  }

  getStudentId() {
    const id = this.account.getId();
    if (id instanceof StudentId) {
      return id;
    }

    throw new Error('The authenticated user is not a student');
  }
}
