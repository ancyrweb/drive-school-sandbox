import { IInstructorRepository } from '../../../application/ports/instructor-repository.js';
import { GenericRamRepository } from '../../../../shared/generic-ram-repository.js';
import { InstructorId } from '../../../domain/instructor-id.js';
import { Instructor } from '../../../domain/instructor-entity.js';

export class RamInstructorRepository
  extends GenericRamRepository<InstructorId, Instructor>
  implements IInstructorRepository {}
