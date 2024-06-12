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
                const originalStream = file.file;
                const [checkStream, uploadStream] = originalStream.tee();
                const reader = checkStream.getReader();
                try {
                    const { value, done } = await reader.read();
                    
                    if (done) {
                        throw new Error('Could not read symbol file stream');
                    }

                    if (!this.isGzipMagicBytes(value)) {
                        throw new Error('Symbol file stream is not a gzipped stream');
                    }
                } finally {
                    // Teed streams cause the original stream to dequeue at the rate of the slowest stream.
                    // If we don't cancel checkStream, the buffer will up to the size of the original stream.
                    // Release the lock, so we can cancel the reader, then cancel the stream.
                    reader.releaseLock();
                    reader.cancel();
                    checkStream.cancel();
                }

                let uploadResponse: globalThis.Response;

                try {
                    file.file = uploadStream;
                    const presignedUrl = await this.getPresignedUrl(
                        database,
                        application,
                        version,
                        file
                    );
                    const additionalHeaders = {
                        'content-encoding': 'gzip'
                    };
    
                    uploadResponse = await this._s3ApiClient.uploadFileToPresignedUrl(presignedUrl, file, additionalHeaders);
    
                    await this.postUploadComplete(
                        database,
                        application,
                        version,
                        file
                    );
                } finally {
                    // Unfortunately, the original stream gets locked when we tee it, so we can't cancel it directly.
                    // When both teed streams are cancelled, the original stream _should_ also be cancelled.
                    // There's not a lot of documentation on this, so we might be mistaken.
                    uploadStream.cancel();
                }

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