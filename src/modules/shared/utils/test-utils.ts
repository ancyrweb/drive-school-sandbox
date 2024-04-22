import deepEqual from 'fast-deep-equal';
import { DomainEvent } from '../lib/domain-event.js';
import { NotAuthorizedException } from '../exceptions/not-authorized-exception.js';
import { NotFoundException } from '../exceptions/not-found-exception.js';

export const expectEventToBeRaised = (
  events: DomainEvent[],
  event: DomainEvent,
) => {
  for (const e of events) {
    if (deepEqual(e.props, event.props)) {
      return;
    }
  }

  assert.fail(`Event ${event.constructor.name} was not raised`);
};

export const expectNotAuthorized = (callback: () => Promise<any>) => {
  return expect(callback).rejects.toThrow(new NotAuthorizedException());
};

export const expectNotFound = (callback: () => Promise<any>) => {
  return expect(callback).rejects.toThrow(NotFoundException);
};
