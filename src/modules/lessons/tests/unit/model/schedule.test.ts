import { DateRange } from '../../../domain/model/date-range.js';
import { Schedule } from '../../../domain/model/schedule.js';

test('available when the schedule is empty', () => {
  const ranges = [];
  const at = new DateRange(
    new Date('2024-01-01T09:00:00Z'),
    new Date('2024-01-01T10:00:00Z'),
  );

  const schedule = new Schedule(ranges);
  expect(schedule.isAvailable(at)).toBe(true);
});

test('not available when the slot is taken', () => {
  const ranges = [
    new DateRange(
      new Date('2024-01-01T08:00:00Z'),
      new Date('2024-01-01T10:00:00Z'),
    ),
  ];

  const at = new DateRange(
    new Date('2024-01-01T09:00:00Z'),
    new Date('2024-01-01T10:00:00Z'),
  );

  const schedule = new Schedule(ranges);
  expect(schedule.isAvailable(at)).toBe(false);
});

test('available between two slots', () => {
  const ranges = [
    new DateRange(
      new Date('2024-01-01T08:00:00Z'),
      new Date('2024-01-01T10:00:00Z'),
    ),
    new DateRange(
      new Date('2024-01-01T12:00:00Z'),
      new Date('2024-01-01T14:00:00Z'),
    ),
  ];

  const at = new DateRange(
    new Date('2024-01-01T10:00:00Z'),
    new Date('2024-01-01T12:00:00Z'),
  );

  const schedule = new Schedule(ranges);
  expect(schedule.isAvailable(at)).toBe(true);
});
