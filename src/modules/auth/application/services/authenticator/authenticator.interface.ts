import { AuthContext } from '../../../domain/model/auth-context.js';

export const I_AUTHENTICATOR = Symbol('I_AUTHENTICATOR');

export interface IAuthenticator {
  authenticate(apiKey: string): Promise<AuthContext>;
}
