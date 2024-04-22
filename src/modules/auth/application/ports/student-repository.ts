import { Optional } from '../../../shared/utils/optional.js';
import { Student } from '../../domain/entities/student.js';
import { StudentId } from '../../domain/entities/student-id.js';

export const I_STUDENT_REPOSITORY = Symbol('I_STUDENT_REPOSITORY');

export interface IStudentRepository {
  findById(id: StudentId): Promise<Optional<Student>>;
  save(instructor: Student): Promise<void>;
  delete(instructor: Student): Promise<void>;
  clear(): Promise<void>;
}
