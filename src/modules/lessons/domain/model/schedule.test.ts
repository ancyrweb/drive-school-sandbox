import { DateRange } from './date-range.js';
import { Schedule } from './schedule.js';

test('should be available', () => {
  const ranges = [];
  const at = new DateRange(
    new Date('2024-01-01T09:00:00Z'),
    new Date('2024-01-01T10:00:00Z'),
  );

  const schedule = new Schedule(ranges);
  expect(schedule.isAvailable(at)).toBe(true);
});

test('should not be available', () => {
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

test('should be available', () => {
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
