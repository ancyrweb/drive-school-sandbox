import { UserId } from './user-id.js';
import { Apikey } from './apikey.js';
import { AggregateRoot } from '../../../shared/lib/aggregate-root.js';
import { GetSnapshot } from '../../../shared/lib/entity.js';
import { InstructorId } from './instructor-id.js';
import { StudentId } from './student-id.js';
import { AdminId } from './admin-id.js';
import { UserCreatedEvent } from '../events/user-created-event.js';

type State = {
  id: UserId;
  accountId: InstructorId | StudentId | AdminId;
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
        account: user.takeAccountSnapshot(),
        emailAddress: user._state.emailAddress,
      }),
    );

    return user;
  }

  private takeAccountSnapshot(): Snapshot['account'] {
    if (this._state.accountId instanceof InstructorId) {
      return {
        type: 'instructor',
        id: this._state.accountId.value,
      };
    } else if (this._state.accountId instanceof StudentId) {
      return {
        type: 'student',
        id: this._state.accountId.value,
      };
    } else {
      return {
        type: 'admin',
        id: this._state.accountId.value,
      };
    }
  }

  takeSnapshot(): Snapshot {
    return {
      id: this._state.id.value,
      emailAddress: this._state.emailAddress,
      password: this._state.password,
      apiKey: this._state.apikey.takeSnapshot(),
      account: this.takeAccountSnapshot(),
    };
  }

  getApikey(): Apikey {
    return this._state.apikey;
  }

  getEmailAddress(): string {
    return this._state.emailAddress;
  }

  getPassword(): string {
    return this._state.password;
  }
}
