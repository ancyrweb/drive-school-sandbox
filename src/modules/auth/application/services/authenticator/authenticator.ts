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
    @Inject(I_USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  public async authenticate(apiKey: string) {
    const userQuery = await this.userRepository.findByApiKey(apiKey);
    if (userQuery.isNull()) {
      throw new UnauthorizedException('Invalid API Key');
    }

    const user = userQuery.getOrThrow();
    return new AuthContext({
      id: user.id,
      type: user.role,
    });
  }
}
