import { DateRange } from './date-range.js';

const hours = (a: string, b: string) =>
  new DateRange(
    new Date(`2021-01-01T${a}:00:00Z`),
    new Date(`2021-01-01T${b}:00:00Z`),
  );

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
    start: new Date('2021-01-01T00:00:00Z'),
    end: new Date('2021-01-01T01:00:00Z'),
  });
});

test('restoring from a snapshot', () => {
  const snapshot = {
    start: new Date('2021-01-01T00:00:00.000Z'),
    end: new Date('2021-01-01T01:00:00.000Z'),
  };

  const dateRange = DateRange.fromSnapshot(snapshot);

  expect(dateRange).toEqual(
    new DateRange(
      new Date('2021-01-01T00:00:00Z'),
      new Date('2021-01-01T01:00:00Z'),
    ),
  );
});

test('not overlapping', () => {
  const dateRange = new DateRange(
    new Date('2021-01-01T00:00:00Z'),
    new Date('2021-01-01T02:00:00Z'),
  );

  const overlapping = new DateRange(
    new Date('2021-01-01T02:00:00Z'),
    new Date('2021-01-01T04:00:00Z'),
  );

  expect(dateRange.overlaps(overlapping)).toBe(false);
});

test.each([
  [hours('00', '02'), hours('02', '04')],
  [hours('00', '01'), hours('02', '03')],
])('not overlapping', (first, second) => {
  expect(first.overlaps(second)).toBe(false);
});

test.each([
  [hours('00', '02'), hours('01', '03')],
  [hours('01', '03'), hours('00', '02')],
  [hours('02', '04'), hours('02', '04')],
])('overlapping', (first, second) => {
  expect(first.overlaps(second)).toBe(true);
});
