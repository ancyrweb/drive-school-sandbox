import { IApiKeyGenerator } from './apikey-generator.interface.js';
import {
  I_INSTRUCTOR_REPOSITORY,
  IInstructorRepository,
} from '../../ports/instructor-repository.js';
import { Inject, Injectable } from '@nestjs/common';
import { ApikeyEntity } from '../../../domain/entities/apikey-entity.js';

@Injectable()
export class ApikeyGenerator implements IApiKeyGenerator {
  constructor(
    @Inject(I_INSTRUCTOR_REPOSITORY)
    private readonly userRepository: IInstructorRepository,
  ) {}

  protected randomString() {
    return Math.random().toString(36).substring(2);
  }

  async generate() {
    for (let i = 0; i < 100; i++) {
      const nextApiKey = this.randomString();
      const userWithApikey = await this.userRepository.findByApiKey(nextApiKey);
      if (userWithApikey.isNull()) {
        return ApikeyEntity.generate(nextApiKey);
      }
    }

    throw new Error('Could not generate an apikey');
  }
}
