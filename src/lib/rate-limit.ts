/**
 * In-memory rate limiter for API endpoints
 *
 * This implementation uses a sliding window approach with an in-memory store.
 * For production at scale, consider using Redis or Upstash Rate Limit.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store for rate limit tracking
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup interval to prevent memory leaks (runs every 5 minutes)
let cleanupInterval: NodeJS.Timeout | null = null;

function startCleanup() {
  if (cleanupInterval) return;
  cleanupInterval = setInterval(() => {
    const now = Date.now();
    const keysToDelete: string[] = [];
    rateLimitStore.forEach((entry, key) => {
      if (entry.resetAt < now) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach((key) => rateLimitStore.delete(key));
  }, 5 * 60 * 1000); // 5 minutes
}

// Start cleanup on module load
if (typeof window === 'undefined') {
  startCleanup();
}

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  limit: number;
  /** Time window in seconds */
  windowSeconds: number;
  /** Unique prefix for this rate limiter (e.g., 'newsletter', 'contact') */
  prefix: string;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
}

/**
 * Create a rate limiter with the specified configuration
 */
export function createRateLimiter(config: RateLimitConfig) {
  const { limit, windowSeconds, prefix } = config;

  return {
    /**
     * Check rate limit for a given identifier (IP, user ID, etc.)
     * @param identifier - Unique identifier (e.g., IP address, user ID)
     * @returns Rate limit result with success status and metadata
     */
    check(identifier: string): RateLimitResult {
      const key = `${prefix}:${identifier}`;
      const now = Date.now();
      const windowMs = windowSeconds * 1000;

      const entry = rateLimitStore.get(key);

      // If no entry or window has expired, create new entry
      if (!entry || entry.resetAt < now) {
        const resetAt = now + windowMs;
        rateLimitStore.set(key, { count: 1, resetAt });
        return {
          success: true,
          limit,
          remaining: limit - 1,
          resetAt,
          retryAfterSeconds: 0,
        };
      }

      // Check if limit exceeded
      if (entry.count >= limit) {
        const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
        return {
          success: false,
          limit,
          remaining: 0,
          resetAt: entry.resetAt,
          retryAfterSeconds,
        };
      }

      // Increment count
      entry.count++;
      return {
        success: true,
        limit,
        remaining: limit - entry.count,
        resetAt: entry.resetAt,
        retryAfterSeconds: 0,
      };
    },

    /**
     * Reset rate limit for a given identifier (useful for testing)
     */
    reset(identifier: string): void {
      const key = `${prefix}:${identifier}`;
      rateLimitStore.delete(key);
    },
  };
}

/**
 * Get client IP address from request
 * Handles various proxy headers
 */
export function getClientIP(request: Request): string {
  // Check various headers that might contain the real IP
  const headers = request.headers;

  // Vercel/Cloudflare/etc. set these headers
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  const cfConnectingIP = headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  // Fallback
  return 'unknown';
}

/**
 * Create a 429 Too Many Requests response with appropriate headers
 */
export function rateLimitResponse(result: RateLimitResult): Response {
  return new Response(
    JSON.stringify({
      error: 'Too many requests. Please try again later.',
      retryAfter: result.retryAfterSeconds,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': result.retryAfterSeconds.toString(),
        'X-RateLimit-Limit': result.limit.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': Math.ceil(result.resetAt / 1000).toString(),
      },
    }
  );
}

// Pre-configured rate limiters for common use cases
export const rateLimiters = {
  // Newsletter: 3 requests per hour per IP (prevent spam subscriptions)
  newsletter: createRateLimiter({
    prefix: 'newsletter',
    limit: 3,
    windowSeconds: 60 * 60, // 1 hour
  }),

  // Contact: 5 requests per hour per IP (prevent contact form spam)
  contact: createRateLimiter({
    prefix: 'contact',
    limit: 5,
    windowSeconds: 60 * 60, // 1 hour
  }),

  // Comments: 10 requests per minute per user (prevent comment spam)
  comments: createRateLimiter({
    prefix: 'comments',
    limit: 10,
    windowSeconds: 60, // 1 minute
  }),

  // Predictions: 20 requests per minute per user (prevent vote manipulation)
  predictions: createRateLimiter({
    prefix: 'predictions',
    limit: 20,
    windowSeconds: 60, // 1 minute
  }),

  // Poll votes: 5 requests per minute per user
  pollVotes: createRateLimiter({
    prefix: 'poll-votes',
    limit: 5,
    windowSeconds: 60, // 1 minute
  }),
};
