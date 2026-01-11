import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendShippingNotification } from '@/lib/email'

async function checkAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') return null

  return user
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params

  const admin = await checkAdmin(supabase)
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*),
      profile:profiles (first_name, last_name, email)
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
  const supabase = await createClient()
  const { id } = await params

  const admin = await checkAdmin(supabase)
  if (!admin) {
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
    .update(updateData)
    .eq('id', id)
    .select('*, order_items (*)')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Send shipping notification if status changed to shipped
  if (status === 'shipped' && tracking_number) {
    const shippingAddress = order.shipping_address as {
      firstName: string
      lastName: string
      email: string
    }

    await sendShippingNotification(
      shippingAddress.email,
      `${shippingAddress.firstName} ${shippingAddress.lastName}`,
      order.id,
      tracking_number
    )
  }

  return NextResponse.json({ order })
}
