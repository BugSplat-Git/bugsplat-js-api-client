import { createFakeEvents } from "../../../spec/fakes/events/events";
import { EventStreamActionType } from "../event-stream/event-stream-event";
import { EventType } from "../events-api-client/events-api-client";
import { createEventFromApiResponse } from "./create-event-from-api-response";

describe('createEventFromApiResponse', () => {    
    it('should create value with id, action, createdDate, subject and message', () => {
        const defectEvent = createFakeEvents([EventType.AddCrashDefect])[0];
        
        const result = createEventFromApiResponse(defectEvent, EventStreamActionType.comment);

        expect(result.id).toEqual(parseInt(defectEvent.id));
        expect(result.action).toEqual(EventStreamActionType.comment);
        expect(result.createdDate).toEqual(new Date(defectEvent.timestamp));
        expect(result.message).toEqual(defectEvent.message);
        expect(result.subject).toEqual(
            jasmine.objectContaining({
                initials: 'FF',
                email: defectEvent.username
            })
        );
    });

    it('should create value with defaults for initials if firstName and lastName aren\'t available', () => {
        const commentEvent = createFakeEvents([EventType.Comment])[0];
        const expected = `${commentEvent.username[0]}${commentEvent.username[1]}`;
        commentEvent.firstName = '';
        commentEvent.lastName = '';

        const result = createEventFromApiResponse(commentEvent, EventStreamActionType.comment);

        expect(result.subject.initials).toEqual(expected);
    });
});