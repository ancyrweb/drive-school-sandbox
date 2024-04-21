import { Module } from '@nestjs/common';

import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './application/controllers/app-controller.js';
import { DatabaseInterceptor } from './application/interceptors/database-interceptor.js';
import { SqlUser } from '../auth/infrastructure/persistence/sql/entities/sql-user.js';
import { AuthModule } from '../auth/auth-module.js';
import { ValidationExceptionFilter } from './application/exception/filters/validation-exception-filter.js';
import { BadRequestExceptionFilter } from './application/exception/filters/bad-request-exception-filter.js';
import { HttpExceptionFilter } from './application/exception/filters/http-exception-filter.js';
import { SqlApikey } from '../auth/infrastructure/persistence/sql/entities/sql-apikey.js';
import { SqlInstructor } from '../auth/infrastructure/persistence/sql/entities/sql-instructor.js';

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: () => {
        const isTestEnvironment = process.env.NODE_ENV === 'test';
        const clientUrl = isTestEnvironment
          ? 'postgresql://driveschooltest:password123@localhost:7654/driveschooltest'
          : 'postgresql://driveschool:password123@localhost:5432/driveschool';

        return {
          metadataProvider: TsMorphMetadataProvider,
          clientUrl,
          driver: PostgreSqlDriver,
          entities: [SqlUser, SqlApikey, SqlInstructor],
          discovery: {
            warnWhenNoEntities: false,
          },
          ...(isTestEnvironment
            ? {
                allowGlobalContext: true,
              }
            : {}),
        };
      },
    }),

    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: DatabaseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ValidationExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: BadRequestExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
