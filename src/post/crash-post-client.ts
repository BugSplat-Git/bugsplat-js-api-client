import { BugSplatApiClient, BugSplatResponse, Environment, S3ApiClient, UploadableFile } from '@common';
import { CrashType } from '@post';
import { PostCrashResponse } from './post-crash-response';

export class CrashPostClient {

    private _processorApiClient: BugSplatApiClient;
    private _s3ApiClient = new S3ApiClient();

    constructor(
        private _database: string,
        private _environment: Environment = Environment.Node,
        private _processor: string = '' // Internal use only
    ) {
        this._processorApiClient = new BugSplatApiClient(
            `https://${this._database}.bugsplat.com`,
            this._environment
        );
    }

    async postCrash(
        application: string,
        version: string,
        type: CrashType,
        file: UploadableFile,
        attributes?: Record<string, string>
    ): Promise<BugSplatResponse<PostCrashResponse>> {
        const uploadUrl = await this.getCrashUploadUrl(
            this._database,
            application,
            version,
            file.size
        );

        await this._s3ApiClient.uploadFileToPresignedUrl(uploadUrl, file);

        return this.commitS3CrashUpload(
            uploadUrl,
            this._database,
            application,
            version,
            type,
            attributes,
            this._processor
        );
    }

    private async getCrashUploadUrl(
        database: string,
        application: string,
        version: string,
        size: number
    ): Promise<string> {
        const route = 'api/getCrashUploadUrl'
            + `?database=${database}`
            + `&appName=${application}`
            + `&appVersion=${version}`
            + `&crashPostSize=${size}`;
        const response = await this._processorApiClient.fetch<{ url: string}>(route);
        if (response.status === 429) {
            throw new Error('Failed to get crash upload URL, too many requests');
        }

        if (response.status !== 200) {
            throw new Error('Failed to get crash upload URL');
        }

        const json = await response.json();
        return json.url;
    }

    private async commitS3CrashUpload(
        s3Key: string,
        database: string,
        application: string,
        version: string,
        crashType: CrashType,
        attributes?: Record<string, string>,
        processor?: string,
    ): Promise<BugSplatResponse<PostCrashResponse>> {
        const route = '/api/commitS3CrashUpload';
        const formData = this._processorApiClient.createFormData();
        formData.append('database', database);
        formData.append('appName', application);
        formData.append('appVersion', version);
        formData.append('crashType', crashType.name);
        formData.append('crashTypeId', `${crashType.id}`);
        formData.append('s3key', s3Key);

        if (attributes) {
            formData.append('attributes', JSON.stringify(attributes));
        }

        if (processor) {
            formData.append('processor', processor);
        }

        const request = {
            method: 'POST',
            body: formData,
            cache: 'no-cache',
            redirect: 'follow',
            duplex: 'half'
        } as RequestInit;
        
        return this._processorApiClient.fetch(route, request);
    }
}