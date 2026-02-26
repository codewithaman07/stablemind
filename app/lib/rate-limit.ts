interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * Basic in-memory rate limiter using a fixed window counter.
 * Note: This is not distributed and will reset if the server restarts.
 *
 * @param identifier Unique identifier for the client (e.g., user ID or IP)
 * @param limit Max requests allowed within the window
 * @param windowMs Time window in milliseconds
 * @returns { success: boolean, remaining: number, reset: number }
 */
export function rateLimit(identifier: string, limit: number = 10, windowMs: number = 60 * 1000) {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  // If no record or window expired, reset
  if (!record || now > record.resetTime) {
    const newRecord = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(identifier, newRecord);
    return {
      success: true,
      remaining: limit - 1,
      reset: newRecord.resetTime
    };
  }

  // Check if limit exceeded
  if (record.count >= limit) {
    return {
      success: false,
      remaining: 0,
      reset: record.resetTime
    };
  }

  // Increment count
  record.count += 1;
  return {
    success: true,
    remaining: limit - record.count,
    reset: record.resetTime
  };
}

// Optional: Cleanup mechanism to prevent memory leaks
// In a real serverless environment, this might not run reliably, but helps if the instance stays warm.
if (typeof setInterval !== 'undefined') {
    // Run cleanup every 10 minutes
    const CLEANUP_INTERVAL = 10 * 60 * 1000;

    // Use a weak reference or check if interval is already set to avoid duplicates in hot reloads if not careful
    // But for simple module scope, this runs once per module load.

    // We attach it to global to avoid re-creating on module reload in dev
    const globalAny = global as any;
    if (!globalAny._rateLimitCleanupInterval) {
        const interval = setInterval(() => {
            const now = Date.now();
            for (const [key, record] of rateLimitStore.entries()) {
                if (now > record.resetTime) {
                    rateLimitStore.delete(key);
                }
            }
        }, CLEANUP_INTERVAL);

        if (interval.unref) {
            interval.unref();
        }

        globalAny._rateLimitCleanupInterval = interval;
    }
}
