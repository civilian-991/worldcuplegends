import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// Security headers configuration
const securityHeaders = [
  {
    // HSTS - Enforce HTTPS for 2 years, include subdomains, allow preload
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    // Prevent MIME type sniffing
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    // Prevent clickjacking by denying iframe embedding
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    // XSS protection (legacy but still useful for older browsers)
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    // Control referrer information sent with requests
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    // Content Security Policy
    // Note: 'unsafe-inline' and 'unsafe-eval' are required for Next.js to function
    // In production, consider using nonces for stricter inline script control
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Scripts: self + unsafe-inline/eval needed for Next.js, explicitly block data: and blob: URIs
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      // Styles: self + unsafe-inline needed for styled components and inline styles
      "style-src 'self' 'unsafe-inline'",
      // Images: allow self, data (for base64), blob (for canvas), and trusted CDNs
      "img-src 'self' data: blob: https://*.supabase.co https://flagcdn.com",
      // Fonts: self and data URIs for embedded fonts
      "font-src 'self' data:",
      // API connections: self and Supabase
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      // Prevent embedding in iframes (clickjacking protection)
      "frame-ancestors 'none'",
      // Restrict form submissions to same origin
      "form-action 'self'",
      // Restrict base URL manipulation
      "base-uri 'self'",
      // Block all plugins/objects (Flash, Java, etc.)
      "object-src 'none'",
      // Block all <frame>, <iframe>, <embed>, <object> sources
      "child-src 'self'",
      // Restrict where <a> and window.open can navigate
      "navigate-to 'self' https:",
      // Upgrade HTTP to HTTPS automatically
      "upgrade-insecure-requests"
    ].join('; ')
  },
  {
    // Permissions Policy - Restrict access to browser features
    key: 'Permissions-Policy',
    value: [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'interest-cohort=()'
    ].join(', ')
  }
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        pathname: '/**',
      },
    ],
  },
  // Apply security headers to all routes
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
