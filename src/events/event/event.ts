import { EventStreamActionType, EventStreamEventAssign, EventStreamEventComment, EventStreamEventStatus } from '..';

export type Event = EventStreamEventAssign | EventStreamEventComment | EventStreamEventStatus;

export function convertEventsToEventStreamEvents(eventsArray: Array<any>): Array<Event> {
  const results: Array<Event> = [];

  eventsArray.forEach((event) => {
    if (event.type === 'Comment') {
      results.push({
        id: parseInt(event.id),
        action: EventStreamActionType.comment,
        createdDate: new Date(event.timestamp),
        subject: {
          initials: getInitialsOrDefault(event),
          email: event.username,
        },
        message: event.message,
      });
    }
  });

  return results.reverse();
}

function getInitialsOrDefault(event: any): string {
  if (event.firstName && event.lastName) {
    const firstInitial = event.firstName[0];
    const lastInitial = event.lastName[0];
    return `${firstInitial}${lastInitial}`;
  }

  return event.username.substring(0, 2);
}