import { BrandedId, BrandedIdType } from '../../../shared/lib/id.js';

export class UserId extends BrandedId<'UserId'> {}
export class UserIdType extends BrandedIdType(UserId) {}
