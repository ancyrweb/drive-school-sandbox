import { IInstructorRepository } from '../../../application/ports/instructor-repository.js';
import { GenericSqlRepository } from '../../../../shared/repository/generic-sql-repository.js';
import { InstructorId } from '../../../domain/entities/instructor-id.js';
import { SqlInstructorEntity } from './entities/sql-instructor-entity.js';

export class SqlInstructorRepository
  extends GenericSqlRepository<InstructorId, SqlInstructorEntity>
  implements IInstructorRepository {}
