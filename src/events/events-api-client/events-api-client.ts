import { ApiClient, BugSplatResponse } from '@common';
import { Event } from '@events';
import ac from 'argument-contracts';
import { createEvents, EventResponseObject } from './event';

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

    postCrashComment(database: string, crashId: number, comment: string): Promise<BugSplatResponse<EventPostSuccessResponse>> {
        ac.assertNonWhiteSpaceString(database, 'database');
        if (crashId <= 0) {
            throw new Error(`Expected crashId to be a positive non-zero number. Value received: "${crashId}"`);
        }

        const method = 'POST';
        const body = this._client.createFormData();
        const duplex = 'half';

        body.append('database', database);
        body.append('crashId', `${crashId}`);
        body.append('message', comment);

        return this._client.fetch(
            '/api/events/comment',
            {
                method,
                body,
                duplex
            } as RequestInit
        );
    }

    postStackKeyComment(database: string, stackKeyId: number, comment: string): Promise<BugSplatResponse<EventPostSuccessResponse>> {
        ac.assertNonWhiteSpaceString(database, 'database');
        if (stackKeyId <= 0) {
            throw new Error(`Expected stackKeyId to be a positive non-zero number. Value received: "${stackKeyId}"`);
        }

        const method = 'POST';
        const body = this._client.createFormData();
        const duplex = 'half';

        body.append('database', database);
        body.append('stackKeyId', `${stackKeyId}`);
        body.append('message', comment);

        return this._client.fetch(
            '/api/events/comment',
            {
                method,
                body,
                duplex
            } as RequestInit
        );
    }

    private async getEvents(route: string): Promise<Array<Event>> {
        const response = await this._client.fetch(route);
        const json = await response.json() as EventGetSuccessResponse | ErrorResponse;

        if (response.status !== 200) {
            throw new Error((json as ErrorResponse).message);
        }

        return createEvents((json as EventGetSuccessResponse).events);
    }
}

type EventGetSuccessResponse = { events: Array<EventResponseObject> };
type EventPostSuccessResponse = { messageId: number; status: string; }
type ErrorResponse = { message: string };