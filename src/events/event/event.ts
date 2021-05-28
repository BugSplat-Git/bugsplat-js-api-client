import { EventStreamActionType, EventStreamEventAssign, EventStreamEventComment, EventStreamEventStatus } from '..';

export type Event = EventStreamEventAssign | EventStreamEventComment | EventStreamEventStatus;

export function convertEventsToEventStreamEvents(eventsArray: Array<any>): Array<Event> {
  const results: Array<Event> = [];

  eventsArray.forEach((event) => {
    if (event.type === 'Comment') {
      results.push({
        action: EventStreamActionType.comment,
        createdDate: new Date(event.timestamp),
        subject: {
          initials: event.username.substring(0, 2),
          email: event.username,
        },
        comment: event.message,
      });
    }
  });

  return results.reverse();
}
