/**
 * Centralized API error handling utilities
 *
 * This module provides helpers for consistent error responses across all API routes.
 * It sanitizes error messages to prevent leaking database/internal details to clients.
 */

import { NextResponse } from 'next/server'

/**
 * Standard error response format for all API endpoints
 */
export interface ApiErrorResponse {
  error: string
  code?: string
  field?: string
}

/**
 * Known database error codes and their user-friendly messages
 */
const DB_ERROR_MESSAGES: Record<string, string> = {
  '23505': 'A record with this value already exists',
  '23503': 'Cannot complete operation due to related records',
  '23502': 'Required field is missing',
  '23514': 'Value does not meet requirements',
  '22P02': 'Invalid input format',
  '42501': 'Operation not permitted',
  'PGRST116': 'Record not found',
}

/**
 * Patterns in error messages that indicate sensitive information
 */
const SENSITIVE_PATTERNS = [
  /column\s+"?\w+"?/i,
  /table\s+"?\w+"?/i,
  /relation\s+"?\w+"?/i,
  /constraint\s+"?\w+"?/i,
  /violates\s+\w+/i,
  /duplicate\s+key/i,
  /foreign\s+key/i,
  /null\s+value/i,
  /syntax\s+error/i,
  /permission\s+denied/i,
  /authentication/i,
  /connection\s+refused/i,
  /timeout/i,
  /deadlock/i,
  /lock/i,
  /invalid\s+input\s+syntax/i,
  /operator\s+does\s+not\s+exist/i,
]

/**
 * Check if an error message contains sensitive database information
 */
function containsSensitiveInfo(message: string): boolean {
  return SENSITIVE_PATTERNS.some(pattern => pattern.test(message))
}

/**
 * Sanitize an error message to remove sensitive database details
 *
 * @param error - The original error (can be string, Error, or Supabase error object)
 * @returns Sanitized error message safe for client display
 */
export function sanitizeErrorMessage(error: unknown): string {
  // Handle null/undefined
  if (!error) {
    return 'An unexpected error occurred'
  }

  // Extract message from various error types
  let message: string
  let code: string | undefined

  if (typeof error === 'string') {
    message = error
  } else if (error && typeof error === 'object') {
    const errorObj = error as { message?: string; code?: string; details?: string }
    message = errorObj.message || ''
    code = errorObj.code
  } else {
    return 'An unexpected error occurred'
  }

  // Check for known database error codes
  if (code && DB_ERROR_MESSAGES[code]) {
    return DB_ERROR_MESSAGES[code]
  }

  // Check for sensitive information in the message
  if (containsSensitiveInfo(message)) {
    // Log the full error server-side for debugging
    console.error('[API Error - Sanitized]:', message)
    return 'An error occurred while processing your request'
  }

  // Return generic message if it's too technical
  if (message.length > 200 || message.includes('\n') || message.includes('at ')) {
    console.error('[API Error - Truncated]:', message)
    return 'An error occurred while processing your request'
  }

  return message
}

/**
 * Generic error codes for common scenarios
 */
export const ErrorCode = {
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
  RATE_LIMITED: 'RATE_LIMITED',
} as const

export type ErrorCodeType = typeof ErrorCode[keyof typeof ErrorCode]

/**
 * Create a standardized error response
 *
 * @param message - User-friendly error message
 * @param status - HTTP status code
 * @param options - Additional error details (code, field)
 * @returns NextResponse with standardized error format
 */
export function createErrorResponse(
  message: string,
  status: number,
  options?: { code?: ErrorCodeType; field?: string }
): NextResponse<ApiErrorResponse> {
  const response: ApiErrorResponse = {
    error: message,
  }

  if (options?.code) {
    response.code = options.code
  }

  if (options?.field) {
    response.field = options.field
  }

  return NextResponse.json(response, { status })
}

/**
 * Handle database errors and return appropriate response
 *
 * @param error - Error from database operation
 * @param resourceName - Name of the resource for better error messages (e.g., "product", "order")
 * @returns NextResponse with sanitized error message
 */
export function handleDatabaseError(
  error: unknown,
  resourceName: string = 'resource'
): NextResponse<ApiErrorResponse> {
  // Log full error for server-side debugging
  console.error(`[Database Error - ${resourceName}]:`, error)

  const errorObj = error as { code?: string; message?: string } | null

  // Handle specific known error codes
  if (errorObj?.code) {
    switch (errorObj.code) {
      case '23505': // Unique violation
        return createErrorResponse(
          `A ${resourceName} with this value already exists`,
          409,
          { code: ErrorCode.CONFLICT }
        )
      case '23503': // Foreign key violation
        return createErrorResponse(
          `Cannot delete ${resourceName} because it is referenced by other records`,
          409,
          { code: ErrorCode.CONFLICT }
        )
      case '23502': // Not null violation
        return createErrorResponse(
          `Required field is missing for ${resourceName}`,
          400,
          { code: ErrorCode.VALIDATION_ERROR }
        )
      case 'PGRST116': // Row not found
        return createErrorResponse(
          `${resourceName.charAt(0).toUpperCase() + resourceName.slice(1)} not found`,
          404,
          { code: ErrorCode.NOT_FOUND }
        )
    }
  }

  // Default generic error
  return createErrorResponse(
    `Failed to process ${resourceName}. Please try again.`,
    500,
    { code: ErrorCode.INTERNAL_ERROR }
  )
}

/**
 * Common error responses for reuse
 */
export const CommonErrors = {
  unauthorized: () => createErrorResponse(
    'Unauthorized',
    401,
    { code: ErrorCode.UNAUTHORIZED }
  ),

  forbidden: () => createErrorResponse(
    'Access denied',
    403,
    { code: ErrorCode.FORBIDDEN }
  ),

  notFound: (resource: string = 'Resource') => createErrorResponse(
    `${resource} not found`,
    404,
    { code: ErrorCode.NOT_FOUND }
  ),

  badRequest: (message: string = 'Invalid request') => createErrorResponse(
    message,
    400,
    { code: ErrorCode.BAD_REQUEST }
  ),

  invalidJson: () => createErrorResponse(
    'Invalid JSON in request body',
    400,
    { code: ErrorCode.BAD_REQUEST }
  ),

  internalError: () => createErrorResponse(
    'An internal error occurred. Please try again later.',
    500,
    { code: ErrorCode.INTERNAL_ERROR }
  ),

  rateLimited: () => createErrorResponse(
    'Too many requests. Please try again later.',
    429,
    { code: ErrorCode.RATE_LIMITED }
  ),
}
