import { Mapper } from '../../../../../shared/lib/mapper.js';
import { User } from '../../../../domain/entities/user.js';
import { SqlUser } from '../entities/sql-user.js';
import { UserId } from '../../../../domain/entities/user-id.js';
import { Apikey } from '../../../../domain/entities/apikey.js';
import { ApikeyId } from '../../../../domain/entities/apikey-id.js';
import { SqlApikey } from '../entities/sql-apikey.js';
import { Account } from '../../../../domain/model/account.js';

export class SqlUserMapper extends Mapper<User, SqlUser> {
  toDomain(obj: SqlUser): User {
    return User.create({
      id: new UserId(obj.id),
      emailAddress: obj.emailAddress,
      password: obj.password,
      account: Account.fromSnapshot(obj.account),
      apikey: Apikey.create({
        id: new ApikeyId(obj.apikey.id),
        value: obj.apikey.value,
      }),
    }).attachRecord(obj);
  }

  toPersistence(obj: User): SqlUser {
    const snapshot = obj.takeSnapshot();
    const record = obj.getRecord<SqlUser>() ?? new SqlUser();

    record.id = snapshot.id;
    record.emailAddress = snapshot.emailAddress;
    record.password = snapshot.password;
    record.account = snapshot.account;

    if (!record.apikey) {
      record.apikey = new SqlApikey();
    }

    record.apikey.id = snapshot.apikey.id;
    record.apikey.value = snapshot.apikey.value;

    return record;
  }
}
