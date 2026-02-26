import { test } from 'node:test';
import assert from 'node:assert';
import { sanitizeHtml } from './security'; // Explicit extension

test('sanitizeHtml SSR behavior', () => {
  const input = '<script>alert("xss")</script><b>Hello</b>';
  // With isomorphic-dompurify, the output should be consistent with client-side sanitization.
  // <script> -> "" (entire tag and content stripped or just tag?)
  // dompurify default behavior removes script tags entirely, including content.
  const expected = '<b>Hello</b>';
  const actual = sanitizeHtml(input);
  assert.strictEqual(actual, expected);
});
