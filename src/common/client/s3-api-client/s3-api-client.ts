import fetchPonyfill from 'fetch-ponyfill';
import { BugSplatFile } from 'src/common/file/bugsplat-file';

export class S3ApiClient {

    private _fetch = fetchPonyfill().fetch;

    async uploadFileToPresignedUrl(presignedUrl: string, file: BugSplatFile): Promise<Response> {
        const response = await this._fetch(presignedUrl, {
            method: 'PUT',
            headers: {
                'content-type': 'application/octet-stream',
                'content-length': `${file.size}`
            },
            body: file.file as BodyInit
        });

        if (response.status !== 200) {
            throw new Error(`Error uploading to presignedUrl ${presignedUrl}`);
        }

        return response;
    }
}