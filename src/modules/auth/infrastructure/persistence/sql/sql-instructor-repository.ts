import { IInstructorRepository } from '../../../application/ports/instructor-repository.js';
import { GenericSqlRepository } from '../../../../shared/repository/generic-sql-repository.js';
import { InstructorId } from '../../../domain/entities/instructor-id.js';
import { SqlInstructor } from './entities/sql-instructor.js';
import { Instructor } from '../../../domain/entities/instructor.js';
import { SqlInstructorMapper } from './mappers/sql-instructor-mapper.js';

export class SqlInstructorRepository
  extends GenericSqlRepository<InstructorId, Instructor, SqlInstructor>
  implements IInstructorRepository
{
  mapper = new SqlInstructorMapper();
}
