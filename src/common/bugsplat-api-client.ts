import fetchPonyfill from 'fetch-ponyfill';
import FormData from 'form-data';

export class BugSplatApiClient { 
    private _cookie = '';
    private _xsrfToken = '';
    private _fetch = fetchPonyfill().fetch;
    private _createFormData = () => new FormData();
    
    constructor(
        private _email: string,
        private _password: string,
        private _host: string = 'https://app.bugsplat.com',
    ) { }

    createFormData(): FormData {
        return this._createFormData();
    }

    async fetch(route: string, init: RequestInit): Promise<Response> {
        if (!this._cookie || !this._xsrfToken) {
            await this.login(this._email, this._password);
        }

        if (!init.headers) {
            init.headers = {};
        }

        init.headers['cookie'] = this._cookie;

        if (init.method === 'POST') {
            init.headers['xsrf-token'] = this._xsrfToken;
        }

        const url = new URL(route, this._host);
        return this._fetch(url.href, init);
    }

    async login(email: string, password: string): Promise<Response> {
        const postOptions = this.createLoginPostRequestOptions(email, password);
        const response = await this._fetch(postOptions.url, postOptions.init);
        
        if (response.status === 401) {
            throw new Error('Invalid email or password');
        }

        const cookie = this.parseCookies(response);
        this._xsrfToken = this.parseXsrfToken(cookie);
        this._cookie = cookie;
        return response;
    }

    private createLoginPostRequestOptions(email: string, password: string): { url: string, init: RequestInit } {
        const url = new URL('/api/authenticatev3', this._host);
        const formData = <any>this._createFormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('Login', 'Login');
        return {
            url: url.href,
            init: {
                method: 'POST',
                body: formData,
                cache: 'no-cache',
                credentials: 'include',
                redirect: 'follow'
            }
        };
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
