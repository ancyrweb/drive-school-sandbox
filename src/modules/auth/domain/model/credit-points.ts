import { InvariantException } from '../../../shared/exceptions/invariant-exception.js';

export class CreditPoints {
  constructor(private value: number) {
    if (value < 0) {
      throw new InvariantException('Credit points cannot be negative');
    }
  }

  static empty() {
    return new CreditPoints(0);
  }

  subtract(credit: CreditPoints): CreditPoints {
    return new CreditPoints(this.value - credit.value);
  }

  add(credit: CreditPoints): CreditPoints {
    return new CreditPoints(this.value + credit.value);
  }

  canConsume(value: CreditPoints): boolean {
    return this.value >= value.getValue();
  }

  getValue(): number {
    return this.value;
  }
}
