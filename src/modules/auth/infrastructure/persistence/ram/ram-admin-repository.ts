import { GenericRamRepository } from '../../../../shared/repository/generic-ram-repository.js';
import { AdminId } from '../../../domain/entities/admin-id.js';
import { Admin } from '../../../domain/entities/admin.js';
import { IAdminRepository } from '../../../application/ports/admin-repository.js';

export class RamAdminRepository
  extends GenericRamRepository<AdminId, Admin>
  implements IAdminRepository {}
