import { IDateProvider } from './date-provider.interface.js';

export class FixedDateProvider implements IDateProvider {
  constructor(private date = new Date()) {}

  now(): Date {
    return this.date;
  }

  changeTo(date: Date): void {
    this.date = date;
  }
}
