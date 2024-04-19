import { GenericRamRepository } from '../../../../shared/repository/generic-ram-repository.js';
import { IInstructorRepository } from '../../../application/ports/instructor-repository.js';
import { Instructor } from '../../../domain/entities/instructor.js';

export class RamInstructorRepository
  extends GenericRamRepository<Instructor>
  implements IInstructorRepository {}
