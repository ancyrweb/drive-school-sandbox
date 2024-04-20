import { DomainEvent } from '../../../shared/lib/domain-event.js';
import { AccountSnapshot } from '../model/account.js';

export class UserCreatedEvent extends DomainEvent<{
  id: string;
  account: AccountSnapshot;
  emailAddress: string;
}> {}
