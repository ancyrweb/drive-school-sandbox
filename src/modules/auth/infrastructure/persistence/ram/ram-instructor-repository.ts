import { GenericRamRepository } from '../../../../shared/repository/generic-ram-repository.js';
import { IInstructorRepository } from '../../../application/ports/instructor-repository.js';
import { Optional } from '../../../../shared/utils/optional.js';
import { InstructorId } from '../../../domain/entities/instructor-id.js';
import { Instructor } from '../../../domain/entities/instructor-entity.js';

export class RamInstructorRepository
  extends GenericRamRepository<InstructorId, Instructor>
  implements IInstructorRepository
{
  async findByApiKey(apiKey: string): Promise<Optional<Instructor>> {
    const user = this.entities.find((user) => user.apiKey.value === apiKey);
    return Optional.of(user);
  }
  async isEmailAddressAvailable(emailAddress: string): Promise<boolean> {
    const isTaken = this.entities.some(
      (user) => user.emailAddress === emailAddress,
    );

    return !isTaken;
  }
}
