import { z } from 'zod';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { AbstractCommand } from '../../../shared/lib/command.js';
import {
  I_INSTRUCTOR_REPOSITORY,
  IInstructorRepository,
} from '../ports/instructor-repository.js';
import { InstructorId } from '../../domain/entities/instructor-id.js';
import { NotFoundException } from '../../../shared/exceptions/not-found-exception.js';
import { AuthContext } from '../../domain/model/auth-context.js';
import { Instructor } from '../../domain/entities/instructor.js';
import { NotAuthorizedException } from '../../../shared/exceptions/not-authorized-exception.js';

export class UpdateInstructorCommand extends AbstractCommand<{
  instructorId: string;
  payload: {
    firstName: string;
    lastName: string;
  };
}> {
  getSchema() {
    return z.object({
      instructorId: z.string(),
      payload: z.object({
        firstName: z.string(),
        lastName: z.string(),
      }),
    });
  }

  protected isAuthorized(auth) {
    return auth.isAdmin() || auth.isInstructor();
  }
}

@CommandHandler(UpdateInstructorCommand)
export class UpdateInstructorCommandHandler
  implements ICommandHandler<UpdateInstructorCommand>
{
  constructor(
    @Inject(I_INSTRUCTOR_REPOSITORY)
    private readonly instructorRepository: IInstructorRepository,
  ) {}

  async execute({ auth, props }: UpdateInstructorCommand) {
    const instructor = await this.instructorRepository
      .findById(new InstructorId(props.instructorId))
      .then((q) =>
        q.getOrThrow(
          () => new NotFoundException('Instructor', props.instructorId),
        ),
      );

    this.verifyAuthorization(auth, instructor);

    instructor.update(props.payload);
    await this.instructorRepository.save(instructor);
  }

  verifyAuthorization(auth: AuthContext, instructor: Instructor) {
    if (auth.isAdmin() || auth.is(instructor.getId())) {
      return;
    }

    throw new NotAuthorizedException();
  }
}
