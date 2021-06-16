import ac from 'argument-contracts';
import { CrashDetails } from '..';
import { ApiClient } from '../../common';

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
        };

        const response = await this._client.fetch('/api/crash/data', <any>init);
        const json = await response.json();

        if (response.status !== 200) {
            throw new Error(json.message);
        }

        return new CrashDetails(json);
    }

    async reprocessCrash(database: string, crashId: number, force: boolean = false): Promise<{ success: boolean }> {
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
        };

        const response = await this._client.fetch('/api/crash/reprocess', <any>init);
        const json = await response.json();

        if (response.status !== 202) {
            throw new Error(json.message);
        }
        
        return json;
    }
}
