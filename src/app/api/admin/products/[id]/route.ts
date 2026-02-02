import { NextRequest, NextResponse } from 'next/server'
import { checkAdmin, validateAdminCsrf } from '@/lib/admin'
import { updateProductSchema, formatZodError } from '@/lib/validations'
import { rateLimiters, getClientIP, rateLimitResponse } from '@/lib/rate-limit'
import { logAdminAction, sanitizeForAudit } from '@/lib/audit'
import { handleDatabaseError, CommonErrors } from '@/lib/api-errors'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Apply rate limiting for admin read operations - 100 requests per minute
  const ip = getClientIP(request)
  const rateLimitResult = rateLimiters.adminRead.check(ip)

  if (!rateLimitResult.success) {
    return rateLimitResponse(rateLimitResult)
  }

  const { supabase, isAdmin } = await checkAdmin()
  const { id } = await params

  if (!isAdmin) {
    return CommonErrors.unauthorized()
  }

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', parseInt(id))
    .is('deleted_at', null)
    .single()

  if (error || !product) {
    return CommonErrors.notFound('Product')
  }

  return NextResponse.json({ product })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
  const { id } = await params

  if (!isAdmin || !user) {
    return CommonErrors.unauthorized()
  }

  // Fetch the existing product for audit logging
  const { data: existingProduct } = await supabase
    .from('products')
    .select('*')
    .eq('id', parseInt(id))
    .single()

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return CommonErrors.invalidJson()
  }

  // Validate request body with Zod
  const validationResult = updateProductSchema.safeParse(body)
  if (!validationResult.success) {
    return NextResponse.json(formatZodError(validationResult.error), { status: 400 })
  }

  const validatedData = validationResult.data

  // Only include fields that were actually provided
  const updateData: Record<string, unknown> = {}
  if (validatedData.name !== undefined) updateData.name = validatedData.name
  if (validatedData.slug !== undefined) updateData.slug = validatedData.slug
  if (validatedData.price !== undefined) updateData.price = validatedData.price
  if (validatedData.originalPrice !== undefined) updateData.original_price = validatedData.originalPrice
  if (validatedData.description !== undefined) updateData.description = validatedData.description
  if (validatedData.category !== undefined) updateData.category = validatedData.category
  if (validatedData.subcategory !== undefined) updateData.subcategory = validatedData.subcategory
  if (validatedData.images !== undefined) updateData.images = validatedData.images
  if (validatedData.sizes !== undefined) updateData.sizes = validatedData.sizes
  if (validatedData.colors !== undefined) updateData.colors = validatedData.colors
  if (validatedData.inStock !== undefined) updateData.in_stock = validatedData.inStock
  if (validatedData.stockQuantity !== undefined) updateData.stock_quantity = validatedData.stockQuantity
  if (validatedData.featured !== undefined) updateData.featured = validatedData.featured
  if (validatedData.tags !== undefined) updateData.tags = validatedData.tags
  if (validatedData.legend !== undefined) updateData.legend = validatedData.legend
  if (validatedData.team !== undefined) updateData.team = validatedData.team

  // Check if there's anything to update
  if (Object.keys(updateData).length === 0) {
    return CommonErrors.badRequest('No valid fields provided for update')
  }

  const { data: product, error } = await supabase
    .from('products')
    .update(updateData as never)
    .eq('id', parseInt(id))
    .select()
    .single()

  if (error) {
    return handleDatabaseError(error, 'product')
  }

  // Log the update action to audit logs
  await logAdminAction(
    supabase,
    user.id,
    'update',
    'product',
    id,
    sanitizeForAudit(existingProduct),
    sanitizeForAudit(product),
    request
  )

  return NextResponse.json({ product })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Validate CSRF token for state-changing operations
  const csrfError = validateAdminCsrf(request)
  if (csrfError) {
    return csrfError
  }

  // Apply rate limiting for admin delete operations - 10 requests per minute
  const ip = getClientIP(request)
  const rateLimitResult = rateLimiters.adminDelete.check(ip)

  if (!rateLimitResult.success) {
    return rateLimitResponse(rateLimitResult)
  }

  const { supabase, isAdmin, user } = await checkAdmin()
  const { id } = await params

  if (!isAdmin || !user) {
    return CommonErrors.unauthorized()
  }

  // Fetch the existing product for audit logging before deletion
  const { data: existingProduct } = await supabase
    .from('products')
    .select('*')
    .eq('id', parseInt(id))
    .single()

  // Soft delete by setting deleted_at timestamp
  const { error } = await supabase
    .from('products')
    .update({ deleted_at: new Date().toISOString() } as never)
    .eq('id', parseInt(id))

  if (error) {
    return handleDatabaseError(error, 'product')
  }

  // Log the delete action to audit logs
  await logAdminAction(
    supabase,
    user.id,
    'delete',
    'product',
    id,
    sanitizeForAudit(existingProduct),
    null,
    request
  )

  return NextResponse.json({ message: 'Product deleted' })
}

// POST to restore a soft-deleted product
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
  const { id } = await params

  if (!isAdmin || !user) {
    return CommonErrors.unauthorized()
  }

  let body
  try {
    body = await request.json()
  } catch {
    return CommonErrors.invalidJson()
  }

  if (body.action === 'restore') {
    // Fetch the existing (deleted) product for audit logging
    const { data: existingProduct } = await supabase
      .from('products')
      .select('*')
      .eq('id', parseInt(id))
      .single()

    const { data: restoredProduct, error } = await supabase
      .from('products')
      .update({ deleted_at: null } as never)
      .eq('id', parseInt(id))
      .select()
      .single()

    if (error) {
      return handleDatabaseError(error, 'product')
    }

    // Log the restore action to audit logs
    await logAdminAction(
      supabase,
      user.id,
      'restore',
      'product',
      id,
      sanitizeForAudit(existingProduct),
      sanitizeForAudit(restoredProduct),
      request
    )

    return NextResponse.json({ message: 'Product restored', product: restoredProduct })
  }

  return CommonErrors.badRequest('Invalid action')
}
