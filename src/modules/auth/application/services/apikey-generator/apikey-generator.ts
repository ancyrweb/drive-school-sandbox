import { IApiKeyGenerator } from './apikey-generator.interface.js';
import { Inject, Injectable } from '@nestjs/common';
import {
  I_USER_REPOSITORY,
  IUserRepository,
} from '../../ports/user-repository.js';
import { Apikey } from '../../../domain/entities/apikey.js';

@Injectable()
export class ApikeyGenerator implements IApiKeyGenerator {
  constructor(
    @Inject(I_USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  protected randomString() {
    return Math.random().toString(36).substring(2);
  }

  async generate() {
    for (let i = 0; i < 100; i++) {
      const nextApiKey = this.randomString();
      const userWithApikey = await this.userRepository.findByApiKey(nextApiKey);
      if (userWithApikey.isNull()) {
        return Apikey.generate(nextApiKey);
      }
    }

    throw new Error('Could not generate an apikey');
  }
}
