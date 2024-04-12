import { AbstractCommand } from '../../../shared/domain/command.js';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IDDto } from '../../../shared/domain/id-dto.js';
import {
  I_INSTRUCTOR_REPOSITORY,
  IInstructorRepository,
} from '../ports/instructor-repository.js';
import { z } from 'zod';
import { Instructor } from '../../domain/entities/instructor-entity.js';
import { InstructorId } from '../../domain/entities/instructor-id.js';
import { Inject } from '@nestjs/common';

export class CreateInstructorCommand extends AbstractCommand<{
  firstName: string;
  lastName: string;
}> {
  getSchema() {
    return z.object({
      firstName: z.string().min(2).max(128),
      lastName: z.string().min(2).max(128),
    });
  }
}

@CommandHandler(CreateInstructorCommand)
export class CreateInstructorCommandHandler
  implements ICommandHandler<CreateInstructorCommand, IDDto>
{
  constructor(
    @Inject(I_INSTRUCTOR_REPOSITORY)
    private readonly instructorRepository: IInstructorRepository,
  ) {}

  async execute(command: CreateInstructorCommand) {
    const instructor = new Instructor({
      id: new InstructorId(),
      firstName: command.props.firstName,
      lastName: command.props.lastName,
    });

    await this.instructorRepository.create(instructor);

    return {
      id: instructor.id.value,
    };
  }
}
