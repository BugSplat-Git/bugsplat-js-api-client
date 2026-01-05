import {
    ApiClient,
    BugSplatResponse,
    S3ApiClient,
    SymbolFile,
    TableDataClient,
    TableDataRequest,
    TableDataResponse,
    isErrorResponse,
} from '@common';
import { delay } from '../../common/delay';
import { VersionsApiResponseRow, VersionsApiRow } from '../versions-api-row/versions-api-row';
import { PutRetiredResponse } from './put-retired-response';

export class VersionsApiClient {
    private readonly route = '/api/v2/versions';

    private _s3ApiClient = new S3ApiClient();
    private _tableDataClient: TableDataClient;
    private _timer = delay;

    constructor(private _client: ApiClient) {
        this._tableDataClient = new TableDataClient(this._client, this.route);
    }

    async getVersions(request: TableDataRequest): Promise<TableDataResponse<VersionsApiRow>> {
        const response = await this._tableDataClient.getData<VersionsApiResponseRow>(request);
        if (isErrorResponse(response)) {
            throw new Error((await response.json()).message);
        }
        const json = await response.json();
        const pageData = json.pageData;
        const rows = json.rows.map((row) => new VersionsApiRow(row));

        return {
            rows,
            pageData,
        };
    }

    async deleteVersions(
        database: string,
        appVersions: Array<{ application: string; version: string }>
    ): Promise<BugSplatResponse> {
        const appVersionsParam = appVersions
            .reduce((prev, curr) => [...prev, curr.application, curr.version], [] as Array<string>)
            .join(',');
        const route = `${this.route}?database=${encodeURIComponent(database)}&appVersions=${encodeURIComponent(appVersionsParam)}`;
        const request = {
            method: 'DELETE',
            cache: 'no-cache',
            credentials: 'include',
            redirect: 'follow',
        } as RequestInit;

        const response = await this._client.fetch(route, request);
        if (response.status !== 200) {
            throw new Error(
                `Error deleting symbols for ${database}-${appVersionsParam} status ${response.status}`
            );
        }

        const json = (await response.json()) as Response;
        if (json.Status === 'Failed') {
            throw new Error(json.Error);
        }

        return response;
    }

    async putFullDumps(
        database: string,
        application: string,
        version: string,
        fullDumps: boolean
    ): Promise<BugSplatResponse> {
        const fullDumpsFlag = fullDumps ? '1' : '0';
        const route = `${this.route}?database=${encodeURIComponent(database)}&appName=${encodeURIComponent(application)}&appVersion=${encodeURIComponent(version)}&fullDumps=${encodeURIComponent(fullDumpsFlag)}`;
        const request = {
            method: 'PUT',
            cache: 'no-cache',
            credentials: 'include',
            redirect: 'follow',
        } as RequestInit;

        return this._client.fetch(route, request);
    }

    async putRetired(
        database: string,
        application: string,
        version: string,
        retired: boolean
    ): Promise<BugSplatResponse<PutRetiredResponse>> {
        const retiredFlag = retired ? '1' : '0';
        const route = `${this.route}?database=${encodeURIComponent(database)}&appName=${encodeURIComponent(application)}&appVersion=${encodeURIComponent(version)}&retired=${encodeURIComponent(retiredFlag)}`;
        const request = {
            method: 'PUT',
            cache: 'no-cache',
            credentials: 'include',
            redirect: 'follow',
        } as RequestInit;

        return this._client.fetch(route, request);
    }

    async deleteSymbols(
        database: string,
        application: string,
        version: string
    ): Promise<BugSplatResponse> {
        const route = `${this.route}?database=${encodeURIComponent(database)}&appName=${encodeURIComponent(application)}&appVersion=${encodeURIComponent(version)}`;
        const request = {
            method: 'DELETE',
            cache: 'no-cache',
            credentials: 'include',
            redirect: 'follow',
        } as RequestInit;

        const response = await this._client.fetch(route, request);
        if (response.status !== 200) {
            throw new Error(
                `Error deleting symbols for ${database}-${application}-${version} status ${response.status}`
            );
        }

        const json = (await response.json()) as Response;
        if (json.Status === 'Failed') {
            throw new Error(json.Error);
        }

        return response;
    }

    async postSymbols(
        database: string,
        application: string,
        version: string,
        files: Array<SymbolFile>
    ): Promise<Array<BugSplatResponse>> {
        const promises = files.map(async (file) => {
            const presignedUrl = await this.getPresignedUrl(database, application, version, file);

            const response = await this._s3ApiClient.uploadFileToPresignedUrl(presignedUrl, file);
            await this._timer(1000);

            return response;
        });

        return Promise.all(promises);
    }

    private async getPresignedUrl(
        database: string,
        appName: string,
        appVersion: string,
        file: SymbolFile
    ): Promise<string> {
        const formData = this._client.createFormData();
        formData.append('database', database);
        formData.append('appName', appName);
        formData.append('appVersion', appVersion);
        formData.append('size', `${file.size}`);
        formData.append('symFileName', file.name);

        if (file.dbgId) {
            formData.append('dbgId', file.dbgId);
        }

        if (file.lastModified) {
            formData.append('lastModified', `${file.lastModified}`);
        }

        if (file.moduleName) {
            formData.append('moduleName', file.moduleName);
        }

        const request = {
            method: 'POST',
            body: formData,
            cache: 'no-cache',
            credentials: 'include',
            redirect: 'follow',
            duplex: 'half',
        } as RequestInit;

        const response = await this._client.fetch(this.route, request);
        if (response.status === 429) {
            throw new Error('Error getting presigned URL, too many requests');
        }

        if (response.status === 403) {
            throw new Error('Error getting presigned URL, invalid credentials');
        }

        if (response.status !== 200) {
            throw new Error(`Error getting presigned URL for ${file.name}`);
        }

        const json = (await response.json()) as Response & { url?: string };
        if (json.Status === 'Failed') {
            throw new Error(json.Error);
        }

        return json.url as string;
    }
}

type Response = { Status: string; Error?: string };
