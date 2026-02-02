/**
 * Order DTO - Data Transfer Object for order API responses
 * Prevents excessive data exposure by filtering sensitive fields
 */

export interface OrderItemDTO {
  id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  size: string | null
  color: string | null
}

export interface MaskedAddressDTO {
  city: string | null
  country: string | null
}

export interface OrderDTO {
  id: string
  user_id: string | null
  customer_email: string
  customer_name: string
  status: string
  payment_status: string
  total: number
  subtotal: number
  shipping_cost: number
  currency: string
  created_at: string
  updated_at: string
  // Masked payment info - only last 4 chars for reference
  payment_reference: string | null
  // Masked billing address - only city/country
  billing_address: MaskedAddressDTO | null
  // Masked shipping address - only city/country
  shipping_address: MaskedAddressDTO | null
  // Order items without sensitive data
  order_items: OrderItemDTO[]
}

export interface OrderListResponse {
  orders: OrderDTO[]
  total: number | null
  limit: number
  offset: number
}

interface DatabaseOrderItem {
  id: string
  product_id: string
  product_name?: string
  name?: string
  quantity: number
  unit_price?: number
  price?: number
  size?: string | null
  color?: string | null
  [key: string]: unknown
}

interface DatabaseAddress {
  line1?: string
  line2?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  [key: string]: unknown
}

interface DatabaseOrder {
  id: string
  user_id?: string | null
  customer_email?: string
  email?: string
  customer_name?: string
  name?: string
  status: string
  payment_status: string
  total: number
  subtotal?: number
  shipping_cost?: number
  currency?: string
  created_at: string
  updated_at?: string
  stripe_payment_intent_id?: string | null
  billing_address?: DatabaseAddress | string | null
  shipping_address?: DatabaseAddress | string | null
  order_items?: DatabaseOrderItem[]
  [key: string]: unknown
}

/**
 * Mask a Stripe payment intent ID - show only last 4 characters
 */
function maskPaymentId(paymentId: string | null | undefined): string | null {
  if (!paymentId) return null
  if (paymentId.length <= 4) return '****'
  return `****${paymentId.slice(-4)}`
}

/**
 * Mask an address - only show city and country
 */
function maskAddress(address: DatabaseAddress | string | null | undefined): MaskedAddressDTO | null {
  if (!address) return null

  // Handle JSON string
  if (typeof address === 'string') {
    try {
      const parsed = JSON.parse(address) as DatabaseAddress
      return {
        city: parsed.city || null,
        country: parsed.country || null,
      }
    } catch {
      return null
    }
  }

  return {
    city: address.city || null,
    country: address.country || null,
  }
}

/**
 * Transform a database order item to OrderItemDTO
 */
function toOrderItemDTO(item: DatabaseOrderItem): OrderItemDTO {
  return {
    id: item.id,
    product_id: item.product_id,
    product_name: item.product_name || item.name || '',
    quantity: item.quantity,
    unit_price: item.unit_price || item.price || 0,
    size: item.size || null,
    color: item.color || null,
  }
}

/**
 * Transform a database order record to a safe OrderDTO
 * Masks sensitive fields like payment IDs and full addresses
 */
export function toOrderDTO(order: DatabaseOrder): OrderDTO {
  return {
    id: order.id,
    user_id: order.user_id || null,
    customer_email: order.customer_email || order.email || '',
    customer_name: order.customer_name || order.name || '',
    status: order.status,
    payment_status: order.payment_status,
    total: order.total,
    subtotal: order.subtotal || order.total,
    shipping_cost: order.shipping_cost || 0,
    currency: order.currency || 'USD',
    created_at: order.created_at,
    updated_at: order.updated_at || order.created_at,
    payment_reference: maskPaymentId(order.stripe_payment_intent_id),
    billing_address: maskAddress(order.billing_address),
    shipping_address: maskAddress(order.shipping_address),
    order_items: (order.order_items || []).map(toOrderItemDTO),
  }
}

/**
 * Transform multiple order records to OrderDTOs
 */
export function toOrderDTOList(orders: DatabaseOrder[]): OrderDTO[] {
  return orders.map(toOrderDTO)
}

/**
 * Fields to select from the orders table for order list
 * Excludes full payment intent IDs - we'll mask them in the transformer
 */
export const ORDER_SELECT_FIELDS = `
  id,
  user_id,
  customer_email,
  customer_name,
  status,
  payment_status,
  total,
  subtotal,
  shipping_cost,
  currency,
  created_at,
  updated_at,
  stripe_payment_intent_id,
  billing_address,
  shipping_address
`

export const ORDER_ITEMS_SELECT_FIELDS = `
  id,
  product_id,
  product_name,
  quantity,
  unit_price,
  size,
  color
`
