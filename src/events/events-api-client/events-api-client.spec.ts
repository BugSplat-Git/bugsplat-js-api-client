import { createFakeBugSplatApiClient } from '../../../spec/fakes/common/bugsplat-api-client';
import { fakeEventsApiResponse } from '../../../spec/fakes/events/events-api-response';
import { createFakeFormData } from '../../../spec/fakes/common/form-data';
import { createFakeSuccessResponseBody } from '../../../spec/fakes/common/response';
import { EventsApiClient } from './events-api-client';
import { convertEventsToEventStreamEvents } from '../event/event';
import { createFakeEvents } from '../../../spec/fakes/events/events';

describe('CrashApiClient', () => {
    const database = 'fred';
    const id = 100000;
    let client: EventsApiClient;
    let fakeBugSplatApiClient;
    let fakeEvents;
    let fakeFormData;
    let result;

    beforeEach(() => {
        const fakeResponse = createFakeSuccessResponseBody(200, fakeEventsApiResponse, []);
        fakeEvents = createFakeEvents();
        fakeFormData = createFakeFormData();
        fakeBugSplatApiClient = createFakeBugSplatApiClient(fakeFormData, fakeResponse);
        client = new EventsApiClient(fakeBugSplatApiClient);
    });

    describe('getEventsForCrashId', () => {

        beforeEach(async () => result = await client.getEventsForCrashId(database, id));

        it('should throw if database is falsy', async () => {
            try {
                await client.getEventsForCrashId('', id);
                fail('getCrashById was supposed to throw!');
            } catch(error) {
                expect(error.message).toMatch(/to be a non white space string/);
            }
        });

        it('should throw if id is less than or equal to 0', async () => {
            try {
                await client.getEventsForCrashId(database, 0);
                fail('getCrashById was supposed to throw!');
            } catch(error) {
                expect(error.message).toMatch(/to be a positive non-zero number/);
            }
        });

        it('should call fetch with correct route', () => {
            expect(fakeBugSplatApiClient.fetch).toHaveBeenCalledWith(`/api/events?database=${database}&crashId=${id}`);
        });

        it('should return events array', () => {
            expect(result).toEqual(convertEventsToEventStreamEvents(fakeEvents));
        });
    });

    describe('getEventsForStackKeyId', () => {

        beforeEach(async () => result = await client.getEventsForStackKeyId(database, id));

        it('should throw if database is falsy', async () => {
            try {
                await client.getEventsForStackKeyId('', id);
                fail('getCrashById was supposed to throw!');
            } catch(error) {
                expect(error.message).toMatch(/to be a non white space string/);
            }
        });

        it('should throw if id is less than or equal to 0', async () => {
            try {
                await client.getEventsForStackKeyId(database, 0);
                fail('getCrashById was supposed to throw!');
            } catch(error) {
                expect(error.message).toMatch(/to be a positive non-zero number/);
            }
        });

        it('should call fetch with correct route', () => {
            expect(fakeBugSplatApiClient.fetch).toHaveBeenCalledWith(`/api/events?database=${database}&stackKeyId=${id}`);
        });

        it('should return events array', () => {
            expect(result).toEqual(convertEventsToEventStreamEvents(fakeEvents));
        });
    });
});