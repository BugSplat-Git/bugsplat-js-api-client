import { BugSplatApiError, BugSplatRateLimitError } from './api-client';

describe('BugSplatApiError', () => {
    it('should be marked as an api error', () => {
        const error = new BugSplatApiError('forbidden', 403);

        expect(error.isApiError).toBeTrue();
        expect(error instanceof Error).toBeTrue();
    });

    it('should carry the response status', () => {
        const error = new BugSplatApiError('forbidden', 403);

        expect(error.status).toBe(403);
        expect(error.message).toBe('forbidden');
        expect(error.name).toBe('BugSplatApiError');
    });
});

describe('BugSplatRateLimitError', () => {
    it('should be marked as a rate limit error', () => {
        const error = new BugSplatRateLimitError('too many requests');

        expect(error.isRateLimitError).toBeTrue();
        expect(error instanceof Error).toBeTrue();
    });

    it('should default status to 429', () => {
        const error = new BugSplatRateLimitError('too many requests');

        expect(error.status).toBe(429);
    });

    it('should be a BugSplatApiError so status-based handling catches it too', () => {
        const error = new BugSplatRateLimitError('too many requests');

        expect(error instanceof BugSplatApiError).toBeTrue();
        expect(error.isApiError).toBeTrue();
        expect(error.name).toBe('BugSplatRateLimitError');
    });
});
