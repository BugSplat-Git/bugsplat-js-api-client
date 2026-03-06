import { buildFeedbackXml } from './user-feedback';

describe('buildFeedbackXml', () => {
    it('should produce userFeedback XML with title and description', () => {
        const xml = buildFeedbackXml('Login button broken', 'Nothing happens when I tap login');

        expect(xml).toContain('<feedback version="1">');
        expect(xml).toContain('<title>Login button broken</title>');
        expect(xml).toContain('<description>Nothing happens when I tap login</description>');
        expect(xml).toContain('</feedback>');
        expect(xml).not.toContain('<bsCrashReport>');
        expect(xml).not.toContain('<threads>');
        expect(xml).not.toContain('<frame>');
    });

    it('should handle empty description', () => {
        const xml = buildFeedbackXml('Crash on startup');

        expect(xml).toContain('<title>Crash on startup</title>');
        expect(xml).toContain('<description></description>');
    });

    it('should escape XML special characters in title', () => {
        const xml = buildFeedbackXml('Error <"test"> & \'more\'');

        expect(xml).toContain('<title>Error &lt;&quot;test&quot;&gt; &amp; &apos;more&apos;</title>');
    });

    it('should escape XML special characters in description', () => {
        const xml = buildFeedbackXml('Title', 'Use <b>bold</b> & "quotes"');

        expect(xml).toContain('<description>Use &lt;b&gt;bold&lt;/b&gt; &amp; &quot;quotes&quot;</description>');
    });

    it('should start with XML declaration', () => {
        const xml = buildFeedbackXml('Test', 'Desc');

        expect(xml).toMatch(/^<\?xml version="1\.0" encoding="utf-8"\?>/);
    });
});
