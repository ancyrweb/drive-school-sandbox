export const I_PASSWORD_STRATEGY = Symbol('I_PASSWORD_STRATEGY');

export interface IPasswordStrategy {
  hash(password: string): Promise<string>;
  equals(password: string, hash: string): Promise<boolean>;
}
