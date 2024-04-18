import { GenericRamRepository } from '../../../../shared/repository/generic-ram-repository.js';
import { UserId } from '../../../domain/entities/user-id.js';
import { User } from '../../../domain/entities/user-entity.js';
import { IUserRepository } from '../../../application/ports/user-repository.js';
import { Optional } from '../../../../shared/utils/optional.js';

export class RamUserRepository
  extends GenericRamRepository<UserId, User>
  implements IUserRepository
{
  async findByApiKey(apiKey: string): Promise<Optional<User>> {
    const user = this.entities.find((user) => user.apiKey === apiKey);
    return Optional.of(user);
  }
  async isEmailAddressAvailable(emailAddress: string): Promise<boolean> {
    const isTaken = this.entities.some(
      (user) => user.emailAddress === emailAddress,
    );

    return !isTaken;
  }
}
