import { buildFeedbackJson } from './user-feedback';

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
