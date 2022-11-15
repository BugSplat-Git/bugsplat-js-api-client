export interface ApiClient {
    createFormData(): FormData;
    fetch(route: string, init?: RequestInit): Promise<BugSplatResponse>;
}

export interface BugSplatResponse {
    status: number;
    json: () => Promise<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}
