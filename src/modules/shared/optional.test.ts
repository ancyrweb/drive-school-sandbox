import { Optional } from './optional.js';

test('an empty optional should be null', () => {
  expect(Optional.empty().isNull()).toBe(true);
});

test('an optional with a value should not be present', () => {
  expect(Optional.of('foo').isPresent()).toBe(true);
});

describe('getting or throw', () => {
  test('when there is no value, should throw', () => {
    const opt = Optional.empty();
    const err = new Error('foo');

    expect(() => opt.getOrThrow(() => err)).toThrow(err);
  });

  test('when there is a value, should return the value', () => {
    const opt = Optional.of('foo');
    const err = new Error('foo');

    expect(opt.getOrThrow(() => err)).toBe('foo');
  });
});

describe('getting or fallback', () => {
  test('when there is no value, should return the default value', () => {
    const opt = Optional.empty();
    expect(opt.getOrElse('foo')).toBe('foo');
  });

  test('when there is a value, should return the value', () => {
    const opt = Optional.of('foo');
    expect(opt.getOrElse('bar')).toBe('foo');
  });
});
