import { UserId } from '../entities/user-id.js';
import { Account } from './account.js';
import { BrandedId } from '../../../shared/lib/id.js';

export class AuthContext {
  private readonly userId: UserId;
  private readonly account: Account;

  constructor(props: { userId: UserId; account: Account }) {
    this.userId = props.userId;
    this.account = props.account;
  }

  /**
   * Return true if the authenticated user correspond to the ID
   * Since a user has an underlying account, it will match against
   * both the user and the account
   * @param id
   */
  is(id: BrandedId<any>) {
    return this.userId.equals(id) || this.account.getId().equals(id);
  }

  getAccountType() {
    return this.account.getType();
  }

  isAdmin() {
    return this.account.getType() === 'admin';
  }
}
