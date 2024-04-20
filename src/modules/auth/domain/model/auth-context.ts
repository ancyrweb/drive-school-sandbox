import { UserId } from '../entities/user-id.js';
import { Account } from './account.js';

export class AuthContext {
  private readonly userId: UserId;
  private readonly account: Account;

  constructor(props: { userId: UserId; accountType: Account }) {
    this.userId = props.userId;
    this.account = props.accountType;
  }

  getAccountType() {
    return this.account.type;
  }
}
