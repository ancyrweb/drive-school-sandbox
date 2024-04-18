import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { getRepositoryToken, MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './domain/entities/user-entity.js';
import { I_API_KEY_GENERATOR } from './application/services/apikey-generator/apikey-generator.interface.js';
import { ApikeyGenerator } from './application/services/apikey-generator/apikey-generator.js';
import { I_USER_REPOSITORY } from './application/ports/user-repository.js';
import { SqlUserRepository } from './infrastructure/persistence/sql/sql-user-repository.js';
import { CreateUserCommandHandler } from './application/commands/create-user.js';
import { I_PASSWORD_STRATEGY } from './application/services/password-strategy/password-strategy.interface.js';
import { Argon2Strategy } from './application/services/password-strategy/argon2-strategy.js';
import { I_AUTHENTICATOR } from './application/services/authenticator/authenticator.interface.js';
import { Authenticator } from './application/services/authenticator/authenticator.js';
import { AuthController } from './application/controllers/auth-controller.js';
import { ApiKeyStrategy } from './application/services/apikey-strategy/api-key-strategy.service.js';
import { APP_GUARD } from '@nestjs/core';
import { AppAuthGuard } from './application/services/app-auth-guard/app-auth-guard.js';
import { EntityManager } from '@mikro-orm/postgresql';

@Module({
  imports: [CqrsModule, MikroOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [
    // Adapters
    {
      provide: I_USER_REPOSITORY,
      inject: [getRepositoryToken(User), EntityManager],
      useFactory: (repository, em) => new SqlUserRepository(repository, em),
    },
    // Services
    {
      provide: I_API_KEY_GENERATOR,
      useClass: ApikeyGenerator,
    },
    {
      provide: I_PASSWORD_STRATEGY,
      useClass: Argon2Strategy,
    },
    {
      provide: I_AUTHENTICATOR,
      useClass: Authenticator,
    },
    {
      provide: APP_GUARD,
      useClass: AppAuthGuard,
    },
    ApiKeyStrategy,
    // Commands & Queries
    CreateUserCommandHandler,
  ],
  exports: [],
})
export class AuthModule {}
