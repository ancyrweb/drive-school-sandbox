import { User } from '../../domain/entities/user.js';
import { GetFactoryProps } from '../../../shared/utils/types.js';
import { UserId } from '../../domain/entities/user-id.js';
import { AdminId } from '../../domain/entities/admin-id.js';
import { Account } from '../../domain/model/account.js';
import { Apikey } from '../../domain/entities/apikey.js';

type UserProps = GetFactoryProps<typeof User>;

export class UserBuilder {
  private props: UserProps;

  constructor(props?: Partial<UserProps>) {
    const id = props?.id ?? new UserId();

    this.props = {
      id,
      account: Account.admin(new AdminId(id.value)),
      emailAddress: 'user@gmail.com',
      password: 'azerty',
      apikey: Apikey.generate('apikey'),
      ...props,
    };
  }

  build() {
    return User.create(this.props);
  }
}
