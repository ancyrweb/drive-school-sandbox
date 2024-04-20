import { z } from 'zod';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { AbstractCommand } from '../../../shared/lib/command.js';
import {
  I_INSTRUCTOR_REPOSITORY,
  IInstructorRepository,
} from '../ports/instructor-repository.js';
import { Role } from '../../domain/model/role.js';
import { InstructorId } from '../../domain/entities/instructor-id.js';
import { NotFoundException } from '../../../shared/exceptions/not-found-exception.js';

export class UpdateInstructor extends AbstractCommand<{
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

  protected requires(): Role[] {
    return [Role.ADMIN];
  }
}

@CommandHandler(UpdateInstructor)
export class UpdateInstructorCommandHandler
  implements ICommandHandler<UpdateInstructor>
{
  constructor(
    @Inject(I_INSTRUCTOR_REPOSITORY)
    private readonly instructorRepository: IInstructorRepository,
  ) {}

  async execute({ props }: UpdateInstructor) {
    const instructor = await this.instructorRepository
      .findById(new InstructorId(props.instructorId))
      .then((q) =>
        q.getOrThrow(
          () => new NotFoundException('Instructor', props.instructorId),
        ),
      );

    instructor.update(props.payload);

    await this.instructorRepository.save(instructor);
  }
}
