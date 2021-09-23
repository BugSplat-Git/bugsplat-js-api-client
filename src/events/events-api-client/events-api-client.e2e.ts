import { BugSplatApiClient } from '@common';
import { EventsApiClient, EventStreamEventComment } from '@events';
import { config } from '@spec/config';

describe('CrashApiClient', () => {
    let client: EventsApiClient;
    const host = config.host;
    const email = config.email;
    const password = config.password;
    
    const database = 'fred';
    const crashId = 100000;
    const stackKeyId = 799;

    beforeEach(async () => {
        const bugsplat = await BugSplatApiClient.createAuthenticatedClientForNode(host, email, password);
        client = new EventsApiClient(bugsplat);
    });

    describe('getEventsForCrashId', () => {
        it('should return 200 for database fred and crashId 100000', async () => {
            const response = await client.getEventsForCrashId(database, crashId);
            const event = <EventStreamEventComment>response[0];

            expect(event.message).toEqual('hello world!');
        });
    });

    describe('getEventsForStackKeyId', () => {
        it('should return 200 for database fred and stackKeyId 799', async () => {
            const response = await client.getEventsForStackKeyId(database, stackKeyId);
            const event = <EventStreamEventComment>response[0];

            expect(event.message).toEqual('hello world!');
        });
    });
});