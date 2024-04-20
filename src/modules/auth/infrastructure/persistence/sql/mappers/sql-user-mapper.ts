import { Mapper } from '../../../../../shared/lib/mapper.js';
import { User } from '../../../../domain/entities/user.js';
import { SqlUser } from '../entities/sql-user.js';
import { UserId } from '../../../../domain/entities/user-id.js';
import { Apikey } from '../../../../domain/entities/apikey.js';
import { ApikeyId } from '../../../../domain/entities/apikey-id.js';
import { InstructorId } from '../../../../domain/entities/instructor-id.js';
import { StudentId } from '../../../../domain/entities/student-id.js';
import { AdminId } from '../../../../domain/entities/admin-id.js';
import { SqlApikey } from '../entities/sql-apikey.js';

export class SqlUserMapper extends Mapper<User, SqlUser> {
  private toAccountId(user: SqlUser) {
    if (user.account.type === 'instructor') {
      return new InstructorId(user.account.id);
    } else if (user.account.type === 'student') {
      return new StudentId(user.account.id);
    } else {
      return new AdminId(user.account.id);
    }
  }

  toDomain(obj: SqlUser): User {
    return User.create({
      id: new UserId(obj.id),
      emailAddress: obj.emailAddress,
      password: obj.password,
      apikey: Apikey.create({
        id: new ApikeyId(obj.apikey.id),
        value: obj.apikey.value,
      }),
      accountId: this.toAccountId(obj),
    });
  }

  toPersistence(obj: User): SqlUser {
    const snapshot = obj.takeSnapshot();
    return new SqlUser({
      id: snapshot.id,
      emailAddress: snapshot.emailAddress,
      password: snapshot.password,
      apikey: new SqlApikey({
        id: snapshot.apiKey.id,
        value: snapshot.apiKey.value,
      }),
      account: {
        type: snapshot.account.type,
        id: snapshot.account.id,
      },
    });
  }
}