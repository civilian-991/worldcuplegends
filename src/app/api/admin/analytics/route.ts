import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

export async function GET() {
  const supabase = await createClient()

  const admin = await checkAdmin(supabase)
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get order statistics
  const { data: orders } = await supabase
    .from('orders')
    .select('total, status, payment_status, created_at')

  const paidOrders = orders?.filter(o => o.payment_status === 'paid') || []
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0)
  const totalOrders = orders?.length || 0
  const averageOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0

  // Order status breakdown
  const statusCounts = {
    pending: orders?.filter(o => o.status === 'pending').length || 0,
    processing: orders?.filter(o => o.status === 'processing').length || 0,
    shipped: orders?.filter(o => o.status === 'shipped').length || 0,
    delivered: orders?.filter(o => o.status === 'delivered').length || 0,
    cancelled: orders?.filter(o => o.status === 'cancelled').length || 0,
  }

  // Get customer count
  const { count: customerCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'customer')

  // Get product count
  const { count: productCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })

  // Get top selling products
  const { data: orderItems } = await supabase
    .from('order_items')
    .select('product_id, product_name, quantity, price')

  const productSales: Record<number, { name: string; quantity: number; revenue: number }> = {}
  orderItems?.forEach(item => {
    if (item.product_id) {
      if (!productSales[item.product_id]) {
        productSales[item.product_id] = { name: item.product_name, quantity: 0, revenue: 0 }
      }
      productSales[item.product_id].quantity += item.quantity
      productSales[item.product_id].revenue += item.price * item.quantity
    }
  })

  const topProducts = Object.entries(productSales)
    .map(([id, data]) => ({ productId: parseInt(id), ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  // Monthly revenue (last 12 months)
  const monthlyRevenue: { month: string; revenue: number }[] = []
  const now = new Date()
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
    const monthOrders = paidOrders.filter(o => {
      const orderDate = new Date(o.created_at)
      return orderDate >= date && orderDate < nextDate
    })
    monthlyRevenue.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      revenue: monthOrders.reduce((sum, o) => sum + o.total, 0),
    })
  }

  return NextResponse.json({
    revenue: {
      total: totalRevenue,
      average: averageOrderValue,
      monthly: monthlyRevenue,
    },
    orders: {
      total: totalOrders,
      ...statusCounts,
    },
    customers: {
      total: customerCount || 0,
    },
    products: {
      total: productCount || 0,
      topSelling: topProducts,
    },
  })
}
