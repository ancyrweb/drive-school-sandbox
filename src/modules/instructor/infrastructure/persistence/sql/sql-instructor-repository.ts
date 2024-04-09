import { IInstructorRepository } from '../../../application/ports/instructor-repository.js';
import { InstructorId } from '../../../domain/entities/instructor-id.js';
import { Instructor } from '../../../domain/entities/instructor-entity.js';
import { GenericSqlRepository } from '../../../../shared/repository/generic-sql-repository.js';

export class SqlInstructorRepository
  extends GenericSqlRepository<InstructorId, Instructor>
  implements IInstructorRepository {}
