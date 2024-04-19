import { UserId } from './user-id.js';
import { Apikey } from './apikey.js';
import { AggregateRoot } from '../../../shared/lib/aggregate-root.js';
import { GetSnapshot } from '../../../shared/lib/entity.js';
import { InstructorId } from './instructor-id.js';
import { StudentId } from './student-id.js';
import { AdminId } from './admin-id.js';

type State = {
  id: UserId;
  accountId: InstructorId | StudentId | AdminId;
  emailAddress: string;
  password: string;
  apiKey: Apikey;
};

type Snapshot = {
  id: string;
  account: {
    type: 'instructor' | 'student' | 'admin';
    id: string;
  };
  emailAddress: string;
  apiKey: GetSnapshot<Apikey>;
};

export class User extends AggregateRoot<UserId, State, Snapshot> {
  takeSnapshot(): Snapshot {
    const getAccountSnapshot = () => {
      if (this._state.accountId instanceof InstructorId) {
        return {
          type: 'instructor',
          id: this._state.accountId.value,
        } as const;
      } else if (this._state.accountId instanceof StudentId) {
        return {
          type: 'student',
          id: this._state.accountId.value,
        } as const;
      } else {
        return {
          type: 'admin',
          id: this._state.accountId.value,
        } as const;
      }
    };

    return {
      id: this._state.id.value,
      emailAddress: this._state.emailAddress,
      apiKey: this._state.apiKey.takeSnapshot(),
      account: getAccountSnapshot(),
    };
  }

  getApikey(): Apikey {
    return this._state.apiKey;
  }

  getEmailAddress(): string {
    return this._state.emailAddress;
  }

  getPassword(): string {
    return this._state.password;
  }
}
