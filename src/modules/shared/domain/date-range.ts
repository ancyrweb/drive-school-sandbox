import { InvariantException } from '../exceptions/invariant-exception.js';
import { Seconds } from './seconds.js';

export type DateRangeSnapshot = {
  start: string;
  end: string;
};

export class DateRange {
  constructor(
    public readonly start: Date,
    public readonly end: Date,
  ) {
    if (start.getTime() > end.getTime()) {
      throw new InvariantException(
        'Start date cannot be greater than end date',
      );
    }
  }

  static fromSnapshot(snapshot: DateRangeSnapshot): DateRange {
    return new DateRange(new Date(snapshot.start), new Date(snapshot.end));
  }

  takeSnapshot(): DateRangeSnapshot {
    return {
      start: this.start.toISOString(),
      end: this.end.toISOString(),
    };
  }

  duration(): Seconds {
    return new Seconds((this.end.getTime() - this.start.getTime()) / 1000);
  }
}
