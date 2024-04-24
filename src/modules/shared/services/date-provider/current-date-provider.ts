import { IDateProvider } from './date-provider.interface.js';

export class CurrentDateProvider implements IDateProvider {
  now(): Date {
    return new Date();
  }
}
