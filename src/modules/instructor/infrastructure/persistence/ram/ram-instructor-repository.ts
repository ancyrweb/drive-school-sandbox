import { IInstructorRepository } from '../../../application/ports/instructor-repository.js';
import { GenericRamRepository } from '../../../../shared/repository/generic-ram-repository.js';
import { InstructorId } from '../../../domain/entities/instructor-id.js';
import { Instructor } from '../../../domain/entities/instructor-entity.js';

export class RamInstructorRepository
  extends GenericRamRepository<InstructorId, Instructor>
  implements IInstructorRepository {}
