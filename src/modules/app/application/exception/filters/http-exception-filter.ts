import { Catch, HttpException } from '@nestjs/common';
import { ExceptionResponse } from '../exception-response.js';
import { AbstractExceptionFilter } from './abstract-exception-filter.js';
import { HttpAdapterHost } from '@nestjs/core';

@Catch(HttpException)
export class HttpExceptionFilter extends AbstractExceptionFilter<HttpException> {
  constructor(httpAdapterHost: HttpAdapterHost) {
    super(httpAdapterHost);
  }

  toResponse(exception: HttpException): ExceptionResponse {
    return {
      statusCode: exception.getStatus(),
      clientCode: 'ERROR',
      message: exception.message,
      payload: exception.getResponse(),
    };
  }
}
