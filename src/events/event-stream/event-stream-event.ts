export interface EventStreamEvent {
  id: number;
  createdDate: Date;
  message: string;
  subject: EventStreamSubject;
  action: EventStreamActionType;
}

export interface EventStreamSubject {
  initials: string;
  image?: string;
  email: string;
}

export enum EventStreamActionType {
  assign = 'assign',
  comment = 'comment',
  status = 'status',
  defect = 'defect'
}

export enum EventStreamStatus {
  none = 'none',
  unassigned = 'unassigned',
  assigned = 'assigned',
  inProgress = 'in-progress',
  inReview = 'in-review',
  completed = 'completed',
  onHold = 'on-hold',
}

export interface EventStreamEventAssign extends EventStreamEvent {
  action: EventStreamActionType.assign;
  assigner: EventStreamSubject;
}

export interface EventStreamEventComment extends EventStreamEvent {
  action: EventStreamActionType.comment;
}

export interface EventStreamEventStatus extends EventStreamEvent {
  action: EventStreamActionType.status;
  oldStatus: EventStreamStatus;
  newStatus: EventStreamStatus;
}
