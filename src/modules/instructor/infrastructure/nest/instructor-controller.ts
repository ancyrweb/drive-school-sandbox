import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { CreateInstructorCommand } from '../../application/commands/create-instructor.js';
import { RenameInstructorCommand } from '../../application/commands/rename-instructor.js';
import { AuthSeeds } from '../../../auth/tests/seeds/auth-seeds.js';

@Controller('instructors')
export class InstructorController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('create-instructor')
  async createInstructor(@Body() data: any) {
    return this.commandBus.execute(
      new CreateInstructorCommand(AuthSeeds.admin(), data),
    );
  }

  @HttpCode(200)
  @Post('rename-instructor')
  async renameInstructor(@Body() data: any) {
    return this.commandBus.execute(
      new RenameInstructorCommand(AuthSeeds.admin(), data),
    );
  }
}
