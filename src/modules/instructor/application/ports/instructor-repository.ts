import { InstructorId } from '../../domain/instructor-id.js';
import { Instructor } from '../../domain/instructor-entity.js';
import { Optional } from '../../../shared/optional.js';

export interface IInstructorRepository {
  findById(id: InstructorId): Promise<Optional<Instructor>>;
  create(instructor: Instructor): Promise<void>;
}
