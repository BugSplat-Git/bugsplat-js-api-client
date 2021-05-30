import ac from 'argument-contracts';
import { CrashDetails } from '..';
import { ApiClient } from '../../common';

export class CrashApiClient {

    constructor(private _client: ApiClient) { }

    async getCrashById(database: string, id: number): Promise<CrashDetails> {
        ac.assertNonWhiteSpaceString(database, 'database');
        if (id <= 0) {
            throw new Error(`Expected id to be a positive non-zero number. Value received: "${id}"`);
        }

        const formData = this._client.createFormData();
        formData.append('database', database);
        formData.append('id', id.toString());

        const init = {
            method: 'POST',
            body: formData,
            cache: 'no-cache',
            credentials: 'include',
            redirect: 'follow'
        };

        const response = await this._client.fetch('/api/crash/data.php', <any>init);
        const json = await response.json();

        if (response.status !== 200) {
            throw new Error(json.message);
        }

        return new CrashDetails(json);
    }
}
