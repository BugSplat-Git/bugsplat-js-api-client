import {
    BugSplatApiClient,
    BugSplatRateLimitError,
    BugSplatResponse,
    UploadableFile,
} from '@common';
import { CrashPostClient } from './crash-post-client';

export interface UserFeedbackOptions {
    title: string;
    description?: string;
    user?: string;
    email?: string;
    appKey?: string;
    attachments?: UploadableFile[];
    attributes?: Record<string, string>;
}

/**
 * Response body from POST /post/feedback/
 */
export interface PostUserFeedbackResponse {
    status: string;
    message: string;
    crash_id: number;
    url?: string;
    current_server_time?: number;
}

export function buildFeedbackJson(title: string, description?: string): string {
    return JSON.stringify({
        title,
        description: description ?? '',
    });
}

/**
 * Posts user feedback via multipart FormData to `/post/feedback/`.
 * The server packages title/description as feedback.json and zips attachments.
 * Prefer this over the S3 crash-post path to avoid browser CORS issues.
 */
export async function postUserFeedback(
    client: CrashPostClient,
    application: string,
    version: string,
    options: UserFeedbackOptions,
): Promise<BugSplatResponse<PostUserFeedbackResponse>> {
    const host = `https://${client.database}.bugsplat.com`;
    const apiClient = new BugSplatApiClient(host, client.environment);
    const formData = apiClient.createFormData();

    formData.append('database', client.database);
    formData.append('appName', application);
    formData.append('appVersion', version);
    formData.append('title', options.title);

    if (options.description != null) {
        formData.append('description', options.description);
    }
    if (options.user) {
        formData.append('user', options.user);
    }
    if (options.email) {
        formData.append('email', options.email);
    }
    if (options.appKey) {
        formData.append('appKey', options.appKey);
    }
    if (options.attributes && Object.keys(options.attributes).length > 0) {
        formData.append('attributes', JSON.stringify(options.attributes));
    }

    for (const attachment of options.attachments ?? []) {
        appendUploadableAttachment(formData, attachment);
    }

    const response = await apiClient.fetch<PostUserFeedbackResponse>('/post/feedback/', {
        method: 'POST',
        body: formData,
        cache: 'no-cache',
        redirect: 'follow',
        duplex: 'half',
    } as RequestInit);

    if (response.status === 429) {
        throw new BugSplatRateLimitError('Failed to post user feedback, too many requests');
    }

    return response;
}

/**
 * Append an UploadableFile to FormData in a shape that works in Node and browsers.
 * Mirrors bugsplat-js appendAttachment: Buffers/bytes are wrapped in Blob so the
 * part gets a filename Content-Disposition header.
 */
function appendUploadableAttachment(formData: FormData, file: UploadableFile): void {
    const content = file.file;

    if (Buffer.isBuffer(content)) {
        // Pass a view of only this buffer's bytes (not the whole ArrayBuffer).
        // Cast narrows buffer type to ArrayBuffer for BlobPart compatibility —
        // SharedArrayBuffer-backed views are not expected here.
        const bytes = new Uint8Array(
            content.buffer,
            content.byteOffset,
            content.byteLength
        ) as Uint8Array<ArrayBuffer>;
        formData.append(file.name, new Blob([bytes]), file.name);
        return;
    }

    if (typeof File !== 'undefined' && content instanceof File) {
        formData.append(file.name, content, file.name);
        return;
    }

    // ReadableStream — wrap as Blob via Response when available
    if (isReadableStream(content)) {
        throw new Error(
            `Attachment "${file.name}" is a ReadableStream; convert to Buffer or File before posting feedback`
        );
    }

    throw new Error(`Unsupported UploadableFile content type for "${file.name}"`);
}

function isReadableStream(value: unknown): boolean {
    return (
        typeof value === 'object' &&
        value !== null &&
        typeof (value as { getReader?: unknown }).getReader === 'function'
    );
}
