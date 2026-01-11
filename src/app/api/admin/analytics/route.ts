import { NextResponse } from 'next/server'
import { checkAdmin } from '@/lib/admin'

interface OrderRow {
  total: number
  status: string
  payment_status: string
  created_at: string
}

interface OrderItemRow {
  product_id: number | null
  product_name: string
  quantity: number
  price: number
}

export async function GET() {
  const { supabase, isAdmin } = await checkAdmin()

  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get order statistics
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('total, status, payment_status, created_at')

  if (ordersError) {
    return NextResponse.json({ error: ordersError.message }, { status: 500 })
  }

  const ordersList = (orders || []) as OrderRow[]
  const paidOrders = ordersList.filter(o => o.payment_status === 'paid')
  const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.total), 0)
  const totalOrders = ordersList.length
  const averageOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0

  // Order status breakdown
  const statusCounts = {
    pending: ordersList.filter(o => o.status === 'pending').length,
    processing: ordersList.filter(o => o.status === 'processing').length,
    shipped: ordersList.filter(o => o.status === 'shipped').length,
    delivered: ordersList.filter(o => o.status === 'delivered').length,
    cancelled: ordersList.filter(o => o.status === 'cancelled').length,
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

  const itemsList = (orderItems || []) as OrderItemRow[]
  const productSales: Record<number, { name: string; quantity: number; revenue: number }> = {}

  itemsList.forEach(item => {
    if (item.product_id) {
      if (!productSales[item.product_id]) {
        productSales[item.product_id] = { name: item.product_name, quantity: 0, revenue: 0 }
      }
      productSales[item.product_id].quantity += item.quantity
      productSales[item.product_id].revenue += Number(item.price) * item.quantity
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
      revenue: monthOrders.reduce((sum, o) => sum + Number(o.total), 0),
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
