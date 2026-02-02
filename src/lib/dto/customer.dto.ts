/**
 * Customer DTO - Data Transfer Object for customer API responses
 * Prevents excessive data exposure by only including necessary fields
 */

export interface CustomerDTO {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  created_at: string
  // Order statistics
  totalOrders: number
  totalSpent: number
  lastOrderAt: string | null
}

export interface CustomerListResponse {
  customers: CustomerDTO[]
  total: number | null
  limit: number
  offset: number
}

interface ProfileRow {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone?: string | null
  avatar_url?: string | null
  role?: string
  created_at: string
  updated_at?: string
}

interface OrderStats {
  totalOrders: number
  totalSpent: number
  lastOrderAt: string | null
}

/**
 * Transform a database profile record to a safe CustomerDTO
 * Only includes necessary fields, excludes phone numbers, avatar URLs, etc.
 */
export function toCustomerDTO(
  profile: ProfileRow,
  orderStats: OrderStats
): CustomerDTO {
  return {
    id: profile.id,
    email: profile.email,
    first_name: profile.first_name,
    last_name: profile.last_name,
    created_at: profile.created_at,
    totalOrders: orderStats.totalOrders,
    totalSpent: orderStats.totalSpent,
    lastOrderAt: orderStats.lastOrderAt,
  }
}

/**
 * Transform multiple profile records to CustomerDTOs
 */
export function toCustomerDTOList(
  profiles: ProfileRow[],
  orderStatsByUserId: Map<string, { total: number; created_at: string }[]>
): CustomerDTO[] {
  return profiles.map((profile) => {
    const ordersList = orderStatsByUserId.get(profile.id) || []
    const totalOrders = ordersList.length
    const totalSpent = ordersList.reduce((sum, order) => sum + Number(order.total), 0)
    const lastOrderAt = ordersList.length > 0 ? ordersList[ordersList.length - 1].created_at : null

    return toCustomerDTO(profile, { totalOrders, totalSpent, lastOrderAt })
  })
}

/**
 * Fields to select from the profiles table for customer list
 * Use this in Supabase select() instead of '*'
 */
export const CUSTOMER_SELECT_FIELDS = 'id, email, first_name, last_name, created_at'
