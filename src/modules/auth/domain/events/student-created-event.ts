import { DomainEvent } from '../../../shared/lib/domain-event.js';

export class StudentCreatedEvent extends DomainEvent<{
  id: string;
  firstName: string;
  lastName: string;
  creditPoints: number;
}> {}
