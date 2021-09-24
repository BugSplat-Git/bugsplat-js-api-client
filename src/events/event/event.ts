import { EventStreamEvent, EventStreamEventAssign, EventStreamEventComment, EventStreamEventStatus, createEventFromApiResponse, EventStreamActionType, EventType } from '@events';

export type Event = EventStreamEvent | EventStreamEventAssign | EventStreamEventComment | EventStreamEventStatus;

export interface EventResponseObject {
  id: string;
  type: string;
  timestamp: string;
  firstName?: string;
  lastName?: string;
  username: string;
  message: string;
}

export function convertEventsToEventStreamEvents(eventsArray: Array<EventResponseObject>): Array<Event> {
  const results: Array<Event> = [];

  eventsArray.forEach((event) => {
    if (isCommentEvent(event.type)) {
      results.push(
        createEventFromApiResponse(
          event,
          EventStreamActionType.comment
        )
      );
    } else if (isDefectEvent(event.type)) {
      results.push(
        createEventFromApiResponse(
          event,
          EventStreamActionType.defect
        )
      );
    }
  });

  return results.reverse();
}

function isCommentEvent(type: string): boolean {
  return type === EventType.Comment;
}

function isDefectEvent(type: string): boolean {
  return type === EventType.AddCrashDefect
    || type === EventType.RemoveCrashDefect
    || type === EventType.AddStackKeyDefect
    || type === EventType.RemoveStackKeyDefect;
}