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

// ==========================================
// Account Lockout System
// ==========================================

interface AccountLockoutEntry {
  failedAttempts: number;
  lockedUntil: number | null;
  lastAttempt: number;
}

// Separate store for account lockout tracking (email-based)
const accountLockoutStore = new Map<string, AccountLockoutEntry>();

// Account lockout configuration
const LOCKOUT_CONFIG = {
  maxAttempts: 5,
  lockoutDurationMs: 15 * 60 * 1000, // 15 minutes
  attemptWindowMs: 30 * 60 * 1000, // 30 minutes - reset counter if no attempts in this window
};

export interface AccountLockoutResult {
  isLocked: boolean;
  remainingAttempts: number;
  lockoutRemainingSeconds: number;
  message: string;
}

/**
 * Check if an account is locked and track failed login attempts
 * Uses email as identifier for per-account lockout
 */
export function checkAccountLockout(email: string): AccountLockoutResult {
  const key = `lockout:${email.toLowerCase()}`;
  const now = Date.now();

  let entry = accountLockoutStore.get(key);

  // If no entry exists, create one
  if (!entry) {
    entry = {
      failedAttempts: 0,
      lockedUntil: null,
      lastAttempt: now,
    };
    accountLockoutStore.set(key, entry);
  }

  // Check if account is currently locked
  if (entry.lockedUntil && entry.lockedUntil > now) {
    const lockoutRemainingSeconds = Math.ceil((entry.lockedUntil - now) / 1000);
    return {
      isLocked: true,
      remainingAttempts: 0,
      lockoutRemainingSeconds,
      message: `Account temporarily locked. Please try again in ${Math.ceil(lockoutRemainingSeconds / 60)} minutes.`,
    };
  }

  // If lockout has expired, reset the entry
  if (entry.lockedUntil && entry.lockedUntil <= now) {
    entry.failedAttempts = 0;
    entry.lockedUntil = null;
  }

  // If last attempt was outside the window, reset the counter
  if (now - entry.lastAttempt > LOCKOUT_CONFIG.attemptWindowMs) {
    entry.failedAttempts = 0;
  }

  return {
    isLocked: false,
    remainingAttempts: LOCKOUT_CONFIG.maxAttempts - entry.failedAttempts,
    lockoutRemainingSeconds: 0,
    message: '',
  };
}

/**
 * Record a failed login attempt and potentially lock the account
 */
export function recordFailedLoginAttempt(email: string): AccountLockoutResult {
  const key = `lockout:${email.toLowerCase()}`;
  const now = Date.now();

  let entry = accountLockoutStore.get(key);

  if (!entry) {
    entry = {
      failedAttempts: 0,
      lockedUntil: null,
      lastAttempt: now,
    };
  }

  // Increment failed attempts
  entry.failedAttempts++;
  entry.lastAttempt = now;

  // Check if we should lock the account
  if (entry.failedAttempts >= LOCKOUT_CONFIG.maxAttempts) {
    entry.lockedUntil = now + LOCKOUT_CONFIG.lockoutDurationMs;
    accountLockoutStore.set(key, entry);

    const lockoutRemainingSeconds = Math.ceil(LOCKOUT_CONFIG.lockoutDurationMs / 1000);
    return {
      isLocked: true,
      remainingAttempts: 0,
      lockoutRemainingSeconds,
      message: `Too many failed attempts. Account locked for ${Math.ceil(lockoutRemainingSeconds / 60)} minutes.`,
    };
  }

  accountLockoutStore.set(key, entry);

  const remainingAttempts = LOCKOUT_CONFIG.maxAttempts - entry.failedAttempts;
  return {
    isLocked: false,
    remainingAttempts,
    lockoutRemainingSeconds: 0,
    message: remainingAttempts <= 2
      ? `Warning: ${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining before account lockout.`
      : '',
  };
}

/**
 * Clear failed login attempts after successful login
 */
export function clearFailedLoginAttempts(email: string): void {
  const key = `lockout:${email.toLowerCase()}`;
  accountLockoutStore.delete(key);
}

/**
 * Generic error message for login failures (security best practice)
 * Always returns the same message regardless of whether email exists or password is wrong
 */
export const GENERIC_LOGIN_ERROR = 'Invalid email or password';

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

  // Login: 5 attempts per 15 minutes per IP (prevent brute force attacks)
  login: createRateLimiter({
    prefix: 'login',
    limit: 5,
    windowSeconds: 15 * 60, // 15 minutes
  }),

  // Admin read operations: 100 requests per minute (GET requests)
  adminRead: createRateLimiter({
    prefix: 'admin-read',
    limit: 100,
    windowSeconds: 60, // 1 minute
  }),

  // Admin write operations: 30 requests per minute (POST, PATCH, PUT requests)
  adminWrite: createRateLimiter({
    prefix: 'admin-write',
    limit: 30,
    windowSeconds: 60, // 1 minute
  }),

  // Admin delete operations: 10 requests per minute (DELETE requests)
  adminDelete: createRateLimiter({
    prefix: 'admin-delete',
    limit: 10,
    windowSeconds: 60, // 1 minute
  }),
};
