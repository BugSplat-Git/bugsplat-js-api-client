import fs from 'fs';
import path from 'path';
import { lastValueFrom, timer } from 'rxjs';
import util from 'util';
import { ApiClient, BugSplatResponse } from '../../common';
import { exists } from '../exists';
import { S3ApiClient } from '../s3-api-client/s3-api-client';
const stat = util.promisify(fs.stat);

export class SymbolsApiClient {

    private readonly route = '/api/symbols';
    private _stat = stat;
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

        const response = await this._client.fetch(route, <any>init);
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
        files: Array<string>
    ): Promise<Array<BugSplatResponse>> {
        const promises = files
            .map(async (file) => {
                if (!exists(file)) {
                    throw new Error(`File does not exist at path: ${file}!`);
                }
                
                const stats = await this._stat(file);
                const size = stats.size;
                const name = path.basename(file);
                const presignedUrl = await this.getPresignedUrl(
                    database,
                    application,
                    version,
                    size,
                    name
                );
    
                const s3Client = new S3ApiClient();
                const response = s3Client.uploadFileToPresignedUrl(presignedUrl, file, size);
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

        const response = await this._client.fetch(this.route, <any>init);
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
