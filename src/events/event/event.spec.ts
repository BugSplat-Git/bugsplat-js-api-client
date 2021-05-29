import { fakeEvents } from "../../../spec/fakes/events";
import { EventStreamActionType } from "../event-stream/event-stream-event";
import { convertEventsToEventStreamEvents } from "./event";

describe('Events', () => {
    describe('convertEventsToEventStreamEvents', () => {
        it('should create an event stream for Comment events', () => {
            const results = convertEventsToEventStreamEvents(fakeEvents);

            expect(results[0]).toEqual(
                jasmine.objectContaining({
                    action: EventStreamActionType.comment,
                    createdDate: new Date(fakeEvents[0].timestamp),
                    comment: fakeEvents[0].message
                })
            );
        });
    });
});