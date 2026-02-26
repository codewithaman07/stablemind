import { test } from 'node:test';
import assert from 'node:assert';
import { sanitizeValue } from './logger';

test('sanitizeValue should redact API keys in strings', () => {
  const sensitiveString = 'AIzaSyD...';
  const sanitized = sanitizeValue(sensitiveString);
  assert.strictEqual(sanitized, '[REDACTED_API_KEY]');
});

test('sanitizeValue should redact JWTs in strings', () => {
  // A fake JWT-like string
  const sensitiveString = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  const sanitized = sanitizeValue(sensitiveString);
  assert.strictEqual(sanitized, '[REDACTED_JWT]');
});

test('sanitizeValue should redact sensitive keys in objects', () => {
  const sensitiveObj = {
    apiKey: 'some-key',
    secretToken: 'secret',
    password: 'password123',
    publicData: 'public',
  };
  const sanitized = sanitizeValue(sensitiveObj) as Record<string, unknown>;
  assert.strictEqual(sanitized.apiKey, '[REDACTED]');
  assert.strictEqual(sanitized.secretToken, '[REDACTED]');
  assert.strictEqual(sanitized.password, '[REDACTED]');
  assert.strictEqual(sanitized.publicData, 'public');
});

test('sanitizeValue should redact nested sensitive keys', () => {
  const nestedObj = {
    config: {
      auth: {
        token: 'secret-token',
      },
      publicInfo: 'info'
    }
  };

  const sanitized = sanitizeValue(nestedObj) as { config: { auth: { token: string }; publicInfo: string } };
  assert.strictEqual(sanitized.config.auth.token, '[REDACTED]');
  assert.strictEqual(sanitized.config.publicInfo, 'info');
});

test('sanitizeValue should handle circular references', () => {
  const obj: Record<string, unknown> = { name: 'circular' };
  obj.self = obj;

  const sanitized = sanitizeValue(obj) as Record<string, unknown>;
  assert.strictEqual(sanitized.name, 'circular');
  assert.strictEqual(sanitized.self, '[CIRCULAR_REFERENCE]');
});

test('sanitizeValue should handle Error objects', () => {
  const error = new Error('Something went wrong') as Error & Record<string, unknown>;
  error.apiKey = 'secret-key';

  const sanitized = sanitizeValue(error) as Record<string, unknown>;
  assert.strictEqual(sanitized.message, 'Something went wrong');
  assert.strictEqual(sanitized.apiKey, '[REDACTED]');
});
