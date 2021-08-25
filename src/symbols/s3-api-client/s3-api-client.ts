import fetchPonyfill from 'fetch-ponyfill';
import type fs from 'fs';

export class S3ApiClient {

    private _fetch = fetchPonyfill().fetch;
    async uploadFileToPresignedUrl(presignedUrl: string, file: File | fs.ReadStream, size: number): Promise<Response> {
        const response = await this._fetch(presignedUrl, {
            method: 'PUT',
            headers: {
                'content-type': 'application/octet-stream',
                'content-length': `${size}`
            },
            body: file as BodyInit
        });

        if (response.status !== 200) {
            throw new Error(`Error uploading to presignedUrl ${presignedUrl}`);
        }

        return response;
    }
}