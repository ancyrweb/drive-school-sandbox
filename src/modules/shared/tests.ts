import { AggregateRoot } from './domain/aggregate-root.js';
import { DomainEvent } from './domain/domain-event.js';

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
