import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateInstructorCommand } from '../../application/commands/create-instructor.js';
import { EntityManager } from '@mikro-orm/postgresql';

@Controller('instructors')
export class InstructorController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly entityManager: EntityManager,
  ) {}

  @Post('create-instructor')
  async createInstructor(@Body() data: any) {
    const result = this.commandBus.execute(new CreateInstructorCommand(data));
    return result;
  }
}
