import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateInstructorCommand } from '../commands/create-instructor.js';
import { WithAuthContext } from '../annotations/with-auth-context.js';
import { AuthContext } from '../../domain/model/auth-context.js';
import { UpdateInstructorCommand } from '../commands/update-instructor.js';
import { GetCommandPayload } from '../../../shared/lib/command.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('create-instructor')
  async createInstructor(
    @Body() body: GetCommandPayload<CreateInstructorCommand>,
    @WithAuthContext() auth: AuthContext,
  ) {
    return this.commandBus.execute(new CreateInstructorCommand(auth, body));
  }

  @Post('update-instructor')
  async updateInstructor(
    @Body() body: GetCommandPayload<UpdateInstructorCommand>,
    @WithAuthContext() auth: AuthContext,
  ) {
    return this.commandBus.execute(new UpdateInstructorCommand(auth, body));
  }
}
