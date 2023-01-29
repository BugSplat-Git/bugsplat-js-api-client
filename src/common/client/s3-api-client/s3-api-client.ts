import { UploadableFile } from '@common';

export class S3ApiClient {

    private _fetch = globalThis.fetch;

    async uploadFileToPresignedUrl(presignedUrl: string, file: UploadableFile): Promise<Response> {
        const response = await this._fetch(presignedUrl, {
            method: 'PUT',
            headers: {
                'content-type': 'application/octet-stream',
                'content-length': `${file.size}`
            },
            body: file.file as BodyInit,
            duplex: 'half'
        } as RequestInit);

        if (response.status !== 200) {
            throw new Error(`Error uploading to presigned URL ${presignedUrl}`);
        }

        return response;
    }
}