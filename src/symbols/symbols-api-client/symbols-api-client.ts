import type fs from 'fs';
import { lastValueFrom, timer } from 'rxjs';
import { ApiClient, BugSplatResponse } from '../../common';
import { S3ApiClient } from '../s3-api-client/s3-api-client';

export class SymbolsApiClient {

    private readonly route = '/api/symbols';

    private _timer = timer;

    constructor(private _client: ApiClient) { }

    async delete(
        database: string,
        application: string,
        version: string
    ): Promise<BugSplatResponse> {
        const route = `${this.route}?dbName=${database}&appName=${application}&appVersion=${version}`;
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

    async post(
        database: string,
        application: string,
        version: string,
        files: Array<{ name: string, size: number, file: File | fs.ReadStream }>
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
    
                const s3Client = new S3ApiClient();
                const response = s3Client.uploadFileToPresignedUrl(presignedUrl, file.file, size);
                await lastValueFrom(this._timer(1000));

                return response;
            });
    
        return Promise.all(promises);
    }

    private async getPresignedUrl(
        dbName: string,
        appName: string,
        appVersion: string,
        size: number,
        symFileName: string
    ): Promise<string> {
        const formData = this._client.createFormData();
        formData.append('dbName', dbName);
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
        if (response.status !== 200) {
            throw new Error(`Error getting presignedUrl for ${symFileName}`);
        }

        const json = await response.json();
        if (json.Status === 'Failed') {
            throw new Error(json.Error);
        }

        return json.url;
    }
}
