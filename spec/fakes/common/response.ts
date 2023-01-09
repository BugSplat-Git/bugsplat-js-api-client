export function createFakeResponseBody<T>(
    status = 200,
    json = {} as T,
    ok = true,
    headers = new Map()
): FakeResponseBody<T> {
    return new FakeResponseBody(
        status,
        json,
        ok,
        headers
    );
}

export class FakeResponseBody<T> {
    
    private _json: T;
    private _headers: Map<string, string>;

    get headers(): Map<string, string> {
        return this._headers;
    }

    constructor(
        public readonly status = 200,
        json = {} as T,
        public readonly ok = true,
        headers = new Map() as Map<string,string>
    ) {
        this._json = json;
        this._headers = headers;
    }

    async json(): Promise<T> {
        return this._json;
    }

    async text(): Promise<string> {
        return JSON.stringify(this._json);
    }

    clone(): FakeResponseBody<T> {
        return new FakeResponseBody<T>(
            this.status,
            this._json,
            this.ok,
            this._headers
        );
    }
}