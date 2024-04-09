import { AbstractCommand } from '../../../shared/domain/command.js';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  I_INSTRUCTOR_REPOSITORY,
  IInstructorRepository,
} from '../ports/instructor-repository.js';
import { z } from 'zod';
import { Inject } from '@nestjs/common';
import { InstructorId } from '../../domain/entities/instructor-id.js';
import { NotFoundException } from '../../../shared/exceptions/not-found-exception.js';

export class RenameInstructorCommand extends AbstractCommand<{
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
        firstName: z.string().min(2).max(128),
        lastName: z.string().min(2).max(128),
      }),
    });
  }
}

@CommandHandler(RenameInstructorCommand)
export class RenameInstructorCommandHandler
  implements ICommandHandler<RenameInstructorCommand>
{
  constructor(
    @Inject(I_INSTRUCTOR_REPOSITORY)
    private readonly instructorRepository: IInstructorRepository,
  ) {}

  async execute(command: RenameInstructorCommand) {
    const { instructorId, payload } = command.props;

    const instructorQuery = await this.instructorRepository.findById(
      new InstructorId(instructorId),
    );

    const instructor = instructorQuery.getOrThrow(
      () => new NotFoundException('Instructor', instructorId),
    );

    instructor.rename(payload.firstName, payload.lastName);

    await this.instructorRepository.update(instructor);
  }
}
