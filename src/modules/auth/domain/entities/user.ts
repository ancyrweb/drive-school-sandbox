import { UserId } from './user-id.js';
import { Apikey } from './apikey.js';
import { AggregateRoot } from '../../../shared/lib/aggregate-root.js';
import { GetSnapshot } from '../../../shared/lib/entity.js';
import { UserCreatedEvent } from '../events/user-created-event.js';
import { Account } from '../model/account.js';

type State = {
  id: UserId;
  account: Account;
  emailAddress: string;
  password: string;
  apikey: Apikey;
};

type Props = State;

type Snapshot = {
  id: string;
  emailAddress: string;
  password: string;
  apiKey: GetSnapshot<Apikey>;
  account: {
    type: 'instructor' | 'student' | 'admin';
    id: string;
  };
};

export class User extends AggregateRoot<UserId, State, Snapshot> {
  static create(props: Props): User {
    return new User(props);
  }

  static newAccount(props: Props): User {
    const user = new User(props);
    user.raise(
      new UserCreatedEvent({
        id: user._state.id.value,
        account: user._state.account.takeSnapshot(),
        emailAddress: user._state.emailAddress,
      }),
    );

    return user;
  }

  takeSnapshot(): Snapshot {
    return {
      id: this._state.id.value,
      emailAddress: this._state.emailAddress,
      password: this._state.password,
      apiKey: this._state.apikey.takeSnapshot(),
      account: this._state.account.takeSnapshot(),
    };
  }

  getApikey(): Apikey {
    return this._state.apikey;
  }

  getAccount() {
    return this._state.account;
  }

  getEmailAddress(): string {
    return this._state.emailAddress;
  }

  getPassword(): string {
    return this._state.password;
  }
}
