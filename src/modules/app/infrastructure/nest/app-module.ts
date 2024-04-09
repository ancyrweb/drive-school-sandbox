import { Module } from '@nestjs/common';

import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app-controller.js';
import { InstructorModule } from '../../../instructor/infrastructure/nest/instructor-module.js';
import { Instructor } from '../../../instructor/domain/instructor-entity.js';
import { DatabaseInterceptor } from './database-interceptor.js';

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
          entities: [Instructor],
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

    InstructorModule,
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
