import { Catch } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { ExceptionResponse } from '../exception-response.js';
import { BadRequestException } from '../../../../shared/exceptions/bad-request-exception.js';
import { AbstractExceptionFilter } from './abstract-exception-filter.js';

@Catch(BadRequestException)
export class BadRequestExceptionFilter extends AbstractExceptionFilter<BadRequestException> {
  constructor(httpAdapterHost: HttpAdapterHost) {
    super(httpAdapterHost);
  }

  toResponse(exception: BadRequestException): ExceptionResponse {
    return {
      statusCode: 400,
      clientCode: 'BAD_REQUEST',
      message: exception.message,
      payload: null,
    };
  }
}
