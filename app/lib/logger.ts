
/**
 * Sanitizes the error object to remove sensitive information.
 * @param error The error object.
 * @returns A sanitized error object or string.
 */
export function sanitizeValue(value: unknown, seen = new WeakSet()): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === 'string') {
    // Basic heuristic to redact likely API keys
    // Google API keys start with AIza
    if (value.startsWith('AIza')) {
      return '[REDACTED_API_KEY]';
    }
    // Redact JWTs (start with eyJ and are long)
    if (value.startsWith('eyJ') && value.length > 50 && !value.includes(' ')) {
      return '[REDACTED_JWT]';
    }
    return value;
  }

  if (typeof value === 'object') {
    if (seen.has(value as object)) {
      return '[CIRCULAR_REFERENCE]';
    }
    seen.add(value as object);

    if (value instanceof Error) {
      const err = value as Error & Record<string, unknown>;
      const sanitized: Record<string, unknown> = {
        name: err.name,
        message: err.message,
        stack: err.stack,
      };
      // Copy other properties
      for (const key of Object.getOwnPropertyNames(err)) {
        if (key !== 'name' && key !== 'message' && key !== 'stack') {
          if (isSensitiveKey(key)) {
            sanitized[key] = '[REDACTED]';
          } else {
            sanitized[key] = sanitizeValue(err[key], seen);
          }
        }
      }
      return sanitized;
    }

    if (Array.isArray(value)) {
      return value.map(item => sanitizeValue(item, seen));
    }

    const sanitized: Record<string, unknown> = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        if (isSensitiveKey(key)) {
          sanitized[key] = '[REDACTED]';
        } else {
          sanitized[key] = sanitizeValue((value as Record<string, unknown>)[key], seen);
        }
      }
    }
    return sanitized;
  }

  return value;
}

function isSensitiveKey(key: string): boolean {
  const lowerKey = key.toLowerCase();
  return (
    lowerKey.includes('key') ||
    lowerKey.includes('secret') ||
    lowerKey.includes('token') ||
    lowerKey.includes('password') ||
    lowerKey.includes('authorization') ||
    lowerKey.includes('cookie') ||
    lowerKey.includes('credentials')
  );
}

/**
 * Logs an error safely by redacting sensitive information.
 * @param context A string describing the context of the error.
 * @param error The error object.
 */
export function logError(context: string, error: unknown) {
  try {
    const sanitized = sanitizeValue(error);
    console.error(`${context}:`, JSON.stringify(sanitized, null, 2));
  } catch (e) {
    // Fallback in case of error during sanitization
    console.error(`${context}: [Error processing error log]`, e);
  }
}
