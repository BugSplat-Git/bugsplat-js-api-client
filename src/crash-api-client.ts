import { BugSplatApiClient } from '../index';

export class CrashApiClient {

    constructor(private _client: BugSplatApiClient) { }

    async getCrashById(database: string, id: number): Promise<Response> {
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

        return this._client.fetch('/api/crash/data.php', <any>init);
    }
}