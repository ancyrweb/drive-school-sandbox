import { Optional } from '../../../shared/utils/optional.js';
import { Instructor } from '../../domain/entities/instructor-entity.js';
import { InstructorId } from '../../domain/entities/instructor-id.js';

export const I_INSTRUCTOR_REPOSITORY = Symbol('I_INSTRUCTOR_REPOSITORY');

export interface IInstructorRepository {
  findById(id: InstructorId): Promise<Optional<Instructor>>;
  findByApiKey(apiKey: string): Promise<Optional<Instructor>>;
  create(instructor: Instructor): Promise<void>;
  update(instructor: Instructor): Promise<void>;
  delete(instructor: Instructor): Promise<void>;
  clear(): Promise<void>;

  isEmailAddressAvailable(emailAddress: string): Promise<boolean>;
}
