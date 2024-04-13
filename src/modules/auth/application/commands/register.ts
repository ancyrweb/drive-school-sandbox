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
} from '../services/password-strategy/password-strategy.js';

export class RegisterCommand extends AbstractCommand<{
  emailAddress: string;
  password: string;
}> {
  getSchema() {
    return z.object({
      emailAddress: z.string().email(),
      password: z.string().min(8).max(128),
    });
  }
}

@CommandHandler(RegisterCommand)
export class RegisterCommandHandler
  implements ICommandHandler<RegisterCommand>
{
  constructor(
    @Inject(I_USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(I_PASSWORD_STRATEGY)
    private readonly passwordStrategy: IPasswordStrategy,
  ) {}

  async execute(command: RegisterCommand) {}
}
