import { z } from 'zod';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { AbstractCommand } from '../../../shared/lib/command.js';
import {
  I_INSTRUCTOR_REPOSITORY,
  IInstructorRepository,
} from '../ports/instructor-repository.js';
import {
  I_PASSWORD_STRATEGY,
  IPasswordStrategy,
} from '../services/password-strategy/password-strategy.interface.js';
import { BadRequestException } from '../../../shared/exceptions/bad-request-exception.js';
import {
  I_API_KEY_GENERATOR,
  IApiKeyGenerator,
} from '../services/apikey-generator/apikey-generator.interface.js';
import { InstructorId } from '../../domain/entities/instructor-id.js';
import {
  I_USER_REPOSITORY,
  IUserRepository,
} from '../ports/user-repository.js';
import { UserId } from '../../domain/entities/user-id.js';
import { User } from '../../domain/entities/user.js';
import { Instructor } from '../../domain/entities/instructor.js';
import { AccountType } from '../../domain/model/account.js';

type Output = {
  instructorId: string;
  userId: string;
};

export class CreateInstructor extends AbstractCommand<{
  id: string;
  emailAddress: string;
  password: string;
  firstName: string;
  lastName: string;
}> {
  getSchema() {
    return z.object({
      id: z.string(),
      emailAddress: z.string().email(),
      password: z.string().min(8).max(128),
      firstName: z.string(),
      lastName: z.string(),
    });
  }

  protected requires(): AccountType[] {
    return ['admin'];
  }
}

@CommandHandler(CreateInstructor)
export class CreateInstructorCommandHandler
  implements ICommandHandler<CreateInstructor>
{
  constructor(
    @Inject(I_USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(I_INSTRUCTOR_REPOSITORY)
    private readonly instructorRepository: IInstructorRepository,
    @Inject(I_PASSWORD_STRATEGY)
    private readonly passwordStrategy: IPasswordStrategy,
    @Inject(I_API_KEY_GENERATOR)
    private readonly apiKeyGenerator: IApiKeyGenerator,
  ) {}

  async execute({ props }: CreateInstructor) {
    await this.assertEmailAddressIsAvailable(props.emailAddress);

    const instructor = Instructor.newAccount({
      id: new InstructorId(props.id),
      firstName: props.firstName,
      lastName: props.lastName,
    });

    const user = User.newAccount({
      id: new UserId(props.id),
      account: {
        type: 'instructor',
        id: instructor.getId(),
      },
      emailAddress: props.emailAddress,
      password: await this.passwordStrategy.hash(props.password),
      apikey: await this.apiKeyGenerator.generate(),
    });

    await this.userRepository.save(user);
    await this.instructorRepository.save(instructor);
  }

  private async assertEmailAddressIsAvailable(emailAddress: string) {
    const isEmailAddressAvailable =
      await this.userRepository.isEmailAddressAvailable(emailAddress);

    if (!isEmailAddressAvailable) {
      throw new BadRequestException('Email address is already taken');
    }
  }
}
