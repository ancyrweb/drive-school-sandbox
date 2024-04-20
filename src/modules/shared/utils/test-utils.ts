import deepEqual from 'fast-deep-equal';
import { DomainEvent } from '../lib/domain-event.js';

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
