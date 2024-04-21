import { AdminId } from '../entities/admin-id.js';
import { InstructorId } from '../entities/instructor-id.js';
import { StudentId } from '../entities/student-id.js';
import { BrandedId } from '../../../shared/lib/id.js';

export type AccountSnapshot = {
  type: string;
  id: string;
};

export abstract class Account<TId extends BrandedId<any> = BrandedId<any>> {
  constructor(private readonly id: TId) {}

  abstract getType(): string;

  getId() {
    return this.id;
  }

  takeSnapshot(): AccountSnapshot {
    return {
      type: this.getType(),
      id: this.id.asString(),
    };
  }
}

export class InstructorAccount extends Account<InstructorId> {
  getType() {
    return 'instructor';
  }
}

export class StudentAccount extends Account<StudentId> {
  getType() {
    return 'student';
  }
}

export class AdminAccount extends Account<AdminId> {
  getType() {
    return 'admin';
  }
}
