import * as argon2 from 'argon2';
import { IPasswordStrategy } from './password-strategy.js';

export class Argon2Strategy implements IPasswordStrategy {
  async hash(password: string): Promise<string> {
    return argon2.hash(password);
  }

  async equals(password: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }
}
