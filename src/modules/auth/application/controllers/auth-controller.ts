import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateInstructor } from '../commands/create-instructor.js';
import { WithAuthContext } from '../annotations/with-auth-context.js';
import { AuthContext } from '../../domain/model/auth-context.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('create-user')
  async createUser(@Body() body: any, @WithAuthContext() auth: AuthContext) {
    return this.commandBus.execute(new CreateInstructor(auth, body));
  }
}
