import { BrandedId, BrandedIdType } from '../../../shared/domain/id.js';

export class InstructorId extends BrandedId<'InstructorId'> {}
export class InstructorIdType extends BrandedIdType(InstructorId) {}
