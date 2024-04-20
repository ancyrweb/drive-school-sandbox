import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateInstructor } from '../commands/create-instructor.js';
import { WithAuthContext } from '../annotations/with-auth-context.js';
import { AuthContext } from '../../domain/model/auth-context.js';
import { UpdateInstructor } from '../commands/update-instructor.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('create-instructor')
  async createInstructor(
    @Body() body: any,
    @WithAuthContext() auth: AuthContext,
  ) {
    return this.commandBus.execute(new CreateInstructor(auth, body));
  }

  @Post('update-instructor')
  async updateInstructor(
    @Body() body: any,
    @WithAuthContext() auth: AuthContext,
  ) {
    return this.commandBus.execute(new UpdateInstructor(auth, body));
  }
}
