import ac from 'argument-contracts';

export enum EventStreamType {
  crashId = 'crashId',
}

export class EventStreamId {
  type: EventStreamType;
  id: number;

  constructor({ type, id }: { type: EventStreamType; id: number }) {
    ac.assertNumber(id, 'id');

    this.type = type;
    this.id = id;
  }
}
