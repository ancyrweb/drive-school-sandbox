import { BrandedId, BrandedIdType } from '../../../shared/lib/id.js';

export class InstructorId extends BrandedId<'InstructorId'> {}
export class InstructorIdType extends BrandedIdType(InstructorId) {}
