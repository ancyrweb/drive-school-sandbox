import { GenericRamRepository } from '../../../../shared/repository/generic-ram-repository.js';
import { IInstructorRepository } from '../../../application/ports/instructor-repository.js';
import { Instructor } from '../../../domain/entities/instructor.js';
import { InstructorId } from '../../../domain/entities/instructor-id.js';

export class RamInstructorRepository
  extends GenericRamRepository<InstructorId, Instructor>
  implements IInstructorRepository {}
