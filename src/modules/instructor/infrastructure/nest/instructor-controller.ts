import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateInstructorCommand } from '../../application/commands/create-instructor.js';

@Controller('instructors')
export class InstructorController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('create-instructor')
  createInstructor(@Body() data: any) {
    return this.commandBus.execute(new CreateInstructorCommand(data));
  }
}
