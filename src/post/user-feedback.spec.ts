import { BugSplatRateLimitError, Environment, UploadableFile } from '@common';
import * as BugSplatApiClientModule from '../common/client/bugsplat-api-client/bugsplat-api-client';
import { buildFeedbackJson, postUserFeedback } from './user-feedback';

describe('buildFeedbackJson', () => {
    it('should produce JSON with title and description', () => {
        const json = buildFeedbackJson('Login button broken', 'Nothing happens when I tap login');
        const parsed = JSON.parse(json);

        expect(parsed.title).toBe('Login button broken');
        expect(parsed.description).toBe('Nothing happens when I tap login');
    });

    it('should handle empty description', () => {
        const json = buildFeedbackJson('Crash on startup');
        const parsed = JSON.parse(json);

        expect(parsed.title).toBe('Crash on startup');
        expect(parsed.description).toBe('');
    });

    it('should handle special characters without manual escaping', () => {
        const json = buildFeedbackJson('Error <"test"> & \'more\'', 'Use <b>bold</b> & "quotes"');
        const parsed = JSON.parse(json);

        expect(parsed.title).toBe('Error <"test"> & \'more\'');
        expect(parsed.description).toBe('Use <b>bold</b> & "quotes"');
    });

    it('should produce valid JSON', () => {
        const json = buildFeedbackJson('Test', 'Desc');

        expect(() => JSON.parse(json)).not.toThrow();
    });
});

describe('postUserFeedback', () => {
    let formData: { append: jasmine.Spy };
    let apiClient: { createFormData: jasmine.Spy; fetch: jasmine.Spy };
    let client: { database: string; environment: Environment };

    beforeEach(() => {
        formData = { append: jasmine.createSpy('append') };
        apiClient = {
            createFormData: jasmine.createSpy('createFormData').and.returnValue(formData),
            fetch: jasmine.createSpy('fetch').and.resolveTo({
                status: 200,
                json: async () => ({ status: 'success', message: 'Feedback received', crash_id: 42 }),
            }),
        };
        spyOn(BugSplatApiClientModule, 'BugSplatApiClient').and.returnValue(apiClient as any);
        client = { database: 'fred', environment: Environment.Node };
    });

    it('should POST multipart form data to /post/feedback/', async () => {
        await postUserFeedback(
            client as any,
            'MyApp',
            '1.0.0',
            { title: 'Broken UI', description: 'Details here' }
        );

        expect(BugSplatApiClientModule.BugSplatApiClient).toHaveBeenCalledWith(
            'https://fred.bugsplat.com',
            Environment.Node
        );
        expect(formData.append).toHaveBeenCalledWith('database', 'fred');
        expect(formData.append).toHaveBeenCalledWith('appName', 'MyApp');
        expect(formData.append).toHaveBeenCalledWith('appVersion', '1.0.0');
        expect(formData.append).toHaveBeenCalledWith('title', 'Broken UI');
        expect(formData.append).toHaveBeenCalledWith('description', 'Details here');
        expect(apiClient.fetch).toHaveBeenCalledWith(
            '/post/feedback/',
            jasmine.objectContaining({
                method: 'POST',
                body: formData,
            })
        );
    });

    it('should append attachments as file parts', async () => {
        const attachmentContent = Buffer.from('log contents', 'utf-8');
        const attachment = new UploadableFile('debug.log', attachmentContent.length, attachmentContent);

        await postUserFeedback(
            client as any,
            'MyApp',
            '1.0.0',
            {
                title: 'With attachment',
                attachments: [attachment],
            }
        );

        const appendCalls = formData.append.calls.allArgs();
        const fileAppend = appendCalls.find(args => args[0] === 'debug.log');
        expect(fileAppend).toBeDefined();
        expect(fileAppend![0]).toBe('debug.log');
        expect(fileAppend![1]).toEqual(jasmine.any(Blob));
        expect(fileAppend![2]).toBe('debug.log');
    });

    it('should pass user, email, appKey, and attributes as form fields', async () => {
        await postUserFeedback(
            client as any,
            'MyApp',
            '1.0.0',
            {
                title: 'Hello',
                user: 'jane',
                email: 'jane@example.com',
                appKey: 'pro-tier',
                attributes: { plan: 'pro' },
            }
        );

        expect(formData.append).toHaveBeenCalledWith('user', 'jane');
        expect(formData.append).toHaveBeenCalledWith('email', 'jane@example.com');
        expect(formData.append).toHaveBeenCalledWith('appKey', 'pro-tier');
        expect(formData.append).toHaveBeenCalledWith('attributes', JSON.stringify({ plan: 'pro' }));
    });

    it('should throw BugSplatRateLimitError on 429', async () => {
        apiClient.fetch.and.resolveTo({ status: 429 });

        await expectAsync(
            postUserFeedback(client as any, 'MyApp', '1.0.0', { title: 'Hello' })
        ).toBeRejectedWith(jasmine.objectContaining({
            name: BugSplatRateLimitError.name,
            isRateLimitError: true,
            status: 429,
        }));
    });
});

