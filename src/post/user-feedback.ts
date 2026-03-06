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

export function buildFeedbackXml(title: string, description?: string): string {
    const escapedTitle = escapeXml(title);
    const escapedDescription = description ? escapeXml(description) : '';

    return [
        '<?xml version="1.0" encoding="utf-8"?>',
        '<feedback version="1">',
        `  <title>${escapedTitle}</title>`,
        `  <description>${escapedDescription}</description>`,
        '</feedback>',
    ].join('\n');
}

function escapeXml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export async function postUserFeedback(
    client: CrashPostClient,
    application: string,
    version: string,
    options: UserFeedbackOptions,
): Promise<ReturnType<CrashPostClient['postCrash']>> {
    const xml = buildFeedbackXml(options.title, options.description);
    const xmlBuffer = Buffer.from(xml, 'utf-8');
    const xmlFile = new UploadableFile('bsCrashReport.xml', xmlBuffer.length, xmlBuffer);

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
        xmlFile,
        Object.keys(attributes).length > 0 ? attributes : undefined
    );
}
