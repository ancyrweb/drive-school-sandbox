import { BrandedId, BrandedIdType } from '../../../shared/lib/id.js';

export class StudentId extends BrandedId<'StudentId'> {}
export class StudentIdType extends BrandedIdType(StudentId) {}
