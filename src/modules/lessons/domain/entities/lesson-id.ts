import { BrandedId, BrandedIdType } from '../../../shared/lib/id.js';

export class LessonId extends BrandedId<'LessonId'> {}
export class LessonIdType extends BrandedIdType(LessonId) {}
