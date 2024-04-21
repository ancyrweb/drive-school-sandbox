import { Catch } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ExceptionResponse } from '../exception-response.js';
import { AbstractExceptionFilter } from './abstract-exception-filter.js';
import { NotAuthorizedException } from '../../../../shared/exceptions/not-authorized-exception.js';

@Catch(NotAuthorizedException)
export class NotAuthorizedExceptionFilter extends AbstractExceptionFilter<NotAuthorizedException> {
  constructor(httpAdapterHost: HttpAdapterHost) {
    super(httpAdapterHost);
  }

  toResponse(exception: NotAuthorizedException): ExceptionResponse {
    return {
      statusCode: 401,
      clientCode: 'NOT_AUTHORIZED',
      message: 'You are not authorized to perform this action',
      payload: null,
    };
  }
}
