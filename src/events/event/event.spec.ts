import { createFakeEvents } from '../../../spec/fakes/events/events';
import { EventStreamActionType } from '../event-stream/event-stream-event';
import { convertEventsToEventStreamEvents } from './event';
import { EventType } from '../events-api-client/events-api-client';
import { createEventFromApiResponse } from './create-event-from-api-response';

describe('Events', () => {
    describe('convertEventsToEventStreamEvents', () => {
        let fakeEvents;
        let results;
        
        beforeEach(() => {
            fakeEvents = createFakeEvents();
            results = convertEventsToEventStreamEvents(fakeEvents);
        });

        it('should create an event stream for Comment events', () => {
            const commentEvent = fakeEvents.find(event => event.type === EventType.Comment);
            const expected = createEventFromApiResponse(commentEvent, EventStreamActionType.comment);
            expect(results).toEqual(
                jasmine.arrayContaining([expected])
            );
        });

        it('should create an event stream for AddCrashDefect events', () => {
            const defectEvent = fakeEvents.find(event => event.type === EventType.AddCrashDefect);
            const expected = createEventFromApiResponse(defectEvent, EventStreamActionType.defect);
            expect(results).toEqual(
                jasmine.arrayContaining([expected])
            );
        });

        it('should create an event stream for RemoveCrashDefect events', () => {
            const defectEvent = fakeEvents.find(event => event.type === EventType.RemoveCrashDefect);
            const expected = createEventFromApiResponse(defectEvent, EventStreamActionType.defect);
            expect(results).toEqual(
                jasmine.arrayContaining([expected])
            );
        });

        it('should create an event stream for AddStackKeyDefect events', () => {
            const defectEvent = fakeEvents.find(event => event.type === EventType.AddStackKeyDefect);
            const expected = createEventFromApiResponse(defectEvent, EventStreamActionType.defect);
            expect(results).toEqual(
                jasmine.arrayContaining([expected])
            );
        });

        it('should create an event stream for RemoveStackKeyDefect events', () => {
            const defectEvent = fakeEvents.find(event => event.type === EventType.RemoveStackKeyDefect);
            const expected = createEventFromApiResponse(defectEvent, EventStreamActionType.defect);
            expect(results).toEqual(
                jasmine.arrayContaining([expected])
            );
        });

        it('should return empty string if username is null or undefined', () => {
            const eventWithoutUsername = {
                ...fakeEvents[0],
                username: undefined
            };

            const results = convertEventsToEventStreamEvents([eventWithoutUsername]);

            expect(results[0].subject.initials).toEqual('');
        });
    });
});