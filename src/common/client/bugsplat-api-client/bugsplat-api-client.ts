import { ApiClient, bugsplatAppHostUrl, BugSplatResponse, Environment } from '@common';

export class BugSplatApiClient implements ApiClient {
    private _createFormData = () => new FormData();
    private _fetch = globalThis.fetch;

    constructor(
        private _host: string = bugsplatAppHostUrl,
        private _environment: Environment = Environment.Node
    ) { }

    createFormData(): FormData {
        return this._createFormData();
    }

    async fetch<T>(route: string, init: RequestInit = {}): Promise<BugSplatResponse<T>> {
        if (this._environment === Environment.WebBrowser) {
            init.credentials = 'include';
        }

        const url = new URL(route, this._host);
        const response = await this._fetch(url.href, init);
        const status = response.status;
        const body = response.body;

        return {
            status,
            body,
            json: async () => response.clone().json(),
            text: async () => response.clone().text()
        };
    }
}
