import { ApiClient, BugSplatResponse, GZippedSymbolFile, S3ApiClient } from '@common';
import { delay } from '../../common/delay';

export class SymbolsApiClient {
    private readonly uploadUrl = '/symsrv/uploadUrl';
    private readonly uploadCompleteUrl = '/symsrv/uploadComplete';
    private _s3ApiClient = new S3ApiClient();
    private _timer = delay;

    constructor(private _client: ApiClient) { }

    // Gzip implementation is different in node.js vs browser
    // Consumer must gzip files before calling this method
    async postSymbols(
        database: string,
        application: string,
        version: string,
        files: Array<GZippedSymbolFile>
    ): Promise<Array<BugSplatResponse>> {
        const promises = files
            .map(async (file) => {
                const [checkStream, untouchedStream] = file.file.tee();
                const { value, done } = await checkStream.getReader().read();

                if (done) {
                    throw new Error('Could not read symbol file stream');
                }

                if (!this.isGzipMagicBytes(value)) {
                    throw new Error('Symbol file stream is not a gzipped stream');
                }

                file.file = untouchedStream;
                const presignedUrl = await this.getPresignedUrl(
                    database,
                    application,
                    version,
                    file
                );
                const additionalHeaders = {
                    'content-encoding': 'gzip'
                };

                const uploadResponse = await this._s3ApiClient.uploadFileToPresignedUrl(presignedUrl, file, additionalHeaders);

                await this.postUploadComplete(
                    database,
                    application,
                    version,
                    file
                );

                await this._timer(1000);

                return uploadResponse;
            });

        return Promise.all(promises);
    }

    private async getPresignedUrl(
        database: string,
        appName: string,
        appVersion: string,
        file: GZippedSymbolFile
    ): Promise<string> {
        const formData = this._client.createFormData();
        formData.append('database', database);
        formData.append('appName', appName);
        formData.append('appVersion', appVersion);
        formData.append('size', `${file.uncompressedSize}`);
        formData.append('symFileName', file.name);
        formData.append('moduleName', file.moduleName);
        formData.append('dbgId', file.dbgId);
        formData.append('lastModified', `${file.lastModified}`);
        formData.append('SendPdbsVersion', 'spdbsv2');

        const request = {
            method: 'POST',
            body: formData,
            cache: 'no-cache',
            credentials: 'include',
            redirect: 'follow',
            duplex: 'half'
        } as RequestInit;

        const response = await this._client.fetch(this.uploadUrl, request);
        if (response.status === 429) {
            throw new Error('Error getting presigned URL, too many requests');
        }

        if (response.status === 403) {
            throw new Error('Error getting presigned URL, invalid credentials');
        }

        if (response.status !== 200) {
            throw new Error(`Error getting presigned URL for ${file.name}`);
        }

        const json = await response.json() as Response & { url?: string };
        if (json.Status === 'Failed') {
            throw new Error(json.Error);
        }

        return json.url as string;
    }

    private async postUploadComplete(
        database: string,
        appName: string,
        appVersion: string,
        file: GZippedSymbolFile
    ): Promise<BugSplatResponse> {
        const formData = this._client.createFormData();
        formData.append('database', database);
        formData.append('appName', appName);
        formData.append('appVersion', appVersion);
        formData.append('size', `${file.uncompressedSize}`);
        formData.append('symFileName', file.name);
        formData.append('moduleName', file.moduleName);
        formData.append('dbgId', file.dbgId);
        formData.append('lastModified', `${file.lastModified}`);
        formData.append('SendPdbsVersion', 'spdbsv2');

        const request = {
            method: 'POST',
            body: formData,
            cache: 'no-cache',
            credentials: 'include',
            redirect: 'follow',
            duplex: 'half'
        } as RequestInit;

        const response = await this._client.fetch(this.uploadCompleteUrl, request);

        if (response.status !== 200) {
            throw new Error(`Error completing symbol upload for ${file.name}, status ${response.status}`);
        }

        const json = await response.json() as Response & { url?: string };
        if (json.Status === 'Failed') {
            throw new Error(json.Error);
        }

        return response;
    }

    private isGzipMagicBytes(buffer: Buffer) {
        const view = new Uint8Array(buffer);
        return view[0] === 0x1f && view[1] === 0x8b;
    }
}

type Response = { Status: string, Error?: string };