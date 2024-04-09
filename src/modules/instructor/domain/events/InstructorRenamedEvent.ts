import { DomainEvent } from '../../../shared/domain/domain-event.js';

export class InstructorRenamedEvent extends DomainEvent<{
  instructorId: string;
  firstName: string;
  lastName: string;
}> {}
