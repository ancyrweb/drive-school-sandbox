import { DomainEvent } from '../../../shared/lib/domain-event.js';

export class InstructorCreatedEvent extends DomainEvent<{
  id: string;
  firstName: string;
  lastName: string;
}> {}
