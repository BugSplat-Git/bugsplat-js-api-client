import { BugSplatApiClient, UploadableFile, BugSplatResponse, Environment, S3ApiClient } from '@common';
import { CrashType } from '@post';

export class CrashPostClient {

    private _processorApiClient: BugSplatApiClient;
    private _s3ApiClient: S3ApiClient;

    constructor(
        private _database: string,
        private _environment: Environment = Environment.Node,
        private _processor: string = '' // Internal use only
    ) {
        this._processorApiClient = new BugSplatApiClient(
            `https://${this._database}.bugsplat.com`,
            this._environment
        );
        this._s3ApiClient = new S3ApiClient();
    }

    async postCrash(
        application: string,
        version: string,
        type: CrashType,
        file: UploadableFile,
        md5 = ''
    ): Promise<BugSplatResponse> {
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
            md5,
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
        const response = await this._processorApiClient.fetch(route);
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
        md5: string,
        processor?: string,
    ): Promise<BugSplatResponse> {
        const route = '/api/commitS3CrashUpload';
        const formData = this._processorApiClient.createFormData();
        formData.append('database', database);
        formData.append('appName', application);
        formData.append('appVersion', version);
        formData.append('crashType', crashType);
        formData.append('s3key', s3Key);
        formData.append('md5', md5);

        if (processor) {
            formData.append('processor', processor);
        }

        const init = {
            method: 'POST',
            body: formData,
            cache: 'no-cache',
            redirect: 'follow'
          };
        
        return this._processorApiClient.fetch(route, <RequestInit><unknown>init);
    }
}