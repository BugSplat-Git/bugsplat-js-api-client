import { UploadableFile } from '@common';
import { CrashPostClient } from './crash-post-client';
import { CrashType } from './crash-type';

export interface UserFeedbackOptions {
    title: string;
    description?: string;
    user?: string;
    email?: string;
    attachments?: UploadableFile[];
    attributes?: Record<string, string>;
}

export function buildFeedbackJson(title: string, description?: string): string {
    return JSON.stringify({
        title,
        description: description ?? '',
    });
}

export async function postUserFeedback(
    client: CrashPostClient,
    application: string,
    version: string,
    options: UserFeedbackOptions,
): Promise<ReturnType<CrashPostClient['postCrash']>> {
    const json = buildFeedbackJson(options.title, options.description);
    const jsonBuffer = Buffer.from(json, 'utf-8');
    const jsonFile = new UploadableFile('feedback.json', jsonBuffer.length, jsonBuffer);

    const attributes: Record<string, string> = { ...options.attributes };
    if (options.user) {
        attributes['user'] = options.user;
    }
    if (options.email) {
        attributes['email'] = options.email;
    }

    return client.postCrash(
        application,
        version,
        CrashType.userFeedback,
        jsonFile,
        Object.keys(attributes).length > 0 ? attributes : undefined
    );
}
