/**
 * Sanitization utilities for XSS prevention
 *
 * This module provides functions to sanitize user-generated content
 * to prevent XSS (Cross-Site Scripting) attacks.
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Configuration for DOMPurify
 * - ALLOWED_TAGS: Only allow safe formatting tags
 * - ALLOWED_ATTR: Only allow safe attributes
 */
const DOMPURIFY_CONFIG = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'u', 's', 'br', 'p', 'span'],
  ALLOWED_ATTR: [],
  ALLOW_DATA_ATTR: false,
  KEEP_CONTENT: true,
};

/**
 * Rich content configuration - allows more HTML tags for admin content
 */
const RICH_CONTENT_CONFIG = {
  ALLOWED_TAGS: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr',
    'ul', 'ol', 'li',
    'b', 'i', 'em', 'strong', 'u', 's', 'strike',
    'blockquote', 'pre', 'code',
    'a', 'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'span', 'div',
  ],
  ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel'],
  ALLOW_DATA_ATTR: false,
  ADD_ATTR: ['target'],
};

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Removes potentially dangerous HTML tags and attributes
 *
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }
  return DOMPurify.sanitize(html, DOMPURIFY_CONFIG);
}

/**
 * Sanitizes rich HTML content (for admin-created content like news articles)
 * Allows more HTML tags but still removes dangerous elements
 *
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeRichHtml(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  // Sanitize with rich content config
  let sanitized = DOMPurify.sanitize(html, RICH_CONTENT_CONFIG);

  // Ensure all links open in new tab with security attributes
  sanitized = sanitized.replace(
    /<a\s+([^>]*?)>/gi,
    (match, attrs) => {
      if (!attrs.includes('rel=')) {
        return `<a ${attrs} rel="noopener noreferrer">`;
      }
      return match;
    }
  );

  return sanitized;
}

/**
 * HTML entity map for escaping
 */
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

/**
 * Escapes HTML entities to prevent XSS
 * Use this for plain text that should not contain any HTML
 *
 * @param text - The text to escape
 * @returns Text with HTML entities escaped
 */
export function escapeHtml(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }
  return text.replace(/[&<>"'`=/]/g, (char) => HTML_ENTITIES[char] || char);
}

/**
 * List of dangerous URL protocols that should be blocked
 */
const DANGEROUS_PROTOCOLS = [
  'javascript:',
  'data:',
  'vbscript:',
  'file:',
  'about:',
];

/**
 * Validates and sanitizes a URL
 * Only allows http:// and https:// protocols
 * Rejects javascript:, data:, and other dangerous protocols
 *
 * @param url - The URL to validate
 * @returns The sanitized URL or empty string if invalid
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  // Trim and normalize
  const trimmedUrl = url.trim();

  // Check for empty string
  if (!trimmedUrl) {
    return '';
  }

  // Convert to lowercase for protocol checking
  const lowerUrl = trimmedUrl.toLowerCase();

  // Block dangerous protocols
  for (const protocol of DANGEROUS_PROTOCOLS) {
    if (lowerUrl.startsWith(protocol)) {
      console.warn(`Blocked dangerous URL protocol: ${protocol}`);
      return '';
    }
  }

  // Check for encoded dangerous protocols (e.g., &#106;avascript:)
  const decodedUrl = decodeURIComponent(lowerUrl.replace(/&#(\d+);/g, (_, code) =>
    String.fromCharCode(parseInt(code, 10))
  ).replace(/&#x([0-9a-f]+);/gi, (_, code) =>
    String.fromCharCode(parseInt(code, 16))
  ));

  for (const protocol of DANGEROUS_PROTOCOLS) {
    if (decodedUrl.startsWith(protocol)) {
      console.warn(`Blocked encoded dangerous URL protocol: ${protocol}`);
      return '';
    }
  }

  // Only allow http:// and https:// URLs
  if (!lowerUrl.startsWith('http://') && !lowerUrl.startsWith('https://')) {
    // Allow relative URLs starting with /
    if (trimmedUrl.startsWith('/')) {
      return trimmedUrl;
    }
    // Reject other URLs
    console.warn(`Blocked URL with unsupported protocol: ${trimmedUrl}`);
    return '';
  }

  // Validate URL structure
  try {
    new URL(trimmedUrl);
    return trimmedUrl;
  } catch {
    console.warn(`Invalid URL structure: ${trimmedUrl}`);
    return '';
  }
}

/**
 * Validates if a URL is safe (http:// or https:// only)
 *
 * @param url - The URL to validate
 * @returns true if the URL is safe, false otherwise
 */
export function isValidUrl(url: string): boolean {
  return sanitizeUrl(url) !== '';
}

/**
 * Validates and sanitizes an image URL
 * Same as sanitizeUrl but provides clearer intent
 *
 * @param url - The image URL to validate
 * @returns The sanitized URL or empty string if invalid
 */
export function sanitizeImageUrl(url: string): string {
  return sanitizeUrl(url);
}

/**
 * Sanitizes plain text input (removes HTML but preserves text content)
 * Use this for text fields like names, titles, etc.
 *
 * @param text - The text to sanitize
 * @returns Sanitized plain text
 */
export function sanitizeText(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // Strip all HTML tags
  const stripped = DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });

  // Trim whitespace
  return stripped.trim();
}

/**
 * Sanitizes a slug (URL-friendly identifier)
 * Only allows lowercase letters, numbers, and hyphens
 *
 * @param slug - The slug to sanitize
 * @returns Sanitized slug
 */
export function sanitizeSlug(slug: string): string {
  if (!slug || typeof slug !== 'string') {
    return '';
  }

  return slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Comprehensive content sanitizer for user-generated content
 * Sanitizes an object with common content fields
 *
 * @param content - Object containing content fields to sanitize
 * @returns Object with sanitized content
 */
export function sanitizeContent<T extends Record<string, unknown>>(content: T): T {
  const sanitized = { ...content };

  // Define fields and their sanitization functions
  const textFields = ['name', 'title', 'author', 'firstName', 'lastName', 'short_name'];
  const htmlFields = ['content', 'description', 'bio', 'excerpt'];
  const urlFields = ['image', 'imageUrl', 'avatar', 'flag', 'url'];
  const slugFields = ['slug'];

  for (const key of Object.keys(sanitized)) {
    const value = sanitized[key];

    if (typeof value !== 'string') {
      continue;
    }

    if (textFields.includes(key)) {
      (sanitized as Record<string, unknown>)[key] = sanitizeText(value);
    } else if (htmlFields.includes(key)) {
      (sanitized as Record<string, unknown>)[key] = sanitizeHtml(value);
    } else if (urlFields.includes(key)) {
      (sanitized as Record<string, unknown>)[key] = sanitizeUrl(value);
    } else if (slugFields.includes(key)) {
      (sanitized as Record<string, unknown>)[key] = sanitizeSlug(value);
    }
  }

  return sanitized;
}
