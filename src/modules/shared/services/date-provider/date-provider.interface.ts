export const I_DATE_PROVIDER = Symbol('I_DATE_PROVIDER');

export interface IDateProvider {
  now(): Date;
}
