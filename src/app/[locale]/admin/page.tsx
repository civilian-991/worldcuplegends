'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';

interface OrderStats {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
}

interface RecentOrder {
  id: string;
  status: string;
  total: number;
  created_at: string;
  shipping_address: { firstName?: string; lastName?: string } | null;
}

interface TopProduct {
  product_id: number;
  product_name: string;
  total_quantity: number;
  total_revenue: number;
}

interface OrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
}

export default function AdminDashboard() {
  const [orderStats, setOrderStats] = useState<OrderStats>({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
  });
  const [customerCount, setCustomerCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);

    // Fetch orders for stats
    const { data: orders } = await supabase
      .from('orders')
      .select('id, status, total, created_at, shipping_address');

    if (orders) {
      const totalRevenue = orders.reduce((sum: number, o: RecentOrder) => sum + (Number(o.total) || 0), 0);
      const totalOrders = orders.length;
      const stats: OrderStats = {
        totalRevenue,
        totalOrders,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        pendingOrders: orders.filter((o: RecentOrder) => o.status === 'pending').length,
        processingOrders: orders.filter((o: RecentOrder) => o.status === 'processing').length,
        shippedOrders: orders.filter((o: RecentOrder) => o.status === 'shipped').length,
        deliveredOrders: orders.filter((o: RecentOrder) => o.status === 'delivered').length,
        cancelledOrders: orders.filter((o: RecentOrder) => o.status === 'cancelled').length,
      };
      setOrderStats(stats);

      // Recent orders (last 5)
      const recent = orders
        .sort((a: RecentOrder, b: RecentOrder) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);
      setRecentOrders(recent);
    }

    // Fetch customer count
    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    setCustomerCount(count || 0);

    // Fetch top products from order_items
    const { data: orderItems } = await supabase
      .from('order_items')
      .select('product_id, product_name, quantity, price');

    if (orderItems) {
      const productMap = new Map<number, { name: string; quantity: number; revenue: number }>();
      orderItems.forEach((item: OrderItem) => {
        const existing = productMap.get(item.product_id) || { name: item.product_name, quantity: 0, revenue: 0 };
        existing.quantity += item.quantity;
        existing.revenue += Number(item.price) * item.quantity;
        productMap.set(item.product_id, existing);
      });

      const top = Array.from(productMap.entries())
        .map(([id, data]) => ({
          product_id: id,
          product_name: data.name,
          total_quantity: data.quantity,
          total_revenue: data.revenue,
        }))
        .sort((a, b) => b.total_revenue - a.total_revenue)
        .slice(0, 5);
      setTopProducts(top);
    }

    setIsLoading(false);
  };

  const statsCards = [
    {
      label: 'Total Revenue',
      value: `$${orderStats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: '💰',
    },
    {
      label: 'Total Orders',
      value: orderStats.totalOrders.toString(),
      icon: '📦',
    },
    {
      label: 'Total Customers',
      value: customerCount.toString(),
      icon: '👥',
    },
    {
      label: 'Avg. Order Value',
      value: `$${orderStats.averageOrderValue.toFixed(2)}`,
      icon: '📊',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'processing':
        return 'bg-blue-500/20 text-blue-400';
      case 'shipped':
        return 'bg-purple-500/20 text-purple-400';
      case 'delivered':
        return 'bg-green-500/20 text-green-400';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCustomerName = (order: RecentOrder) => {
    if (order.shipping_address?.firstName && order.shipping_address?.lastName) {
      return `${order.shipping_address.firstName} ${order.shipping_address.lastName}`;
    }
    return 'Guest Customer';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-bold text-white"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          DASHBOARD
        </h1>
        <p className="text-white/50 mt-1">Welcome back! Here&apos;s what&apos;s happening with your store.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/50 text-sm">{stat.label}</p>
                <p
                  className="text-2xl font-bold text-white mt-1"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {stat.value}
                </p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Order Status Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-2xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-6">Order Status Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { label: 'Pending', value: orderStats.pendingOrders, color: 'bg-yellow-500' },
            { label: 'Processing', value: orderStats.processingOrders, color: 'bg-blue-500' },
            { label: 'Shipped', value: orderStats.shippedOrders, color: 'bg-purple-500' },
            { label: 'Delivered', value: orderStats.deliveredOrders, color: 'bg-green-500' },
            { label: 'Cancelled', value: orderStats.cancelledOrders, color: 'bg-red-500' },
          ].map((status) => (
            <div key={status.label} className="text-center p-4 bg-night-700 rounded-xl">
              <div className={`w-3 h-3 ${status.color} rounded-full mx-auto mb-2`} />
              <p className="text-2xl font-bold text-white">{status.value}</p>
              <p className="text-white/50 text-sm">{status.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Orders</h2>
            <Link href="/admin/orders" className="text-gold-400 hover:text-gold-300 text-sm">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <p className="text-white/50 text-center py-8">No orders yet</p>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-night-700 rounded-xl"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="text-white font-semibold">{order.id}</p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-white/50 text-sm mt-1">{getCustomerName(order)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gold-400 font-semibold">${Number(order.total).toFixed(2)}</p>
                    <p className="text-white/30 text-xs">{formatDate(order.created_at)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Top Products</h2>
            <Link href="/admin/products" className="text-gold-400 hover:text-gold-300 text-sm">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {topProducts.length === 0 ? (
              <p className="text-white/50 text-center py-8">No sales data yet</p>
            ) : (
              topProducts.map((product, index) => (
                <div
                  key={product.product_id}
                  className="flex items-center gap-4 p-4 bg-night-700 rounded-xl"
                >
                  <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold truncate">{product.product_name}</p>
                    <p className="text-white/40 text-sm">{product.total_quantity} sold</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gold-400 font-semibold">
                      ${product.total_revenue.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass rounded-2xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Add Product', icon: '➕', href: '/admin/products/new', color: 'from-green-500 to-green-600' },
            { label: 'View Orders', icon: '📦', href: '/admin/orders', color: 'from-blue-500 to-blue-600' },
            { label: 'Customers', icon: '👥', href: '/admin/customers', color: 'from-purple-500 to-purple-600' },
            { label: 'Settings', icon: '⚙️', href: '/admin/settings', color: 'from-gray-500 to-gray-600' },
          ].map((action) => (
            <Link key={action.label} href={action.href}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl bg-gradient-to-br ${action.color} text-white text-center cursor-pointer`}
              >
                <span className="text-3xl block mb-2">{action.icon}</span>
                <span className="font-semibold">{action.label}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
