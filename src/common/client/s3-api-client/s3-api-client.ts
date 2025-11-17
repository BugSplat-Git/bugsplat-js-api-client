import { Logger, UploadableFile } from '@common';

export class S3ApiClient {

    private _fetch = globalThis.fetch;

    constructor(private _logger?: Logger) { }

    async uploadFileToPresignedUrl(presignedUrl: string, file: UploadableFile, additionalHeaders: HeadersInit = {}): Promise<Response> {
        this._logger?.log('Uploading file to presigned URL', {
            fileName: file.name,
            fileSize: file.size,
            presignedUrl: presignedUrl.substring(0, 100) + '...' // Truncate URL for logging
        });

        const response = await this._fetch(presignedUrl, {
            method: 'PUT',
            headers: {
                'content-type': 'application/octet-stream',
                'content-length': `${file.size}`,
                ...additionalHeaders
            },
            body: file.file as BodyInit,
            duplex: 'half'
        } as RequestInit);

        if (response.status !== 200) {
            let errorDetails: unknown = { status: response.status, presignedUrl: presignedUrl.substring(0, 100) + '...' };
            try {
                const responseText = await response.text();
                errorDetails = { status: response.status, responseText, presignedUrl: presignedUrl.substring(0, 100) + '...' };
                this._logger?.error('Error uploading to presigned URL', errorDetails);
            } catch (e) {
                this._logger?.error('Error uploading to presigned URL - failed to read response text', e);
            }
            throw new Error(`Error uploading to presigned URL ${presignedUrl}`);
        }

        return response;
    }
}