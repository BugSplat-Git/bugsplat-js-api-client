import { EventsApiClient } from '@events';
import { createFakeBugSplatApiClient } from '@spec/fakes/common/bugsplat-api-client';
import { createFakeFormData } from '@spec/fakes/common/form-data';
import { createFakeResponseBody } from '@spec/fakes/common/response';
import { createFakeEvents } from '@spec/fakes/events/events';
import { fakeEventsApiResponse } from '@spec/fakes/events/events-api-response';
import { createEvents } from './event';

describe('CrashApiClient', () => {
    const database = 'fred';
    const id = 100000;
    const comment = 'hello world!';
    let client: EventsApiClient;
    let fakeBugSplatApiClient;
    let fakeEvents;
    let fakeFormData;
    let result;

    beforeEach(() => {
        const fakeResponse = createFakeResponseBody(200, fakeEventsApiResponse);
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
            } catch(error: any) {
                expect(error.message).toMatch(/to be a non white space string/);
            }
        });

        it('should throw if id is less than or equal to 0', async () => {
            try {
                await client.getEventsForCrashId(database, -1);
                fail('getCrashById was supposed to throw!');
            } catch(error: any) {
                expect(error.message).toMatch(/to be a positive non-zero number/);
            }
        });

        it('should call fetch with correct route', () => {
            expect(fakeBugSplatApiClient.fetch).toHaveBeenCalledWith(`/api/events?database=${database}&crashId=${id}`);
        });

        it('should return events array', () => {
            expect(result).toEqual(createEvents(fakeEvents));
        });
    });

    describe('getEventsForStackKeyId', () => {

        beforeEach(async () => result = await client.getEventsForStackKeyId(database, id));

        it('should throw if database is falsy', async () => {
            try {
                await client.getEventsForStackKeyId('', id);
                fail('getCrashById was supposed to throw!');
            } catch(error: any) {
                expect(error.message).toMatch(/to be a non white space string/);
            }
        });

        it('should throw if id is less than or equal to 0', async () => {
            try {
                await client.getEventsForStackKeyId(database, -1);
                fail('getCrashById was supposed to throw!');
            } catch(error: any) {
                expect(error.message).toMatch(/to be a positive non-zero number/);
            }
        });

        it('should call fetch with correct route', () => {
            expect(fakeBugSplatApiClient.fetch).toHaveBeenCalledWith(`/api/events?database=${database}&stackKeyId=${id}`);
        });

        it('should return events array', () => {
            expect(result).toEqual(createEvents(fakeEvents));
        });
    });

    describe('postCrashComment', () => {

        beforeEach(async () => result = await client.postCrashComment(database, id, comment));

        it('should throw if database is falsy', async () => {
            try {
                await client.postCrashComment('', id, comment);
                fail('postCrashComment was supposed to throw!');
            } catch(error: any) {
                expect(error.message).toMatch(/to be a non white space string/);
            }
        });

        it('should throw if id is less than or equal to 0', async () => {
            try {
                await client.postCrashComment(database, -1, comment);
                fail('postCrashComment was supposed to throw!');
            } catch(error: any) {
                expect(error.message).toMatch(/to be a positive non-zero number/);
            }
        });

        it('should call fetch with route and formData', () => {
            expect(fakeFormData.append).toHaveBeenCalledWith('database', database);
            expect(fakeFormData.append).toHaveBeenCalledWith('crashId', id.toString());
            expect(fakeFormData.append).toHaveBeenCalledWith('message', comment);
            expect(fakeBugSplatApiClient.fetch).toHaveBeenCalledWith(
                '/api/events/comment',
                jasmine.objectContaining({
                    method: 'POST',
                    body: fakeFormData,
                    duplex: 'half'
                })
            );
        });
    });

    describe('postStackKeyComment', () => {

        beforeEach(async () => result = await client.postStackKeyComment(database, id, comment));

        it('should throw if database is falsy', async () => {
            try {
                await client.postStackKeyComment('', id, comment);
                fail('postCrashGroupComment was supposed to throw!');
            } catch(error: any) {
                expect(error.message).toMatch(/to be a non white space string/);
            }
        });

        it('should throw if id is less than or equal to 0', async () => {
            try {
                await client.postStackKeyComment(database, -1, comment);
                fail('postCrashGroupComment was supposed to throw!');
            } catch(error: any) {
                expect(error.message).toMatch(/to be a positive non-zero number/);
            }
        });

        it('should call fetch with route and formData', () => {
            expect(fakeFormData.append).toHaveBeenCalledWith('database', database);
            expect(fakeFormData.append).toHaveBeenCalledWith('stackKeyId', id.toString());
            expect(fakeFormData.append).toHaveBeenCalledWith('message', comment);
            expect(fakeBugSplatApiClient.fetch).toHaveBeenCalledWith(
                '/api/events/comment',
                jasmine.objectContaining({
                    method: 'POST',
                    body: fakeFormData,
                    duplex: 'half'
                })
            );
        });
    });
});