/**
 * Product DTO - Data Transfer Object for product API responses
 * Uses explicit field selection instead of select('*')
 */

export interface ProductListDTO {
  id: string
  name: string
  slug: string
  price: number
  original_price: number | null
  category: string
  subcategory: string | null
  images: string[]
  in_stock: boolean
  stock_quantity: number
  featured: boolean
  created_at: string
  updated_at: string
}

export interface ProductListResponse {
  products: ProductListDTO[]
  total: number | null
  limit: number
  offset: number
}

interface DatabaseProduct {
  id: string
  name: string
  slug: string
  price: number
  original_price?: number | null
  description?: string
  category: string
  subcategory?: string | null
  images?: string[] | null
  sizes?: string[] | null
  colors?: string[] | null
  in_stock?: boolean
  stock_quantity?: number
  featured?: boolean
  tags?: string[] | null
  legend?: string | null
  team?: string | null
  created_at: string
  updated_at?: string
  [key: string]: unknown
}

/**
 * Transform a database product record to ProductListDTO
 * Only includes fields needed for list view
 */
export function toProductListDTO(product: DatabaseProduct): ProductListDTO {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    original_price: product.original_price || null,
    category: product.category,
    subcategory: product.subcategory || null,
    images: product.images || [],
    in_stock: product.in_stock ?? true,
    stock_quantity: product.stock_quantity || 0,
    featured: product.featured ?? false,
    created_at: product.created_at,
    updated_at: product.updated_at || product.created_at,
  }
}

/**
 * Transform multiple product records to ProductListDTOs
 */
export function toProductListDTOList(products: DatabaseProduct[]): ProductListDTO[] {
  return products.map(toProductListDTO)
}

/**
 * Fields to select from the products table for list view
 * Use this in Supabase select() instead of '*'
 */
export const PRODUCT_LIST_SELECT_FIELDS = `
  id,
  name,
  slug,
  price,
  original_price,
  category,
  subcategory,
  images,
  in_stock,
  stock_quantity,
  featured,
  created_at,
  updated_at
`
