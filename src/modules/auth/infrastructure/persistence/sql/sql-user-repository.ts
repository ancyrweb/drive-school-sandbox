import { SqlUser } from './entities/sql-user.js';
import { GenericSqlRepository } from '../../../../shared/repository/generic-sql-repository.js';
import { Optional } from '../../../../shared/utils/optional.js';
import { IUserRepository } from '../../../application/ports/user-repository.js';
import { User } from '../../../domain/entities/user.js';
import { SqlUserMapper } from './mappers/sql-user-mapper.js';
import { UserId } from '../../../domain/entities/user-id.js';

export class SqlUserRepository
  extends GenericSqlRepository<UserId, User, SqlUser>
  implements IUserRepository
{
  mapper = new SqlUserMapper();

  async findByApiKey(value: string): Promise<Optional<User>> {
    const user = await this.repository.findOne({ apikey: { value } });
    return Optional.of(user ? this.mapper.toDomain(user) : null);
  }

  async isEmailAddressAvailable(emailAddress: string): Promise<boolean> {
    const user = await this.repository.findOne({ emailAddress });
    return !user;
  }
}
