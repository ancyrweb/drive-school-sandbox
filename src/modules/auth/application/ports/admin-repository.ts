import { Optional } from '../../../shared/utils/optional.js';
import { AdminId } from '../../domain/entities/admin-id.js';
import { Admin } from '../../domain/entities/admin.js';

export const I_ADMIN_REPOSITORY = Symbol('I_ADMIN_REPOSITORY');

export interface IAdminRepository {
  findById(id: AdminId): Promise<Optional<Admin>>;
  save(instructor: Admin): Promise<void>;
  delete(instructor: Admin): Promise<void>;
  clear(): Promise<void>;
}
