import { Body, Controller, Post, Request } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../commands/create-user.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('create-user')
  async createUser(@Body() body: any, @Request() req: any) {
    return this.commandBus.execute(new CreateUserCommand(req.user, body));
  }
}
