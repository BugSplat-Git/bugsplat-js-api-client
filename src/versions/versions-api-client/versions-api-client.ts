import { ApiClient, UploadableFile, BugSplatResponse, S3ApiClient, TableDataClient, TableDataRequest, TableDataResponse } from '@common';
import { lastValueFrom, timer } from 'rxjs';
import { VersionsApiRow } from '../versions-api-row/versions-api-row';

export class VersionsApiClient {

    private readonly route = '/api/versions';

    private _s3ApiClient: S3ApiClient;
    private _tableDataClient: TableDataClient;
    private _timer = timer;

    constructor(private _client: ApiClient) {
        this._s3ApiClient = new S3ApiClient();
        this._tableDataClient = new TableDataClient(this._client, this.route);
    }

    async getVersions(request: TableDataRequest): Promise<TableDataResponse<VersionsApiRow>> {
        const response = await this._tableDataClient.getData(request);
        const json = await response.json();
        const pageData = json.pageData;
        const rows = json.rows.map(row => new VersionsApiRow(row));

        return {
            rows,
            pageData
        };
    }

    async putFullDumps(
        database: string,
        application: string,
        version: string,
        fullDumps: boolean
    ): Promise<BugSplatResponse> {
        const fullDumpsFlag = fullDumps ? '1' : '0';
        const route = `${this.route}?database=${database}&appName=${application}&appVersion=${version}&fullDumps=${fullDumpsFlag}`;
        const init = {
            method: 'PUT',
            cache: 'no-cache',
            credentials: 'include',
            redirect: 'follow'
        };

        return this._client.fetch(route, <RequestInit>init);
    }
    
    async putRetired(
        database: string,
        application: string,
        version: string,
        retired: boolean
    ): Promise<BugSplatResponse> {
        const retiredFlag = retired ? '1' : '0';
        const route = `${this.route}?database=${database}&appName=${application}&appVersion=${version}&retired=${retiredFlag}`;
        const init = {
            method: 'PUT',
            cache: 'no-cache',
            credentials: 'include',
            redirect: 'follow'
        };

        return this._client.fetch(route, <RequestInit>init);
    }

    async deleteSymbols(
        database: string,
        application: string,
        version: string
    ): Promise<BugSplatResponse> {
        const route = `${this.route}?database=${database}&appName=${application}&appVersion=${version}`;
        const init = {
            method: 'DELETE',
            cache: 'no-cache',
            credentials: 'include',
            redirect: 'follow'
        };

        const response = await this._client.fetch(route, <RequestInit>init);
        if (response.status !== 200) {
            throw new Error(`Error deleting symbols for ${database}-${application}-${version} status ${response.status}`);
        }

        const json = await response.json();
        if (json.Status === 'Failed') {
            throw new Error(json.Error);
        }

        return response;
    }

    async postSymbols(
        database: string,
        application: string,
        version: string,
        files: Array<UploadableFile> 
    ): Promise<Array<BugSplatResponse>> {
        const promises = files
            .map(async (file) => {
                const name = file.name;
                const size = file.size;
                const presignedUrl = await this.getPresignedUrl(
                    database,
                    application,
                    version,
                    size,
                    name
                );
    
                const response = await this._s3ApiClient.uploadFileToPresignedUrl(presignedUrl, file);
                await lastValueFrom(this._timer(1000));

                return response;
            });
    
        return Promise.all(promises);
    }

    private async getPresignedUrl(
        database: string,
        appName: string,
        appVersion: string,
        size: number,
        symFileName: string
    ): Promise<string> {
        const formData = this._client.createFormData();
        formData.append('database', database);
        formData.append('appName', appName);
        formData.append('appVersion', appVersion);
        formData.append('size', size.toString());
        formData.append('symFileName', symFileName);
        const init = {
            method: 'POST',
            body: formData,
            cache: 'no-cache',
            credentials: 'include',
            redirect: 'follow'
        };

        const response = await this._client.fetch(this.route, <RequestInit><unknown>init);
        if (response.status === 403) {
            throw new Error('Error getting presigned URL, invalid credentials');
        }

        if (response.status !== 200) {
            throw new Error(`Error getting presigned URL for ${symFileName}`);
        }

        const json = await response.json();
        if (json.Status === 'Failed') {
            throw new Error(json.Error);
        }

        return json.url;
    }
}
