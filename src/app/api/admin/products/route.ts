import { NextRequest, NextResponse } from 'next/server'
import { checkAdmin, validateAdminCsrf } from '@/lib/admin'
import { createProductSchema, formatZodError } from '@/lib/validations'
import { rateLimiters, getClientIP, rateLimitResponse } from '@/lib/rate-limit'
import { logAdminAction, sanitizeForAudit } from '@/lib/audit'
import { handleDatabaseError, CommonErrors } from '@/lib/api-errors'
import {
  toProductListDTOList,
  PRODUCT_LIST_SELECT_FIELDS,
  ProductListResponse
} from '@/lib/dto/product.dto'

const sanitizeSearch = (search: string) => search.replace(/[%_\\'"(){}[\]]/g, '');

export async function GET(request: NextRequest) {
  // Apply rate limiting for admin read operations - 100 requests per minute
  const ip = getClientIP(request)
  const rateLimitResult = rateLimiters.adminRead.check(ip)

  if (!rateLimitResult.success) {
    return rateLimitResponse(rateLimitResult)
  }

  const { supabase, isAdmin } = await checkAdmin()

  if (!isAdmin) {
    return CommonErrors.unauthorized()
  }

  const searchParams = request.nextUrl.searchParams
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const limitParam = parseInt(searchParams.get('limit') || '50')
  const offsetParam = parseInt(searchParams.get('offset') || '0')
  const limit = isNaN(limitParam) || limitParam < 1 ? 50 : Math.min(limitParam, 100)
  const offset = isNaN(offsetParam) || offsetParam < 0 ? 0 : offsetParam

  // Use explicit field selection instead of '*' to only return needed fields for list view
  // Filter out soft-deleted products
  let query = supabase
    .from('products')
    .select(PRODUCT_LIST_SELECT_FIELDS, { count: 'exact' })
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  if (search) {
    const sanitized = sanitizeSearch(search)
    query = query.or(`name.ilike.%${sanitized}%,description.ilike.%${sanitized}%`)
  }

  query = query.range(offset, offset + limit - 1)

  const { data: products, error, count } = await query

  if (error) {
    return handleDatabaseError(error, 'products')
  }

  // Transform to safe DTOs - only includes fields needed for list view
  const safeProducts = toProductListDTOList(products || [])

  const response: ProductListResponse = {
    products: safeProducts,
    total: count,
    limit,
    offset,
  }

  return NextResponse.json(response)
}

export async function POST(request: NextRequest) {
  // Validate CSRF token for state-changing operations
  const csrfError = validateAdminCsrf(request)
  if (csrfError) {
    return csrfError
  }

  // Apply rate limiting for admin write operations - 30 requests per minute
  const ip = getClientIP(request)
  const rateLimitResult = rateLimiters.adminWrite.check(ip)

  if (!rateLimitResult.success) {
    return rateLimitResponse(rateLimitResult)
  }

  const { supabase, isAdmin, user } = await checkAdmin()

  if (!isAdmin || !user) {
    return CommonErrors.unauthorized()
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return CommonErrors.invalidJson()
  }

  // Validate request body with Zod
  const validationResult = createProductSchema.safeParse(body)
  if (!validationResult.success) {
    return NextResponse.json(formatZodError(validationResult.error), { status: 400 })
  }

  const validatedData = validationResult.data

  // Generate slug from name if not provided
  const slug = validatedData.slug || validatedData.name.toLowerCase().replace(/\s+/g, '-')

  const { data: product, error } = await supabase
    .from('products')
    .insert({
      name: validatedData.name,
      slug: slug,
      price: validatedData.price,
      original_price: validatedData.originalPrice,
      description: validatedData.description,
      category: validatedData.category,
      subcategory: validatedData.subcategory,
      images: validatedData.images,
      sizes: validatedData.sizes,
      colors: validatedData.colors,
      in_stock: validatedData.inStock,
      stock_quantity: validatedData.stockQuantity,
      featured: validatedData.featured,
      tags: validatedData.tags,
      legend: validatedData.legend,
      team: validatedData.team,
    } as never)
    .select()
    .single()

  if (error) {
    return handleDatabaseError(error, 'product')
  }

  // Log the create action to audit logs
  const productData = product as { id: number | string } | null
  if (productData) {
    await logAdminAction(
      supabase,
      user.id,
      'create',
      'product',
      String(productData.id),
      null,
      sanitizeForAudit(product),
      request
    )
  }

  return NextResponse.json({ product })
}
