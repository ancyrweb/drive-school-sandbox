import { Optional } from '../../../shared/utils/optional.js';
import { InstructorId } from '../../domain/entities/instructor-id.js';
import { Instructor } from '../../domain/entities/instructor.js';

export const I_INSTRUCTOR_REPOSITORY = Symbol('I_INSTRUCTOR_REPOSITORY');

export interface IInstructorRepository {
  findById(id: InstructorId): Promise<Optional<Instructor>>;
  save(instructor: Instructor): Promise<void>;
  delete(instructor: Instructor): Promise<void>;
  clear(): Promise<void>;
}
