import { UserId } from '../../../domain/entities/user-id.js';
import { SqlUserEntity } from './entities/sql-user-entity.js';
import { GenericSqlRepository } from '../../../../shared/repository/generic-sql-repository.js';
import { Optional } from '../../../../shared/utils/optional.js';
import { IUserRepository } from '../../../application/ports/user-repository.js';

export class SqlUserRepository
  extends GenericSqlRepository<UserId, SqlUserEntity>
  implements IUserRepository
{
  async findByApiKey(value: string): Promise<Optional<SqlUserEntity>> {
    const user = await this.repository.findOne({ apiKey: { value } });
    return Optional.of(user);
  }

  async isEmailAddressAvailable(emailAddress: string): Promise<boolean> {
    const user = await this.repository.findOne({ emailAddress });
    return !user;
  }
}
