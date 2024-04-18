import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ExceptionResponse } from '../exception-response.js';

export abstract class AbstractExceptionFilter<T> implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: T, host: ArgumentsHost): any {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const body = {
      ...this.toResponse(exception),
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(ctx.getResponse(), body, body.statusCode);
  }

  abstract toResponse(exception: T): ExceptionResponse;
}
