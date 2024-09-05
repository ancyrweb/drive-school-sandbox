import { DateRange } from './date-range.js';

const hours = (a: string, b: string) =>
  new DateRange(
    new Date(`2021-01-01T${a}:00:00Z`),
    new Date(`2021-01-01T${b}:00:00Z`),
  );

test('start date must be before end date', () => {
  expect(() => {
    new DateRange(new Date('2021-01-02'), new Date('2021-01-01'));
  }).toThrowError('Start date cannot be greater than end date');
});

test('the delay between 00:00 and 01:00 is 1 hour', () => {
  const dateRange = new DateRange(
    new Date('2021-01-01T00:00:00Z'),
    new Date('2021-01-01T01:00:00Z'),
  );

  expect(dateRange.duration().asHours()).toBe(1);
});

test('start date should be minute-aligned', () => {
  expect(() => {
    new DateRange(
      new Date('2021-01-01T00:01:00Z'),
      new Date('2021-01-01T01:00:00Z'),
    );
  }).toThrowError('dates must be aligned to the hour');
});

test('end date should be minute-aligned', () => {
  expect(() => {
    new DateRange(
      new Date('2021-01-01T00:00:00Z'),
      new Date('2021-01-01T01:01:00Z'),
    );
  }).toThrowError('dates must be aligned to the hour');
});

test('start date should be second-aligned', () => {
  expect(() => {
    new DateRange(
      new Date('2021-01-01T00:00:01Z'),
      new Date('2021-01-01T01:00:00Z'),
    );
  }).toThrowError('dates must be aligned to the hour');
});

test('end date should be second-aligned', () => {
  expect(() => {
    new DateRange(
      new Date('2021-01-01T00:00:00Z'),
      new Date('2021-01-01T01:00:01Z'),
    );
  }).toThrowError('dates must be aligned to the hour');
});

test('snapshot', () => {
  const dateRange = new DateRange(
    new Date('2021-01-01T00:00:00Z'),
    new Date('2021-01-01T01:00:00Z'),
  );

  expect(dateRange.takeSnapshot()).toEqual({
    start: new Date('2021-01-01T00:00:00Z'),
    end: new Date('2021-01-01T01:00:00Z'),
  });
});

test('snapshot', () => {
  const initial = new DateRange(
    new Date('2021-01-01T00:00:00Z'),
    new Date('2021-01-01T01:00:00Z'),
  );

  const dateRange = DateRange.fromSnapshot(initial.takeSnapshot());

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
