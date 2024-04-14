import { ZodError } from 'zod';

export class ValidationException extends Error {
  constructor(public readonly errors: ZodError) {
    super(errors.message);
    this.name = 'BadRequestException';
  }
}
