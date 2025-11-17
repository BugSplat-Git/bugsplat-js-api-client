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

    private _s3ApiClient: S3ApiClient;
    private _tableDataClient: TableDataClient;
    private _timer = delay;

    constructor(private _client: ApiClient) {
        this._s3ApiClient = new S3ApiClient(this._client.logger);
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
        const route = `${this.route}?database=${database}&appVersions=${appVersionsParam}`;
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
        const route = `${this.route}?database=${database}&appName=${application}&appVersion=${version}&fullDumps=${fullDumpsFlag}`;
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
        const route = `${this.route}?database=${database}&appName=${application}&appVersion=${version}&retired=${retiredFlag}`;
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
        const route = `${this.route}?database=${database}&appName=${application}&appVersion=${version}`;
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
        
        this._client.logger?.log(`Getting presigned URL for ${file.name}`, {
            database,
            appName,
            appVersion,
            status: response.status
        });

        if (response.status === 429) {
            const error = 'Error getting presigned URL, too many requests';
            this._client.logger?.error(error, { file: file.name, status: response.status });
            throw new Error(error);
        }

        if (response.status === 403) {
            const error = 'Error getting presigned URL, invalid credentials';
            this._client.logger?.error(error, { file: file.name, status: response.status });
            throw new Error(error);
        }

        if (response.status !== 200) {
            let errorDetails: unknown = { status: response.status };
            try {
                const responseText = await response.text();
                errorDetails = { status: response.status, responseText };
                this._client.logger?.error(`Error getting presigned URL for ${file.name}`, errorDetails);
            } catch (e) {
                this._client.logger?.error(`Error getting presigned URL for ${file.name} - failed to read response text`, e);
            }
            throw new Error(`Error getting presigned URL for ${file.name}`);
        }

        let json: Response & { url?: string };
        try {
            json = (await response.json()) as Response & { url?: string };
        } catch (e) {
            this._client.logger?.error(`Error parsing presigned URL response for ${file.name}`, { 
                status: response.status, 
                parseError: e instanceof Error ? e.message : String(e)
            });
            throw new Error(`Error getting presigned URL for ${file.name}: Failed to parse response`);
        }
        if (json.Status === 'Failed') {
            const error = json.Error || 'Unknown error';
            this._client.logger?.error(`Presigned URL request failed for ${file.name}`, { 
                status: json.Status, 
                error 
            });
            throw new Error(error);
        }

        return json.url as string;
    }
}

type Response = { Status: string; Error?: string };
