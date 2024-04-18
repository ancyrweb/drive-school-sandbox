import { z } from 'zod';
import { AbstractCommand } from '../../../shared/lib/command.js';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  I_INSTRUCTOR_REPOSITORY,
  IInstructorRepository,
} from '../ports/instructor-repository.js';
import { Inject } from '@nestjs/common';
import {
  I_PASSWORD_STRATEGY,
  IPasswordStrategy,
} from '../services/password-strategy/password-strategy.interface.js';
import { Role } from '../../domain/model/role.js';
import { IDDto } from '../../../shared/domain/id-dto.js';
import { BadRequestException } from '../../../shared/exceptions/bad-request-exception.js';
import {
  I_API_KEY_GENERATOR,
  IApiKeyGenerator,
} from '../services/apikey-generator/apikey-generator.interface.js';
import { Instructor } from '../../domain/entities/instructor-entity.js';
import { InstructorId } from '../../domain/entities/instructor-id.js';

export class CreateInstructor extends AbstractCommand<{
  emailAddress: string;
  password: string;
  role: string;
  firstName: string;
  lastName: string;
}> {
  getSchema() {
    return z.object({
      emailAddress: z.string().email(),
      password: z.string().min(8).max(128),
      role: z.string(),
      firstName: z.string(),
      lastName: z.string(),
    });
  }

  protected requires(): Role[] {
    return [Role.ADMIN];
  }
}

@CommandHandler(CreateInstructor)
export class CreateInstructorCommandHandler
  implements ICommandHandler<CreateInstructor, IDDto>
{
  constructor(
    @Inject(I_INSTRUCTOR_REPOSITORY)
    private readonly userRepository: IInstructorRepository,
    @Inject(I_PASSWORD_STRATEGY)
    private readonly passwordStrategy: IPasswordStrategy,
    @Inject(I_API_KEY_GENERATOR)
    private readonly apiKeyGenerator: IApiKeyGenerator,
  ) {}

  async execute({ props }: CreateInstructor) {
    await this.assertEmailAddressIsAvailable(props.emailAddress);

    const user = Instructor.create({
      id: new InstructorId(),
      firstName: props.firstName,
      lastName: props.lastName,
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
