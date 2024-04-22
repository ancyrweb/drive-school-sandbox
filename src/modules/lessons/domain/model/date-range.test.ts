import { DateRange } from './date-range.js';

test('creating a date range with invalid dates should throw an error', () => {
  expect(() => {
    new DateRange(new Date('2021-01-02'), new Date('2021-01-01'));
  }).toThrowError('Start date cannot be greater than end date');
});

test('when the delay between 2 dates is 1 hour, return 1 hour', () => {
  const dateRange = new DateRange(
    new Date('2021-01-01T00:00:00Z'),
    new Date('2021-01-01T01:00:00Z'),
  );

  expect(dateRange.duration().asHours()).toBe(1);
});

test('when the start date is not minute aligned should throw', () => {
  expect(() => {
    new DateRange(
      new Date('2021-01-01T00:01:00Z'),
      new Date('2021-01-01T01:00:00Z'),
    );
  }).toThrowError('dates must be aligned to the hour');
});

test('when the end date is not minute aligned should throw', () => {
  expect(() => {
    new DateRange(
      new Date('2021-01-01T00:00:00Z'),
      new Date('2021-01-01T01:01:00Z'),
    );
  }).toThrowError('dates must be aligned to the hour');
});

test('when the start date is not second aligned should throw', () => {
  expect(() => {
    new DateRange(
      new Date('2021-01-01T00:00:01Z'),
      new Date('2021-01-01T01:00:00Z'),
    );
  }).toThrowError('dates must be aligned to the hour');
});

test('when the end date is not second aligned should throw', () => {
  expect(() => {
    new DateRange(
      new Date('2021-01-01T00:00:00Z'),
      new Date('2021-01-01T01:00:01Z'),
    );
  }).toThrowError('dates must be aligned to the hour');
});

test('taking a snapshot', () => {
  const dateRange = new DateRange(
    new Date('2021-01-01T00:00:00Z'),
    new Date('2021-01-01T01:00:00Z'),
  );

  expect(dateRange.takeSnapshot()).toEqual({
    start: '2021-01-01T00:00:00.000Z',
    end: '2021-01-01T01:00:00.000Z',
  });
});

test('restoring from a snapshot', () => {
  const snapshot = {
    start: '2021-01-01T00:00:00.000Z',
    end: '2021-01-01T01:00:00.000Z',
  };

  const dateRange = DateRange.fromSnapshot(snapshot);

  expect(dateRange).toEqual(
    new DateRange(
      new Date('2021-01-01T00:00:00Z'),
      new Date('2021-01-01T01:00:00Z'),
    ),
  );
});
