export interface EventResponseObject {
  id: string;
  type: string;
  timestamp: string;
  firstName?: string;
  lastName?: string;
  username: string;
  message: string;
}

export interface Event extends Omit<EventResponseObject, 'type' | 'id'> {
  id: number;
  type: EventType;
}

export enum EventType {
  Comment = 'Comment',
  AddCrashDefect = 'AddCrashDefect',
  RemoveCrashDefect = 'RemoveCrashDefect',
  AddStackKeyDefect = 'AddStackKeyDefect',
  RemoveStackKeyDefect = 'RemoveStackKeyDefect'
}

export function createEvents(events: Array<EventResponseObject>): Array<Event> {
  return events.map(event => {
    const id = Number(event.id);
    const type = event.type as EventType;
    return {
      ...event,
      id,
      type
    };
  });
}
