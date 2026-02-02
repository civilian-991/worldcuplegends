'use client'

import { useCallback, useEffect, useState } from 'react'

const CSRF_COOKIE_NAME = 'csrf-token'
const CSRF_HEADER_NAME = 'x-csrf-token'

/**
 * Hook to get the CSRF token from cookies and provide a fetch wrapper
 * that automatically includes the CSRF token in headers
 */
export function useCsrf() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null)

  // Read CSRF token from cookie on mount and when cookies change
  useEffect(() => {
    const getTokenFromCookie = () => {
      const cookies = document.cookie.split(';')
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=')
        if (name === CSRF_COOKIE_NAME) {
          return decodeURIComponent(value)
        }
      }
      return null
    }

    setCsrfToken(getTokenFromCookie())

    // Re-check periodically in case the token gets refreshed
    const interval = setInterval(() => {
      const token = getTokenFromCookie()
      if (token !== csrfToken) {
        setCsrfToken(token)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [csrfToken])

  /**
   * Fetch wrapper that automatically includes CSRF token in headers
   */
  const csrfFetch = useCallback(
    async (url: string, options: RequestInit = {}): Promise<Response> => {
      const method = (options.method || 'GET').toUpperCase()
      const stateMutatingMethods = ['POST', 'PUT', 'PATCH', 'DELETE']

      // Only add CSRF header for state-mutating requests
      if (stateMutatingMethods.includes(method) && csrfToken) {
        options.headers = {
          ...options.headers,
          [CSRF_HEADER_NAME]: csrfToken,
        }
      }

      return fetch(url, options)
    },
    [csrfToken]
  )

  /**
   * Get headers object with CSRF token included
   * Useful for integrating with existing fetch calls
   */
  const getCsrfHeaders = useCallback((): Record<string, string> => {
    if (!csrfToken) {
      return {}
    }
    return { [CSRF_HEADER_NAME]: csrfToken }
  }, [csrfToken])

  return {
    csrfToken,
    csrfFetch,
    getCsrfHeaders,
    CSRF_HEADER_NAME,
  }
}

export default useCsrf
