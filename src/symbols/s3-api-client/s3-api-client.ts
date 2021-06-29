import fetchPonyfill from 'fetch-ponyfill';
import fs from 'fs';
import { exists } from '../exists';

export class S3ApiClient {

    private _fetch = fetchPonyfill().fetch;
    private _fs = fs;

    async uploadFileToPresignedUrl(presignedUrl: string, file: string, size: number): Promise<Response> {
        if (!exists(file)) {
            throw new Error(`File does not exist at path: ${file}!`);
        }

        const response = await this._fetch(presignedUrl, {
            method: 'PUT',
            headers: {
                'content-type': 'application/octet-stream',
                'content-length': `${size}`
            },
            body: <any>this._fs.createReadStream(file),
        });

        if (response.status !== 200) {
            throw new Error(`Error uploading ${file} to presignedUrl`);
        }

        return response;
    }
}