import { Catch } from '@nestjs/common';
import { ValidationException } from '../../../../shared/exceptions/validation-exception.js';
import { ExceptionResponse } from '../exception-response.js';
import { AbstractExceptionFilter } from './abstract-exception-filter.js';
import { HttpAdapterHost } from '@nestjs/core';

@Catch(ValidationException)
export class ValidationExceptionFilter extends AbstractExceptionFilter<ValidationException> {
  constructor(httpAdapterHost: HttpAdapterHost) {
    super(httpAdapterHost);
  }

  toResponse(exception: ValidationException): ExceptionResponse {
    return {
      statusCode: 400,
      clientCode: 'VALIDATION_ERRORS',
      message: "Invalid request's payload",
      payload: exception.errors,
    };
  }
}
