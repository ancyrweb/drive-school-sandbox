import { Role } from './role.js';
import { UserId } from '../entities/user-id.js';

export class AuthContext {
  public readonly id: UserId;
  public readonly type: Role;

  constructor(props: { id: UserId; type: Role }) {
    this.id = props.id;
    this.type = props.type;
  }
}
