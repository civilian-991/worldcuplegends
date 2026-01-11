'use client';

import { motion } from 'framer-motion';
import { orders, customers, getOrderStats, getTopProducts } from '@/data/admin';
import { products, categories } from '@/data/products';

export default function AdminAnalyticsPage() {
  const orderStats = getOrderStats();
  const topProducts = getTopProducts();

  // Mock data for charts
  const salesByMonth = [
    { month: 'Aug', revenue: 12450 },
    { month: 'Sep', revenue: 18320 },
    { month: 'Oct', revenue: 24150 },
    { month: 'Nov', revenue: 31200 },
    { month: 'Dec', revenue: 42800 },
    { month: 'Jan', revenue: 38500 },
  ];

  const maxRevenue = Math.max(...salesByMonth.map((s) => s.revenue));

  const salesByCategory = categories
    .filter((c) => c.slug !== 'all')
    .map((cat) => {
      const categoryProducts = products.filter((p) => p.category === cat.name);
      const totalRevenue = categoryProducts.reduce((sum, p) => sum + p.price * Math.floor(Math.random() * 20 + 5), 0);
      return {
        category: cat.name,
        revenue: totalRevenue,
        count: cat.count,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);

  const totalCategoryRevenue = salesByCategory.reduce((sum, c) => sum + c.revenue, 0);

  const trafficSources = [
    { source: 'Direct', visits: 4520, percentage: 35 },
    { source: 'Social Media', visits: 3200, percentage: 25 },
    { source: 'Search', visits: 2580, percentage: 20 },
    { source: 'Referral', visits: 1680, percentage: 13 },
    { source: 'Email', visits: 900, percentage: 7 },
  ];

  const conversionFunnel = [
    { stage: 'Site Visits', count: 12800, percentage: 100 },
    { stage: 'Product Views', count: 8640, percentage: 67 },
    { stage: 'Add to Cart', count: 2150, percentage: 17 },
    { stage: 'Checkout Started', count: 1280, percentage: 10 },
    { stage: 'Completed Orders', count: orders.length * 15, percentage: 6 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-bold text-white"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          ANALYTICS
        </h1>
        <p className="text-white/50 mt-1">Track your store performance</p>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2">
        {['7 Days', '30 Days', '90 Days', '12 Months'].map((period, i) => (
          <button
            key={period}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              i === 1
                ? 'bg-gold-500 text-night-900'
                : 'bg-night-700 text-white/70 hover:bg-night-600'
            }`}
          >
            {period}
          </button>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `$${orderStats.totalRevenue.toFixed(2)}`, change: '+12.5%', icon: '💰' },
          { label: 'Orders', value: orderStats.totalOrders.toString(), change: '+8.3%', icon: '📦' },
          { label: 'Conversion Rate', value: '4.2%', change: '+0.5%', icon: '📈' },
          { label: 'Avg. Order Value', value: `$${orderStats.averageOrderValue.toFixed(2)}`, change: '+3.1%', icon: '💳' },
        ].map((kpi, index) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-xl p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/50 text-sm">{kpi.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{kpi.value}</p>
                <p className="text-green-400 text-sm mt-2">{kpi.change}</p>
              </div>
              <span className="text-2xl">{kpi.icon}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-2xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-6">Revenue Trend</h2>
        <div className="h-64 flex items-end justify-between gap-4">
          {salesByMonth.map((data, index) => (
            <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                className="w-full bg-gradient-to-t from-gold-600 to-gold-400 rounded-t-lg relative group"
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-night-700 rounded text-gold-400 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  ${data.revenue.toLocaleString()}
                </div>
              </motion.div>
              <p className="text-white/50 text-sm">{data.month}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">Sales by Category</h2>
          <div className="space-y-4">
            {salesByCategory.map((cat, index) => (
              <div key={cat.category}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white">{cat.category}</span>
                  <span className="text-gold-400 font-semibold">
                    ${cat.revenue.toFixed(0)}
                  </span>
                </div>
                <div className="h-2 bg-night-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(cat.revenue / totalCategoryRevenue) * 100}%` }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-gold-500 to-gold-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Traffic Sources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">Traffic Sources</h2>
          <div className="space-y-4">
            {trafficSources.map((source, index) => (
              <div key={source.source} className="flex items-center gap-4">
                <div className="w-24 text-white/70">{source.source}</div>
                <div className="flex-1 h-2 bg-night-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${source.percentage}%` }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
                  />
                </div>
                <div className="w-16 text-right text-white/50 text-sm">
                  {source.percentage}%
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Conversion Funnel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass rounded-2xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-6">Conversion Funnel</h2>
        <div className="flex items-end justify-center gap-2 h-48">
          {conversionFunnel.map((stage, index) => (
            <div
              key={stage.stage}
              className="flex flex-col items-center"
              style={{ width: `${20 - index * 2}%` }}
            >
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${stage.percentage * 1.8}px` }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg"
              />
              <div className="mt-3 text-center">
                <p className="text-white text-sm font-semibold">{stage.count.toLocaleString()}</p>
                <p className="text-white/40 text-xs">{stage.stage}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Top Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glass rounded-2xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-6">Top Selling Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold-500/10">
                <th className="p-3 text-left text-white/50 text-sm font-medium">Rank</th>
                <th className="p-3 text-left text-white/50 text-sm font-medium">Product</th>
                <th className="p-3 text-left text-white/50 text-sm font-medium">Category</th>
                <th className="p-3 text-right text-white/50 text-sm font-medium">Units Sold</th>
                <th className="p-3 text-right text-white/50 text-sm font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, index) => (
                <tr key={product.productId} className="border-b border-gold-500/5">
                  <td className="p-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-gold-500 text-night-900' :
                      index === 1 ? 'bg-gray-400 text-night-900' :
                      index === 2 ? 'bg-amber-700 text-white' :
                      'bg-night-700 text-white/50'
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="p-3 text-white">{product.productName}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-gold-500/10 text-gold-400 text-xs rounded-full">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-3 text-right text-white/70">{product.quantity}</td>
                  <td className="p-3 text-right text-gold-400 font-semibold">
                    ${product.revenue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
