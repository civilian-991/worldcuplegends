import { NextRequest, NextResponse } from 'next/server'
import { checkAdmin } from '@/lib/admin'
import { sendShippingNotification } from '@/lib/email'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, isAdmin } = await checkAdmin()
  const { id } = await params

  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('id', id)
    .single()

  if (error || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  return NextResponse.json({ order })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, isAdmin } = await checkAdmin()
  const { id } = await params

  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { status, tracking_number, notes } = body

  const updateData: Record<string, unknown> = {}
  if (status) updateData.status = status
  if (tracking_number) updateData.tracking_number = tracking_number
  if (notes !== undefined) updateData.notes = notes

  const { data: order, error } = await supabase
    .from('orders')
    .update(updateData as never)
    .eq('id', id)
    .select('*, order_items (*)')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Send shipping notification if status changed to shipped
  const orderData = order as { id: string; shipping_address: { firstName: string; lastName: string; email: string } } | null
  if (status === 'shipped' && tracking_number && orderData) {
    const shippingAddress = orderData.shipping_address

    await sendShippingNotification(
      shippingAddress.email,
      `${shippingAddress.firstName} ${shippingAddress.lastName}`,
      orderData.id,
      tracking_number
    )
  }

  return NextResponse.json({ order })
}
