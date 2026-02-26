import { describe, it } from 'node:test';
import assert from 'node:assert';
import { timeAgo } from './utils.ts';

describe('timeAgo', () => {
  it('returns "just now" for times less than 60 seconds ago', () => {
    const now = Date.now();
    const result = timeAgo(new Date(now - 30 * 1000).toISOString());
    assert.strictEqual(result, 'just now');
  });

  it('returns "Xm ago" for times between 1 minute and 1 hour', () => {
    const now = Date.now();
    const result = timeAgo(new Date(now - 5 * 60 * 1000).toISOString());
    assert.strictEqual(result, '5m ago');
  });

  it('returns "Xh ago" for times between 1 hour and 24 hours', () => {
    const now = Date.now();
    const result = timeAgo(new Date(now - 3 * 3600 * 1000).toISOString());
    assert.strictEqual(result, '3h ago');
  });

  it('returns "Xd ago" for times between 1 day and 7 days', () => {
    const now = Date.now();
    const result = timeAgo(new Date(now - 2 * 86400 * 1000).toISOString());
    assert.strictEqual(result, '2d ago');
  });

  it('returns locale date string for times older than 7 days', () => {
    const now = Date.now();
    const pastDate = new Date(now - 10 * 86400 * 1000);
    const result = timeAgo(pastDate.toISOString());
    assert.strictEqual(result, pastDate.toLocaleDateString());
  });
});
