import { AggregateRoot } from './lib/aggregate-root.js';
import { DomainEvent } from './lib/domain-event.js';

export const expectEventToBeRaised = (
  aggregateRoot: AggregateRoot,
  event: DomainEvent,
) => {
  const matchingEvent = aggregateRoot
    .getEvents()
    .find((e) => e.constructor.name === event.constructor.name);

  if (!matchingEvent) {
    expect.fail('Event not raised');
  }

  expect(matchingEvent!.payload).toEqual(event.payload);
};
