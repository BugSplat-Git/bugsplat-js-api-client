import { ApiClient } from '@common';
import { convertEventsToEventStreamEvents, Event } from '@events';
import ac from 'argument-contracts';

export enum EventType {
    Comment = 'Comment',
    AddCrashDefect = 'AddCrashDefect',
    RemoveCrashDefect = 'RemoveCrashDefect',
    AddStackKeyDefect = 'AddStackKeyDefect',
    RemoveStackKeyDefect = 'RemoveStackKeyDefect'
}

export class EventsApiClient {

    constructor(private _client: ApiClient) { }

    getEventsForCrashId(database: string, crashId: number): Promise<Array<Event>> {
        ac.assertNonWhiteSpaceString(database, 'database');
        if (crashId <= 0) {
            throw new Error(`Expected crashId to be a positive non-zero number. Value received: "${crashId}"`);
        }

        return this.getEvents(`/api/events?database=${database}&crashId=${crashId}`);
    }

    getEventsForStackKeyId(database: string, stackKeyId: number): Promise<Array<Event>> {
        ac.assertNonWhiteSpaceString(database, 'database');
        if (stackKeyId <= 0) {
            throw new Error(`Expected crashId to be a positive non-zero number. Value received: "${stackKeyId}"`);
        }

        return this.getEvents(`/api/events?database=${database}&stackKeyId=${stackKeyId}`);
    }

    private async getEvents(route: string): Promise<Array<Event>> {
        const response = await this._client.fetch(route);
        const json = await response.json();

        if (response.status !== 200) {
            throw new Error(json.message);
        }

        return convertEventsToEventStreamEvents(json.events);
    }
}
