import { IInstructorRepository } from '../../../application/ports/instructor-repository.js';
import { InstructorId } from '../../../domain/instructor-id.js';
import { Instructor } from '../../../domain/instructor-entity.js';
import { GenericSqlRepository } from '../../../../shared/generic-sql-repository.js';

export class SqlInstructorRepository
  extends GenericSqlRepository<InstructorId, Instructor>
  implements IInstructorRepository {}
