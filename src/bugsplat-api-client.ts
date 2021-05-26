import fetchPonyfill from 'fetch-ponyfill';
import FormData from 'form-data';

export class BugSplatApiClient {
    private _cookie = '';
    private _fetch = fetchPonyfill().fetch;
    private _formData = () => new FormData();

    constructor(private _host: string = 'https://app.bugsplat.com') { }

    async login(email: string, password: string): Promise<Response> {
        const postOptions = this.createLoginPostRequestOptions(email, password);
        const response = await this._fetch(postOptions.url, postOptions.init);
        const cookie = this.parseCookies(response);
        this._cookie = cookie;
        return response;
    }

    private createLoginPostRequestOptions(email: string, password: string): { url: string, init: RequestInit } {
        const url = new URL('/api/authenticatev3', this._host);
        const formData = <any>this._formData();
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

    private parseCookies(response) {
        const raw = response.headers.raw()['set-cookie'];
        return raw.map((entry) => {
            const parts = entry.split(';');
            const cookiePart = parts[0];
            return cookiePart;
        }).join(';');
    }
}

