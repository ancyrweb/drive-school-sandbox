import { Optional } from '../../../shared/utils/optional.js';
import { UserId } from '../../domain/entities/user-id.js';
import { User } from '../../domain/entities/user-entity.js';

export const I_USER_REPOSITORY = Symbol('I_USER_REPOSITORY');

export interface IUserRepository {
  findById(id: UserId): Promise<Optional<User>>;
  findByApiKey(apiKey: string): Promise<Optional<User>>;
  create(instructor: User): Promise<void>;
  update(instructor: User): Promise<void>;
  delete(instructor: User): Promise<void>;
  clear(): Promise<void>;

  isEmailAddressAvailable(emailAddress: string): Promise<boolean>;
}
