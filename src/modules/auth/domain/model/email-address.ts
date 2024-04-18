import { z } from 'zod';
import { InvariantException } from '../../../shared/exceptions/invariant-exception.js';

export class EmailAddress {
  constructor(public readonly value: string) {
    const result = z.string().email().safeParse(value);
    if (!result.success) {
      throw new InvariantException('Invalid email address');
    }
  }
}
