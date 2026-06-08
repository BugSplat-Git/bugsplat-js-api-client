import { BugSplatRateLimitError } from './api-client';

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
});
