import { IAuthenticator } from './authenticator.interface.js';
import { AuthContext } from '../../../domain/model/auth-context.js';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
  I_USER_REPOSITORY,
  IUserRepository,
} from '../../ports/user-repository.js';

@Injectable()
export class Authenticator implements IAuthenticator {
  constructor(
    @Inject(I_USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  public async authenticate(apikey: string) {
    const user = await this.userRepository
      .findByApiKey(apikey)
      .then((q) =>
        q.getOrThrow(() => new UnauthorizedException('Invalid API Key')),
      );

    return new AuthContext({
      userId: user.getId(),
      accountType: user.getAccount(),
    });
  }
}
