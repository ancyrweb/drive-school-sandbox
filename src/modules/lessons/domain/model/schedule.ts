import { DateRange } from './date-range.js';
import { ISchedule } from './schedule.interface.js';

export class Schedule implements ISchedule {
  constructor(private readonly dateRanges: DateRange[]) {}

  isAvailable(range: DateRange) {
    return this.dateRanges.every((dateRange) => !dateRange.overlaps(range));
  }
}
