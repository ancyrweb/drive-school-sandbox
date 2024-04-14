import bcrypt from 'bcrypt';
import { IPasswordStrategy } from './password-strategy.js';

export class BcryptStrategy implements IPasswordStrategy {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async equals(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
