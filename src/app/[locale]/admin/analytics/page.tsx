'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Types for API response
interface AnalyticsData {
  revenue: {
    total: number;
    average: number;
    monthly: { month: string; revenue: number }[];
  };
  orders: {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  customers: {
    total: number;
  };
  products: {
    total: number;
    topSelling: {
      productId: number;
      name: string;
      quantity: number;
      revenue: number;
    }[];
  };
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/admin/analytics');

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch analytics (${response.status})`);
        }

        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError(err instanceof Error ? err.message : 'Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Mock data for charts that aren't in the API yet
  const trafficSources = [
    { source: 'Direct', visits: 4520, percentage: 35 },
    { source: 'Social Media', visits: 3200, percentage: 25 },
    { source: 'Search', visits: 2580, percentage: 20 },
    { source: 'Referral', visits: 1680, percentage: 13 },
    { source: 'Email', visits: 900, percentage: 7 },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1
            className="text-3xl font-bold text-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            ANALYTICS
          </h1>
          <p className="text-white/50 mt-1">Track your store performance</p>
        </div>

        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <svg
              className="animate-spin h-10 w-10 text-gold-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="text-white/50">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1
            className="text-3xl font-bold text-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            ANALYTICS
          </h1>
          <p className="text-white/50 mt-1">Track your store performance</p>
        </div>

        <div className="glass rounded-2xl p-8 flex flex-col items-center justify-center">
          <div className="text-red-400 text-6xl mb-4">!</div>
          <h2 className="text-xl font-bold text-white mb-2">Error Loading Analytics</h2>
          <p className="text-white/50 text-center mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gold-500 text-night-900 font-bold rounded-xl hover:bg-gold-400 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!data) {
    return (
      <div className="space-y-8">
        <div>
          <h1
            className="text-3xl font-bold text-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            ANALYTICS
          </h1>
          <p className="text-white/50 mt-1">Track your store performance</p>
        </div>

        <div className="glass rounded-2xl p-8 flex flex-col items-center justify-center">
          <p className="text-white/50">No analytics data available</p>
        </div>
      </div>
    );
  }

  const salesByMonth = data.revenue.monthly;
  const maxRevenue = Math.max(...salesByMonth.map((s) => s.revenue), 1);

  const conversionFunnel = [
    { stage: 'Site Visits', count: 12800, percentage: 100 },
    { stage: 'Product Views', count: 8640, percentage: 67 },
    { stage: 'Add to Cart', count: 2150, percentage: 17 },
    { stage: 'Checkout Started', count: 1280, percentage: 10 },
    { stage: 'Completed Orders', count: data.orders.total * 15, percentage: 6 },
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
          { label: 'Total Revenue', value: `$${data.revenue.total.toFixed(2)}`, change: '+12.5%', icon: '💰' },
          { label: 'Orders', value: data.orders.total.toString(), change: '+8.3%', icon: '📦' },
          { label: 'Conversion Rate', value: '4.2%', change: '+0.5%', icon: '📈' },
          { label: 'Avg. Order Value', value: `$${data.revenue.average.toFixed(2)}`, change: '+3.1%', icon: '💳' },
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
          {salesByMonth.map((monthData, index) => (
            <div key={monthData.month} className="flex-1 flex flex-col items-center gap-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(monthData.revenue / maxRevenue) * 100}%` }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                className="w-full bg-gradient-to-t from-gold-600 to-gold-400 rounded-t-lg relative group min-h-[4px]"
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-night-700 rounded text-gold-400 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  ${monthData.revenue.toLocaleString()}
                </div>
              </motion.div>
              <p className="text-white/50 text-sm">{monthData.month.split(' ')[0]}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Status Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">Order Status</h2>
          <div className="space-y-4">
            {[
              { status: 'Delivered', count: data.orders.delivered, color: 'from-green-500 to-green-400' },
              { status: 'Shipped', count: data.orders.shipped, color: 'from-blue-500 to-blue-400' },
              { status: 'Processing', count: data.orders.processing, color: 'from-yellow-500 to-yellow-400' },
              { status: 'Pending', count: data.orders.pending, color: 'from-orange-500 to-orange-400' },
              { status: 'Cancelled', count: data.orders.cancelled, color: 'from-red-500 to-red-400' },
            ].map((item, index) => {
              const percentage = data.orders.total > 0 ? (item.count / data.orders.total) * 100 : 0;
              return (
                <div key={item.status}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white">{item.status}</span>
                    <span className="text-gold-400 font-semibold">
                      {item.count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-night-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                      className={`h-full bg-gradient-to-r ${item.color}`}
                    />
                  </div>
                </div>
              );
            })}
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
        {data.products.topSelling.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold-500/10">
                  <th className="p-3 text-left text-white/50 text-sm font-medium">Rank</th>
                  <th className="p-3 text-left text-white/50 text-sm font-medium">Product</th>
                  <th className="p-3 text-right text-white/50 text-sm font-medium">Units Sold</th>
                  <th className="p-3 text-right text-white/50 text-sm font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {data.products.topSelling.map((product, index) => (
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
                    <td className="p-3 text-white">{product.name}</td>
                    <td className="p-3 text-right text-white/70">{product.quantity}</td>
                    <td className="p-3 text-right text-gold-400 font-semibold">
                      ${product.revenue.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-white/50">
            No sales data available yet
          </div>
        )}
      </motion.div>
    </div>
  );
}
