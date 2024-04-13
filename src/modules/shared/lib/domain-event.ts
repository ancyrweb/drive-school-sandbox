import { IdProvider } from './id.js';

/**
 * Represent a domain event an event related to something that happened
 * in our domain.
 */
export abstract class DomainEvent<T extends Record<string, any> = any> {
  public readonly id = IdProvider.generate();
  public readonly date = new Date();

  public constructor(public readonly payload: T) {}
}