/**
 * CSRF Protection Utility
 *
 * Provides CSRF token generation and validation for state-changing operations.
 * Uses the double-submit cookie pattern combined with header validation.
 */

import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

// Constants
export const CSRF_COOKIE_NAME = 'csrf-token'
export const CSRF_HEADER_NAME = 'x-csrf-token'
const CSRF_TOKEN_LENGTH = 32

/**
 * Generates a cryptographically secure CSRF token
 */
export function generateCsrfToken(): string {
  // Use crypto.randomUUID() for a secure random token
  // Combine two UUIDs and hash to get desired length
  const uuid1 = crypto.randomUUID().replace(/-/g, '')
  const uuid2 = crypto.randomUUID().replace(/-/g, '')
  return (uuid1 + uuid2).substring(0, CSRF_TOKEN_LENGTH * 2)
}

/**
 * Gets the CSRF token from cookies (server-side)
 */
export async function getCsrfTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(CSRF_COOKIE_NAME)?.value || null
}

/**
 * Gets the CSRF token from request header
 */
export function getCsrfTokenFromHeader(request: NextRequest): string | null {
  return request.headers.get(CSRF_HEADER_NAME)
}

/**
 * Gets the CSRF token from request cookie
 */
export function getCsrfTokenFromRequestCookie(request: NextRequest): string | null {
  return request.cookies.get(CSRF_COOKIE_NAME)?.value || null
}

/**
 * Validates CSRF token by comparing header token with cookie token
 * Uses constant-time comparison to prevent timing attacks
 */
export function validateCsrfToken(request: NextRequest): { valid: boolean; error?: string } {
  const headerToken = getCsrfTokenFromHeader(request)
  const cookieToken = getCsrfTokenFromRequestCookie(request)

  if (!headerToken) {
    return { valid: false, error: 'Missing CSRF token in header' }
  }

  if (!cookieToken) {
    return { valid: false, error: 'Missing CSRF token in cookie' }
  }

  // Constant-time comparison to prevent timing attacks
  if (headerToken.length !== cookieToken.length) {
    return { valid: false, error: 'Invalid CSRF token' }
  }

  let result = 0
  for (let i = 0; i < headerToken.length; i++) {
    result |= headerToken.charCodeAt(i) ^ cookieToken.charCodeAt(i)
  }

  if (result !== 0) {
    return { valid: false, error: 'Invalid CSRF token' }
  }

  return { valid: true }
}

/**
 * Middleware helper to check if request requires CSRF validation
 */
export function requiresCsrfValidation(request: NextRequest): boolean {
  const method = request.method.toUpperCase()
  const stateMutatingMethods = ['POST', 'PUT', 'PATCH', 'DELETE']

  // Check if it's a state-changing method
  if (!stateMutatingMethods.includes(method)) {
    return false
  }

  // Check if it's an admin API route
  const pathname = request.nextUrl.pathname
  if (pathname.startsWith('/api/admin/')) {
    return true
  }

  return false
}

/**
 * Server action helper to validate CSRF from form data
 * For use in React Server Actions if needed
 */
export async function validateCsrfFromFormData(formData: FormData): Promise<{ valid: boolean; error?: string }> {
  const tokenFromForm = formData.get('csrf_token') as string | null
  const tokenFromCookie = await getCsrfTokenFromCookies()

  if (!tokenFromForm) {
    return { valid: false, error: 'Missing CSRF token in form' }
  }

  if (!tokenFromCookie) {
    return { valid: false, error: 'Missing CSRF token in cookie' }
  }

  // Constant-time comparison
  if (tokenFromForm.length !== tokenFromCookie.length) {
    return { valid: false, error: 'Invalid CSRF token' }
  }

  let result = 0
  for (let i = 0; i < tokenFromForm.length; i++) {
    result |= tokenFromForm.charCodeAt(i) ^ tokenFromCookie.charCodeAt(i)
  }

  if (result !== 0) {
    return { valid: false, error: 'Invalid CSRF token' }
  }

  return { valid: true }
}
