import { BugSplatApiClient } from '@common';
import { CrashApiClient } from '@crash';
import { EventsApiClient } from '@events';
import { config } from '@spec/config';
import { postNativeCrashAndWaitForCrashToProcess } from '@spec/files/native/post-native-crash';

describe('EventsApiClient', () => {
    let client: EventsApiClient;
    const { host, email, password, database } = config;
    const expectedMessage = 'hello world!';
    let crashId;
    let stackKeyId;

    beforeEach(async () => {
        const bugsplat = await BugSplatApiClient.createAuthenticatedClientForNode(email, password, host);
        const crashClient = new CrashApiClient(bugsplat);
        const response = await postNativeCrashAndWaitForCrashToProcess(
            bugsplat,
            crashClient,
            database,
            'myConsoleCrasher',
            '1.0.0'
        );
        crashId = response.crashId;
        stackKeyId = response.stackKeyId;
        client = new EventsApiClient(bugsplat);
    });

    describe('postCrashComment', () => {
        it('should return 200 for valid database, crashId, and comment', async () => {
            const response = await client.postCrashComment(database, crashId, expectedMessage);

            expect(response.status).toEqual(200);
        });
    });

    describe('postStackKeyComment', () => {
        it('should return 200 for valid database, stackKeyId, and comment', async () => {
            const response = await client.postStackKeyComment(database, stackKeyId, expectedMessage);

            expect(response.status).toEqual(200);
        });
    });

    describe('getEventsForCrashId', () => {
        it('should return 200 and events array', async () => {
            await client.postCrashComment(database, crashId, expectedMessage);

            const response = await client.getEventsForCrashId(database, crashId);
            const event = response[0];

            expect(event.message).toEqual(expectedMessage);
        });
    });

    describe('getEventsForStackKeyId', () => {
        it('should return 200 and events array', async () => {
            await client.postStackKeyComment(database, stackKeyId, expectedMessage);

            const response = await client.getEventsForStackKeyId(database, stackKeyId);
            const event = response[0];

            expect(event.message).toEqual(expectedMessage);
        });
    });
});