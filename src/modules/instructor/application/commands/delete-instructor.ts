import { AbstractCommand } from '../../../shared/lib/command.js';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  I_INSTRUCTOR_REPOSITORY,
  IInstructorRepository,
} from '../ports/instructor-repository.js';
import { z } from 'zod';
import { Inject } from '@nestjs/common';
import { InstructorId } from '../../domain/entities/instructor-id.js';
import { NotFoundException } from '../../../shared/exceptions/not-found-exception.js';
import { Role } from '../../../auth/domain/entities/role.js';

export class DeleteInstructorCommand extends AbstractCommand<{
  instructorId: string;
}> {
  getSchema() {
    return z.object({
      instructorId: z.string(),
    });
  }

  protected requires(): Role[] {
    return [Role.ADMIN];
  }
}

@CommandHandler(DeleteInstructorCommand)
export class DeleteInstructorCommandHandler
  implements ICommandHandler<DeleteInstructorCommand>
{
  constructor(
    @Inject(I_INSTRUCTOR_REPOSITORY)
    private readonly instructorRepository: IInstructorRepository,
  ) {}

  async execute(command: DeleteInstructorCommand) {
    const { instructorId } = command.props;

    const instructorQuery = await this.instructorRepository.findById(
      new InstructorId(instructorId),
    );

    const instructor = instructorQuery.getOrThrow(
      () => new NotFoundException('Instructor', instructorId),
    );

    await this.instructorRepository.delete(instructor);
  }
}
