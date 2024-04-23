import { BrandedId } from '../../../shared/lib/id.js';
import { ISchedule } from '../../domain/model/schedule.interface.js';

export const I_SCHEDULE_PROVIDER = Symbol('I_SCHEDULE_PROVIDER');

export interface IScheduleProvider {
  findAtDay(accountId: BrandedId<any>, date: Date): Promise<ISchedule>;
}
