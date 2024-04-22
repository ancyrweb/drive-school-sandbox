import { InvariantException } from '../../../shared/exceptions/invariant-exception.js';
import { Seconds } from '../../../shared/domain/seconds.js';

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

    if (start.getMinutes() !== 0 || end.getMinutes() !== 0) {
      throw new InvariantException('dates must be aligned to the hour');
    }

    if (start.getSeconds() !== 0 || end.getSeconds() !== 0) {
      throw new InvariantException('dates must be aligned to the hour');
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

  overlaps(other: DateRange): boolean {
    return (
      (other.start.getTime() >= this.start.getTime() &&
        other.start.getTime() < this.end.getTime()) ||
      (other.end.getTime() > this.start.getTime() &&
        other.end.getTime() < this.end.getTime())
    );
  }
}
