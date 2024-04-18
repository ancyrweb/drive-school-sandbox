import { z } from 'zod';
import { AbstractCommand } from '../../../shared/lib/command.js';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  I_USER_REPOSITORY,
  IUserRepository,
} from '../ports/user-repository.js';
import { Inject } from '@nestjs/common';
import {
  I_PASSWORD_STRATEGY,
  IPasswordStrategy,
} from '../services/password-strategy/password-strategy.interface.js';
import { Role } from '../../domain/entities/role.js';
import { IDDto } from '../../../shared/domain/id-dto.js';
import { User } from '../../domain/entities/user-entity.js';
import { UserId } from '../../domain/entities/user-id.js';
import { BadRequestException } from '../../../shared/exceptions/bad-request-exception.js';
import {
  I_API_KEY_GENERATOR,
  IApiKeyGenerator,
} from '../services/apikey-generator/apikey-generator.interface.js';

export class CreateUserCommand extends AbstractCommand<{
  emailAddress: string;
  password: string;
  role: string;
}> {
  getSchema() {
    return z.object({
      emailAddress: z.string().email(),
      password: z.string().min(8).max(128),
      role: z.string(),
    });
  }

  protected requires(): Role[] {
    return [Role.ADMIN];
  }
}

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand, IDDto>
{
  constructor(
    @Inject(I_USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(I_PASSWORD_STRATEGY)
    private readonly passwordStrategy: IPasswordStrategy,
    @Inject(I_API_KEY_GENERATOR)
    private readonly apiKeyGenerator: IApiKeyGenerator,
  ) {}

  async execute({ props }: CreateUserCommand) {
    await this.assertEmailAddressIsAvailable(props.emailAddress);

    const user = User.create({
      id: new UserId(),
      emailAddress: props.emailAddress,
      password: await this.passwordStrategy.hash(props.password),
      apiKey: await this.apiKeyGenerator.generate(),
      role: Role.create(props.role),
    });

    await this.userRepository.create(user);

    return {
      id: user.id.value,
    };
  }

  private async assertEmailAddressIsAvailable(emailAddress: string) {
    const isEmailAddressAvailable =
      await this.userRepository.isEmailAddressAvailable(emailAddress);

    if (!isEmailAddressAvailable) {
      throw new BadRequestException('Email address is already taken');
    }
  }
}
