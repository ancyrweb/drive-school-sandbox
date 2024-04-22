import { BrandedId } from '../../../../shared/lib/id.js';
import { Schedule } from '../../../domain/model/schedule.js';

export interface IScheduleService {
  findAtDay(accountId: BrandedId<any>, date: Date): Promise<Schedule>;
}
