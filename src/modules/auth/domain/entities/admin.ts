import { AggregateRoot } from '../../../shared/lib/aggregate-root.js';
import { AdminId } from './admin-id.js';
import { AdminCreatedEvent } from '../events/admin-created-event.js';

type State = {
  id: AdminId;
  firstName: string;
  lastName: string;
};

type Props = State;

type Snapshot = {
  id: string;
  firstName: string;
  lastName: string;
};

export class Admin extends AggregateRoot<AdminId, State, Snapshot> {
  static create(props: Props): Admin {
    return new Admin(props);
  }

  static newAccount(props: Props): Admin {
    const admin = new Admin(props);
    admin.raise(new AdminCreatedEvent(admin.takeSnapshot()));

    return admin;
  }

  takeSnapshot(): Snapshot {
    return {
      id: this._state.id.value,
      firstName: this._state.firstName,
      lastName: this._state.lastName,
    };
  }
}
