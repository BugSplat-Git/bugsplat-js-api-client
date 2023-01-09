import { ApiClient } from '@common';
import { CrashDetails } from '@crash';
import ac from 'argument-contracts';
import { CrashDetailsConstructorOptions } from '../crash-details/crash-details';

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
            redirect: 'follow'
        } as RequestInit;

        const response = await this._client.fetch<GetCrashByIdResponse>('/api/crash/data', init);
        const json = await response.json();

        if (response.status !== 200) {
            throw new Error((json as Error).message);
        }

        return new CrashDetails(json as CrashDetailsConstructorOptions);
    }

    async reprocessCrash(database: string, crashId: number, force = false): Promise<SuccessResponse> {
        ac.assertNonWhiteSpaceString(database, 'database');
        ac.assertBoolean(force, 'force');
        if (crashId <= 0) {
            throw new Error(`Expected id to be a positive non-zero number. Value received: "${crashId}"`);
        }
        
        const formData = this._client.createFormData();
        formData.append('database', database);
        formData.append('id', crashId.toString());
        formData.append('force', force.toString());
        const init = {
            method: 'POST',
            body: formData,
            cache: 'no-cache',
            credentials: 'include',
            redirect: 'follow'
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
type GetCrashByIdResponse = CrashDetailsConstructorOptions | ErrorResponse;
type ReprocessCrashResponse = SuccessResponse | ErrorResponse;