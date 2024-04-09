import { BrandedId, DbIdType, IdProvider } from '../../../shared/domain/id.js';

export class InstructorId extends BrandedId('InstructorId') {
  static generate() {
    return new InstructorId(IdProvider.generate());
  }
}

export class InstructorIdType extends DbIdType<InstructorId> {
  create(value: string): InstructorId {
    return new InstructorId(value);
  }
}
