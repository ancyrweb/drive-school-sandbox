import { DomainEvent } from '../../../shared/lib/domain-event.js';

export class UserCreatedEvent extends DomainEvent<{
  id: string;
  account: {
    type: 'instructor' | 'student' | 'admin';
    id: string;
  };
  emailAddress: string;
}> {}
