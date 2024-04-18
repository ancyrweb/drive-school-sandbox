import { BrandedId, BrandedIdType } from '../../../shared/lib/id.js';

export class ApikeyId extends BrandedId<'ApikeyId'> {}
export class ApikeyIdType extends BrandedIdType(ApikeyId) {}
