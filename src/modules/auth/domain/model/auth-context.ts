import { Role } from '../entities/role.js';

export class AuthContext {
  public readonly id: string;
  public readonly type: Role;

  constructor(props: { id: string; type: Role }) {
    this.id = props.id;
    this.type = props.type;
  }
}
