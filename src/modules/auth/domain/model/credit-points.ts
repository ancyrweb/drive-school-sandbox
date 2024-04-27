import { InvariantException } from '../../../shared/exceptions/invariant-exception.js';

export class CreditPoints {
  constructor(private value: number) {
    if (value < 0) {
      throw new InvariantException('Credit points cannot be negative');
    }
  }

  subtract(credit: CreditPoints): CreditPoints {
    return new CreditPoints(this.value - credit.value);
  }

  add(credit: CreditPoints): CreditPoints {
    return new CreditPoints(this.value + credit.value);
  }

  canConsume(credit: CreditPoints): boolean {
    return this.value >= credit.value;
  }

  asNumber(): number {
    return this.value;
  }
}
