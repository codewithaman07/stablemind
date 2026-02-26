import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { sanitizeHtml } from './security.ts'; // Explicit extension

test('sanitizeHtml SSR behavior', () => {
  const input = '<script>alert("xss")</script><b>Hello</b>';
  const expected = 'alert("xss")Hello';
  const actual = sanitizeHtml(input);
  assert.strictEqual(actual, expected);
});
