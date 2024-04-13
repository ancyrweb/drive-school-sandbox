import { GenericRamRepository } from '../../../../shared/repository/generic-ram-repository.js';
import { UserId } from '../../../domain/entities/user-id.js';
import { User } from '../../../domain/entities/user-entity.js';
import { IUserRepository } from '../../../application/ports/user-repository.js';

export class RamUserRepository
  extends GenericRamRepository<UserId, User>
  implements IUserRepository
{
  async isEmailAddressAvailable(emailAddress: string): Promise<boolean> {
    const isTaken = this.entities.some(
      (user) => user.emailAddress === emailAddress,
    );

    return !isTaken;
  }
}
