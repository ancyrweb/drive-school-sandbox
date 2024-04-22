import { DateRange } from './date-range.js';

export interface ISchedule {
  isAvailable(range: DateRange): boolean;
}
