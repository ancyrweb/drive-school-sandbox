import { Strategy } from 'passport-localapikey';
import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  I_AUTHENTICATOR,
  IAuthenticator,
} from '../authenticator/authenticator.interface.js';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(I_AUTHENTICATOR) private readonly authenticator: IAuthenticator,
  ) {
    super();
  }

  /**
   * The authenticate method will properly throw exceptions if the apikey is invalid
   * @param apikey
   */
  async validate(apikey: string) {
    return this.authenticator.authenticate(apikey);
  }
}
