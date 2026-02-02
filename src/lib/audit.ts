import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'
import { NextRequest } from 'next/server'

export type AuditAction = 'create' | 'update' | 'delete' | 'restore'
export type AuditEntityType = 'product' | 'order' | 'legend' | 'team' | 'news' | 'match'

interface AuditLogEntry {
  user_id: string
  action: AuditAction
  entity_type: AuditEntityType
  entity_id: string
  old_data?: Record<string, unknown> | null
  new_data?: Record<string, unknown> | null
  ip_address: string | null
  user_agent: string | null
}

/**
 * Extract client IP address from Next.js request
 * Checks various headers for proxied requests
 */
export function getClientIp(request: NextRequest): string | null {
  // Check x-forwarded-for header (common for proxied requests)
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one (client IP)
    const ips = forwardedFor.split(',').map(ip => ip.trim())
    return ips[0] || null
  }

  // Check x-real-ip header (used by some proxies)
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  // Check cf-connecting-ip (Cloudflare)
  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  if (cfConnectingIp) {
    return cfConnectingIp
  }

  // Check x-client-ip (Azure, AWS, etc.)
  const clientIp = request.headers.get('x-client-ip')
  if (clientIp) {
    return clientIp
  }

  return null
}

/**
 * Extract user agent from Next.js request
 */
export function getUserAgent(request: NextRequest): string | null {
  return request.headers.get('user-agent')
}

/**
 * Log an admin action to the audit_logs table
 *
 * @param supabase - Supabase client instance
 * @param userId - The ID of the admin user performing the action
 * @param action - The type of action: 'create', 'update', or 'delete'
 * @param entityType - The type of entity being modified
 * @param entityId - The ID of the entity being modified
 * @param oldData - The previous state of the entity (for updates and deletes)
 * @param newData - The new state of the entity (for creates and updates)
 * @param request - The Next.js request object (for IP and user agent)
 */
export async function logAdminAction(
  supabase: SupabaseClient<Database>,
  userId: string,
  action: AuditAction,
  entityType: AuditEntityType,
  entityId: string,
  oldData: Record<string, unknown> | null,
  newData: Record<string, unknown> | null,
  request: NextRequest
): Promise<void> {
  const ipAddress = getClientIp(request)
  const userAgent = getUserAgent(request)

  const auditEntry: AuditLogEntry = {
    user_id: userId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    old_data: oldData,
    new_data: newData,
    ip_address: ipAddress,
    user_agent: userAgent,
  }

  const { error } = await supabase
    .from('audit_logs')
    .insert(auditEntry as never)

  if (error) {
    // Log the error but don't throw - audit logging should not break the main operation
    console.error('Failed to create audit log entry:', error)
  }
}

/**
 * Helper to safely convert entity data to a plain object for logging
 * Removes any circular references or non-serializable data
 */
export function sanitizeForAudit(data: unknown): Record<string, unknown> | null {
  if (data === null || data === undefined) {
    return null
  }

  try {
    // Use JSON.parse(JSON.stringify()) to safely clone and remove non-serializable data
    return JSON.parse(JSON.stringify(data)) as Record<string, unknown>
  } catch {
    console.error('Failed to sanitize data for audit log')
    return null
  }
}
