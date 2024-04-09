import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { mergeMap, Observable } from 'rxjs';
import { RequestContext } from '@mikro-orm/postgresql';

@Injectable()
export class DatabaseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      mergeMap(async (response) => {
        await RequestContext.currentRequestContext()?.em?.flush();
        return response;
      }),
    );
  }
}
