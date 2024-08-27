import { ApiClient } from '@common';
import { CrashDetails } from '@crash';
import ac from 'argument-contracts';
import { CrashDetailsRawResponse, createCrashDetails } from '../crash-details/crash-details';

export class CrashApiClient {

    constructor(private _client: ApiClient) { }

    async getCrashById(database: string, crashId: number): Promise<CrashDetails> {
        ac.assertNonWhiteSpaceString(database, 'database');
        if (crashId <= 0) {
            throw new Error(`Expected id to be a positive non-zero number. Value received: "${crashId}"`);
        }

        const formData = this._client.createFormData();
        formData.append('database', database);
        formData.append('id', crashId.toString());

        const init = {
            method: 'POST',
            body: formData,
            cache: 'no-cache',
            credentials: 'include',
            redirect: 'follow',
            duplex: 'half'
        } as RequestInit;

        const response = await this._client.fetch<GetCrashByIdResponse>('/api/crash/details', init);
        const json = await response.json();

        if (response.status !== 200) {
            throw new Error((json as Error).message);
        }

        return createCrashDetails(json as CrashDetailsRawResponse);
    }

    async reprocessCrash(database: string, crashId: number, force = false, processor = ''): Promise<SuccessResponse> {
        return this.reprocessCrashes(database, [crashId], force, processor);
    }

    async reprocessCrashes(database: string, crashIds: Array<number>, force = false, processor = ''): Promise<SuccessResponse> {
        ac.assertNonWhiteSpaceString(database, 'database');
        ac.assertBoolean(force, 'force');

        for (const crashId of crashIds) {
            if (crashId <= 0) {
                throw new Error(`Expected ids to be positive non-zero numbers. Value received: "${crashId}"`);
            }
        }

        const formData = this._client.createFormData();
        formData.append('database', database);
        formData.append('id', crashIds.join(','));
        formData.append('force', force.toString());
        if (processor) {
            formData.append('processor', processor);
        }
        const init = {
            method: 'POST',
            body: formData,
            cache: 'no-cache',
            credentials: 'include',
            redirect: 'follow',
            duplex: 'half'
        } as RequestInit;

        const response = await this._client.fetch<ReprocessCrashResponse>('/api/crash/reprocess', init);
        const json = await response.json();

        if (response.status !== 202) {
            throw new Error((json as ErrorResponse).message);
        }

        return json as SuccessResponse;
    }
}

type SuccessResponse = { success: boolean };
type ErrorResponse = { message: string };
type GetCrashByIdResponse = CrashDetailsRawResponse | ErrorResponse;
type ReprocessCrashResponse = SuccessResponse | ErrorResponse;
