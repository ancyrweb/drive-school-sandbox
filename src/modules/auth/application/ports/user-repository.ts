import { Optional } from '../../../shared/utils/optional.js';
import { UserId } from '../../domain/entities/user-id.js';
import { User } from '../../domain/entities/user.js';

export const I_USER_REPOSITORY = Symbol('I_USER_REPOSITORY');

export interface IUserRepository {
  findById(id: UserId): Promise<Optional<User>>;
  findByApiKey(value: string): Promise<Optional<User>>;
  isEmailAddressAvailable(emailAddress: string): Promise<boolean>;

  save(user: User): Promise<void>;
  delete(user: User): Promise<void>;
  clear(): Promise<void>;
}
