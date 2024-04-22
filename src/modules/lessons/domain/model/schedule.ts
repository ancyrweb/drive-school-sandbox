import { DateRange } from '../../../shared/domain/date-range.js';

export class Schedule {
  isAvailable(range: DateRange) {
    return true;
  }
}
