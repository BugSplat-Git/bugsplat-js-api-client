import { ApiClient, bugsplatAppHostUrl, BugSplatResponse, Environment } from '@common';

export class BugSplatApiClient implements ApiClient {
    private _createFormData = () => new FormData();
    private _fetch = globalThis.fetch;
    private _headers = {};

    constructor(
        private _host: string = bugsplatAppHostUrl,
        private _environment: Environment = Environment.Node
    ) { }

    static async createAuthenticatedClientForNode(
        email: string,
        password: string,
        host: string = bugsplatAppHostUrl
    ): Promise<BugSplatApiClient> {
        const client = new BugSplatApiClient(host, Environment.Node);
        await client.login(email, password);
        return client;
    }

    static async createAuthenticatedClientForWebBrowser(
        email: string,
        password: string,
        host: string = bugsplatAppHostUrl
    ): Promise<BugSplatApiClient> {
        const client = new BugSplatApiClient(host, Environment.WebBrowser);
        await client.login(email, password);
        return client;
    }

    createFormData(): FormData {
        return this._createFormData();
    }

    async fetch(route: string, init: RequestInit = {}): Promise<BugSplatResponse> {
        if (!init.headers) {
            init.headers = {};
        }

        if (this._environment === Environment.WebBrowser) {
            init.credentials = 'include';
        }

        if (this._environment === Environment.Node) {
            init.headers ? init.headers = { ...init.headers, ...this._headers } : null;
        }

        const url = new URL(route, this._host);
        return this._fetch(url.href, init);
    }

    async login(email: string, password: string): Promise<BugSplatResponse> {
        const url = new URL('/api/authenticatev3', this._host);
        const formData = this._createFormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('Login', 'Login');
        const response = await this._fetch(url.href, <RequestInit><unknown>{
            method: 'POST',
            body: formData,
            cache: 'no-cache',
            redirect: 'follow'
        });

        if (response.status === 401) {
            throw new Error('Could not authenticate, check credentials and try again');
        }

        if (this._environment === Environment.Node) {
            const cookie = this.parseCookies(response);
            const xsrfToken = this.parseXsrfToken(cookie);
            this._headers['cookie'] = cookie;
            this._headers['xsrf-token'] = xsrfToken;
        }

        return response;
    }
    
    private parseCookies(response: Response): string {
        return response.headers.get('set-cookie') ?? '';
    }

    private parseXsrfToken(cookie: string): string {
        const regex = new RegExp(/xsrf-token=[^;]*/g);
        const matches = cookie.match(regex);
        if (!matches) {
            throw new Error('Could not parse XSRF token');
        }

        const xsrfCookie = matches[0];
        const xsrfToken = xsrfCookie.split('=')[1];
        return xsrfToken;
    }
}
