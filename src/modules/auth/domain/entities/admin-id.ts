import { BrandedId, BrandedIdType } from '../../../shared/lib/id.js';

export class AdminId extends BrandedId<'AdminId'> {}
export class AdminIdType extends BrandedIdType(AdminId) {}
