import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Module,
  NestInterceptor,
} from '@nestjs/common';

import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { PostgreSqlDriver, RequestContext } from '@mikro-orm/postgresql';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Observable, tap } from 'rxjs';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app-controller.js';
import { InstructorModule } from '../../../instructor/infrastructure/nest/instructor-module.js';
import { Instructor } from '../../../instructor/domain/instructor-entity.js';

@Injectable()
class DatabaseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      tap(() => {
        // Each request holds its own fork of the EM instance containing a unique UoW
        // specific to that request. Hence, we can flush the result inside the interceptor
        // right before sending the response but after it has been generated.
        return RequestContext.currentRequestContext()?.em?.flush();
      }),
    );
  }
}

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
