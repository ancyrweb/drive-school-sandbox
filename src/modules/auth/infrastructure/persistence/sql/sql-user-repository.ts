import { UserId } from '../../../domain/entities/user-id.js';
import { User } from '../../../domain/entities/user-entity.js';
import { IUserRepository } from '../../../application/ports/user-repository.js';
import { GenericSqlRepository } from '../../../../shared/repository/generic-sql-repository.js';
import { Optional } from '../../../../shared/utils/optional.js';

export class SqlUserRepository
  extends GenericSqlRepository<UserId, User>
  implements IUserRepository
{
  async findByApiKey(apiKey: string): Promise<Optional<User>> {
    const user = await this.repository.findOne({ apiKey });
    return Optional.of(user);
  }

  async isEmailAddressAvailable(emailAddress: string): Promise<boolean> {
    const user = await this.repository.findOne({ emailAddress });
    return !user;
  }
}
