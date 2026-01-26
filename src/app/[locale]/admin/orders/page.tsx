'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  size: string | null;
  color: string | null;
}

interface Order {
  id: string;
  user_id: string | null;
  status: string;
  payment_status: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shipping_address: {
    firstName?: string;
    lastName?: string;
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  } | null;
  tracking_number: string | null;
  notes: string | null;
  created_at: string;
  items?: OrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders(data || []);
    }
    setIsLoading(false);
  };

  const fetchOrderItems = async (orderId: string) => {
    const { data } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);
    return data || [];
  };

  const handleSelectOrder = async (order: Order) => {
    const items = await fetchOrderItems(order.id);
    setSelectedOrder({ ...order, items });
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order:', error);
    } else {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    }
  };

  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.id.toLowerCase().includes(query) ||
          o.shipping_address?.firstName?.toLowerCase().includes(query) ||
          o.shipping_address?.lastName?.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }

    return filtered;
  }, [orders, searchQuery, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'processing': return 'bg-blue-500/20 text-blue-400';
      case 'shipped': return 'bg-purple-500/20 text-purple-400';
      case 'delivered': return 'bg-green-500/20 text-green-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/20 text-green-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'refunded': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCustomerName = (order: Order) => {
    if (order.shipping_address?.firstName && order.shipping_address?.lastName) {
      return `${order.shipping_address.firstName} ${order.shipping_address.lastName}`;
    }
    return 'Guest Customer';
  };

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
          ORDERS
        </h1>
        <p className="text-white/50 mt-1">Manage customer orders</p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {statusOptions.slice(1).map((status) => {
          const count = orders.filter((o) => o.status === status.value).length;
          return (
            <button
              key={status.value}
              onClick={() => setStatusFilter(status.value)}
              className={`p-4 rounded-xl transition-all ${
                statusFilter === status.value
                  ? 'glass border border-gold-500/30'
                  : 'bg-night-800 hover:bg-night-700'
              }`}
            >
              <p className="text-2xl font-bold text-white">{count}</p>
              <p className="text-white/50 text-sm">{status.label}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-10 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold-500/10">
                <th className="p-4 text-left text-white/50 text-sm font-medium">Order ID</th>
                <th className="p-4 text-left text-white/50 text-sm font-medium">Customer</th>
                <th className="p-4 text-left text-white/50 text-sm font-medium">Total</th>
                <th className="p-4 text-left text-white/50 text-sm font-medium">Status</th>
                <th className="p-4 text-left text-white/50 text-sm font-medium">Payment</th>
                <th className="p-4 text-left text-white/50 text-sm font-medium">Date</th>
                <th className="p-4 text-right text-white/50 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gold-500/5 hover:bg-night-700/50 transition-colors cursor-pointer"
                  onClick={() => handleSelectOrder(order)}
                >
                  <td className="p-4">
                    <p className="text-gold-400 font-mono font-semibold">{order.id}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-white font-semibold">{getCustomerName(order)}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-white font-semibold">${Number(order.total).toFixed(2)}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getPaymentStatusColor(order.payment_status)}`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="text-white/60 text-sm">{formatDate(order.created_at)}</p>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleSelectOrder(order); }}
                      className="px-4 py-2 bg-gold-500/20 text-gold-400 rounded-lg hover:bg-gold-500/30 transition-colors text-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="p-12 text-center">
            <span className="text-4xl block mb-4">📦</span>
            <p className="text-white/50">No orders found</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-night-900/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-night-800 z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-gold-400 font-mono font-bold text-lg">{selectedOrder.id}</p>
                    <p className="text-white/50 text-sm">{formatDate(selectedOrder.created_at)}</p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="w-10 h-10 rounded-full bg-night-700 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex gap-3 mb-6">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${getPaymentStatusColor(selectedOrder.payment_status)}`}>
                    {selectedOrder.payment_status}
                  </span>
                </div>

                <div className="bg-night-700 rounded-xl p-4 mb-6">
                  <h3 className="text-white font-semibold mb-3">Customer</h3>
                  <p className="text-white">{getCustomerName(selectedOrder)}</p>
                </div>

                {selectedOrder.shipping_address && (
                  <div className="bg-night-700 rounded-xl p-4 mb-6">
                    <h3 className="text-white font-semibold mb-3">Shipping Address</h3>
                    <p className="text-white/70">
                      {selectedOrder.shipping_address.street}<br />
                      {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.zipCode}<br />
                      {selectedOrder.shipping_address.country}
                    </p>
                  </div>
                )}

                {selectedOrder.items && selectedOrder.items.length > 0 && (
                  <div className="bg-night-700 rounded-xl p-4 mb-6">
                    <h3 className="text-white font-semibold mb-3">Items</h3>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-white text-sm">{item.product_name}</p>
                            <p className="text-white/40 text-xs">
                              {item.size && `Size: ${item.size}`}
                              {item.size && item.color && ' • '}
                              {item.color}
                              {' • Qty: '}{item.quantity}
                            </p>
                          </div>
                          <p className="text-gold-400 text-sm font-semibold">
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-night-700 rounded-xl p-4 mb-6">
                  <h3 className="text-white font-semibold mb-3">Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/50">Subtotal</span>
                      <span className="text-white">${Number(selectedOrder.subtotal).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Shipping</span>
                      <span className="text-white">{Number(selectedOrder.shipping) === 0 ? 'FREE' : `$${Number(selectedOrder.shipping).toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Tax</span>
                      <span className="text-white">${Number(selectedOrder.tax).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gold-500/10">
                      <span className="text-white font-semibold">Total</span>
                      <span className="text-gold-400 font-bold">${Number(selectedOrder.total).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-white font-semibold">Update Status</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['pending', 'processing', 'shipped', 'delivered'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                        className={`py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                          selectedOrder.status === status
                            ? 'bg-gold-500 text-night-900'
                            : 'bg-night-600 text-white/70 hover:bg-night-500'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                  {selectedOrder.status !== 'cancelled' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}
                      className="w-full py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
