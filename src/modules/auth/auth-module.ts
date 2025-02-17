import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { getRepositoryToken, MikroOrmModule } from '@mikro-orm/nestjs';
import { APP_GUARD } from '@nestjs/core';
import { EntityManager } from '@mikro-orm/postgresql';

import { SqlUser } from './infrastructure/persistence/sql/entities/sql-user.js';
import { I_API_KEY_GENERATOR } from './application/services/apikey-generator/apikey-generator.interface.js';
import { ApikeyGenerator } from './application/services/apikey-generator/apikey-generator.js';
import { I_INSTRUCTOR_REPOSITORY } from './application/ports/instructor-repository.js';
import { SqlUserRepository } from './infrastructure/persistence/sql/repositories/sql-user-repository.js';
import { CreateInstructorCommandHandler } from './application/commands/create-instructor.js';
import { I_PASSWORD_STRATEGY } from './application/services/password-strategy/password-strategy.interface.js';
import { Argon2Strategy } from './application/services/password-strategy/argon2-strategy.js';
import { I_AUTHENTICATOR } from './application/services/authenticator/authenticator.interface.js';
import { Authenticator } from './application/services/authenticator/authenticator.js';
import { AuthController } from './application/controllers/auth-controller.js';
import { ApiKeyStrategy } from './application/services/apikey-strategy/api-key-strategy.service.js';
import { AppAuthGuard } from './application/services/app-auth-guard/app-auth-guard.js';
import { SqlInstructorRepository } from './infrastructure/persistence/sql/repositories/sql-instructor-repository.js';
import { SqlInstructor } from './infrastructure/persistence/sql/entities/sql-instructor.js';
import { I_USER_REPOSITORY } from './application/ports/user-repository.js';
import { UpdateInstructorCommandHandler } from './application/commands/update-instructor.js';
import { SqlApikey } from './infrastructure/persistence/sql/entities/sql-apikey.js';

@Module({
  imports: [
    CqrsModule,
    MikroOrmModule.forFeature([SqlUser, SqlApikey, SqlInstructor]),
  ],
  controllers: [AuthController],
  providers: [
    // Adapters
    {
      provide: I_INSTRUCTOR_REPOSITORY,
      inject: [getRepositoryToken(SqlInstructor), EntityManager],
      useFactory: (repository, em) =>
        new SqlInstructorRepository(repository, em),
    },
    {
      provide: I_USER_REPOSITORY,
      inject: [getRepositoryToken(SqlUser), EntityManager],
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
    CreateInstructorCommandHandler,
    UpdateInstructorCommandHandler,
  ],
  exports: [],
})
export class AuthModule {}
