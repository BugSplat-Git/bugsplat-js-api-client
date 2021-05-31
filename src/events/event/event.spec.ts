import { createFakeEvents } from "../../../spec/fakes/events/events";
import { EventStreamActionType } from "../event-stream/event-stream-event";
import { convertEventsToEventStreamEvents } from "./event";

describe('Events', () => {
    describe('convertEventsToEventStreamEvents', () => {
        let fakeEvents;
        let results;
        
        beforeEach(() => {
            fakeEvents = createFakeEvents();
            results = convertEventsToEventStreamEvents(fakeEvents)
        });

        it('should create an event stream for Comment events', () => {
            expect(results[0]).toEqual(
                jasmine.objectContaining({
                    action: EventStreamActionType.comment,
                    createdDate: new Date(fakeEvents[0].timestamp),
                    comment: fakeEvents[0].message
                })
            );
        });

        it('should create comment event with first two letters of email if firstName and lastName are not available', () => {
            expect(results[0].subject.initials).toEqual(`${fakeEvents[0].username[0]}${fakeEvents[0].username[1]}`);
        });

        it('should create comment event with initials if firstName and lastName are available', () => {
            const firstName = 'Bobby';
            const lastName = 'Ganoosh';
            const events = [...fakeEvents];
            events[0].firstName = firstName;
            events[0].lastName = lastName;

            const results = convertEventsToEventStreamEvents(events);

            expect(results[0].subject.initials).toEqual(`${firstName[0]}${lastName[0]}`);
        });
    });
});