import { DomainEvent } from '../../../shared/lib/domain-event.js';

export class AdminCreatedEvent extends DomainEvent<{
  id: string;
  firstName: string;
  lastName: string;
}> {}
