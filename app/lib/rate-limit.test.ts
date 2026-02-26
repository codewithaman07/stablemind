import { describe, it } from 'node:test';
import assert from 'node:assert';
import { rateLimit } from './rate-limit.ts';

describe('rateLimit', () => {
    it('should allow requests within limit', () => {
        const identifier = 'test-1';
        const limit = 5;
        const windowMs = 1000;

        for (let i = 0; i < limit; i++) {
            const result = rateLimit(identifier, limit, windowMs);
            assert.ok(result.success, `Request ${i} should succeed`);
        }
    });

    it('should block requests exceeding limit', () => {
        const identifier = 'test-2';
        const limit = 3;
        const windowMs = 1000;

        for (let i = 0; i < limit; i++) {
            rateLimit(identifier, limit, windowMs);
        }

        const result = rateLimit(identifier, limit, windowMs);
        assert.strictEqual(result.success, false, 'Request exceeding limit should fail');
        assert.strictEqual(result.remaining, 0, 'Remaining should be 0');
    });

    it('should reset limit after window expires', async () => {
        const identifier = 'test-3';
        const limit = 1;
        const windowMs = 100; // short window for testing

        rateLimit(identifier, limit, windowMs);
        const fail = rateLimit(identifier, limit, windowMs);
        assert.strictEqual(fail.success, false, 'Should be blocked');

        await new Promise(resolve => setTimeout(resolve, 150));

        const success = rateLimit(identifier, limit, windowMs);
        assert.strictEqual(success.success, true, 'Should reset after window');
    });
});
