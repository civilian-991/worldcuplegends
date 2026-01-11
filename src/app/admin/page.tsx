'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  orders,
  customers,
  getOrderStats,
  getCustomerStats,
  getTopProducts,
  getRecentOrders,
} from '@/data/admin';

export default function AdminDashboard() {
  const orderStats = getOrderStats();
  const customerStats = getCustomerStats();
  const topProducts = getTopProducts();
  const recentOrders = getRecentOrders(5);

  const statsCards = [
    {
      label: 'Total Revenue',
      value: `$${orderStats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      change: '+12.5%',
      positive: true,
      icon: '💰',
    },
    {
      label: 'Total Orders',
      value: orderStats.totalOrders.toString(),
      change: '+8.2%',
      positive: true,
      icon: '📦',
    },
    {
      label: 'Total Customers',
      value: customerStats.totalCustomers.toString(),
      change: '+15.3%',
      positive: true,
      icon: '👥',
    },
    {
      label: 'Avg. Order Value',
      value: `$${orderStats.averageOrderValue.toFixed(2)}`,
      change: '+3.1%',
      positive: true,
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
            <div className="mt-4 flex items-center gap-2">
              <span
                className={`text-sm font-medium ${
                  stat.positive ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {stat.change}
              </span>
              <span className="text-white/30 text-sm">vs last month</span>
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
            {recentOrders.map((order) => (
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
                  <p className="text-white/50 text-sm mt-1">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-gold-400 font-semibold">${order.total.toFixed(2)}</p>
                  <p className="text-white/30 text-xs">{formatDate(order.createdAt)}</p>
                </div>
              </div>
            ))}
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
            {topProducts.map((product, index) => (
              <div
                key={product.productId}
                className="flex items-center gap-4 p-4 bg-night-700 rounded-xl"
              >
                <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{product.productName}</p>
                  <p className="text-white/40 text-sm">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-gold-400 font-semibold">
                    ${product.revenue.toFixed(2)}
                  </p>
                  <p className="text-white/30 text-xs">{product.quantity} sold</p>
                </div>
              </div>
            ))}
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
