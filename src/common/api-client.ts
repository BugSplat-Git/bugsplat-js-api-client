import FormData from 'form-data';

export interface ApiClient {
    createFormData(): FormData;
    fetch(route: string, init: RequestInit): Promise<BugSplatResponse>;
}

export interface BugSplatResponse {
    status: number;
    json: () => Promise<any>;
}
