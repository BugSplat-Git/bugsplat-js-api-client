import { EventsApiClient } from './events-api-client';
import { config } from '../../../spec/config';
import { BugSplatApiClient } from '../../common';
import { EventStreamEventComment } from '../event-stream/event-stream-event';

describe('CrashApiClient', () => {
    let client: EventsApiClient;
    let host = config.host;
    let email = config.email;
    let password = config.password;
    
    const database = 'fred';
    const crashId = 100000;
    const stackKeyId = 799;

    beforeEach(async () => {
        const bugsplat = new BugSplatApiClient(host); 
        await bugsplat.login(email, password);
        client = new EventsApiClient(bugsplat);
    });

    describe('getEventsForCrashId', () => {
        it('should return 200 for database fred and crashId 100000', async () => {
            const response = await client.getEventsForCrashId(database, crashId);
            const event = <EventStreamEventComment>response[0];

            expect(event.comment).toEqual('hello world!');
        });
    });

    describe('getEventsForStackKeyId', () => {
        it('should return 200 for database fred and stackKeyId 799', async () => {
            const response = await client.getEventsForStackKeyId(database, stackKeyId);
            const event = <EventStreamEventComment>response[0];

            expect(event.comment).toEqual('hello world!');
        });
    });
});