export interface EventResponseObject {
  id: string;
  uId: string;
  type: string;
  timestamp: string;
  firstName?: string;
  lastName?: string;
  username: string;
  message: string;
}

export interface Event extends Omit<EventResponseObject, 'type' | 'id' | 'uId'> {
  id: number;
  uId: number;
  type: EventType;
}

export enum EventType {
  Comment = 'Comment',
  AddCrashDefect = 'AddCrashDefect',
  RemoveCrashDefect = 'RemoveCrashDefect',
  AddStackKeyDefect = 'AddStackKeyDefect',
  RemoveStackKeyDefect = 'RemoveStackKeyDefect',
  StackKeyDefectStatusOpen = 'StackKeyDefectStatusOpen',
  StackKeyDefectStatusClosed = 'StackKeyDefectStatusClosed',
  StackKeyDefectStatusRegression = 'StackKeyDefectStatusRegression'
}

export function createEvents(events: Array<EventResponseObject>): Array<Event> {
  return events.map(event => {
    const id = Number(event.id);
    const uId = Number(event.uId);
    const type = event.type as EventType;
    return {
      ...event,
      id,
      uId,
      type
    };
  });
}
