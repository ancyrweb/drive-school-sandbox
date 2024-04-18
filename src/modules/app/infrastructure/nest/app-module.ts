import { Module } from '@nestjs/common';

import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app-controller.js';
import { DatabaseInterceptor } from './database-interceptor.js';
import { User } from '../../../auth/domain/entities/user-entity.js';
import { AuthModule } from '../../../auth/auth-module.js';

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: () => {
        const isTestEnvironment = process.env.NODE_ENV === 'test';

        return {
          metadataProvider: TsMorphMetadataProvider,
          clientUrl:
            'postgresql://driveschool:password123@localhost:5432/driveschool',
          driver: PostgreSqlDriver,
          entities: [User],
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
  ],
})
export class AppModule {}
