import { DomainEvent } from '../../../shared/lib/domain-event.js';

export class InstructorRenamedEvent extends DomainEvent<{
  instructorId: string;
  firstName: string;
  lastName: string;
}> {}
