import { DomainEvent } from '../../../shared/lib/domain-event.js';

export class InstructorUpdatedEvent extends DomainEvent<{
  id: string;
  newFirstName: string;
  newLastName: string;
}> {}
