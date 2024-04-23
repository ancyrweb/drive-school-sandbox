import { GenericRamRepository } from '../../../../shared/repository/generic-ram-repository.js';
import { IStudentRepository } from '../../../application/ports/student-repository.js';
import { StudentId } from '../../../domain/entities/student-id.js';
import { Student } from '../../../domain/entities/student.js';

export class RamStudentRepository
  extends GenericRamRepository<StudentId, Student>
  implements IStudentRepository {}
