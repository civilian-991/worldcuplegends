'use client';

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Mock tracking data
const mockTrackingData = {
  'WLC-A1B2C3D4E': {
    orderId: 'WLC-A1B2C3D4E',
    status: 'shipped',
    carrier: 'UPS',
    trackingNumber: '1Z999AA10123456784',
    estimatedDelivery: '2026-01-15',
    shippingAddress: {
      name: 'John Smith',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
    },
    timeline: [
      { status: 'Order Placed', date: '2026-01-10 14:30', completed: true, icon: '📝' },
      { status: 'Payment Confirmed', date: '2026-01-10 14:32', completed: true, icon: '✓' },
      { status: 'Processing', date: '2026-01-10 16:00', completed: true, icon: '📦' },
      { status: 'Shipped', date: '2026-01-11 09:15', completed: true, icon: '🚚', current: true },
      { status: 'Out for Delivery', date: 'Expected Jan 14', completed: false, icon: '📍' },
      { status: 'Delivered', date: 'Expected Jan 15', completed: false, icon: '🏠' },
    ],
    items: [
      { name: 'World Legends Cup 2026 Official Jersey', quantity: 2, size: 'L' },
      { name: 'WLC 2026 Official Cap', quantity: 1 },
    ],
  },
};

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const orderIdFromUrl = searchParams.get('id') || '';

  const [orderId, setOrderId] = useState(orderIdFromUrl);
  const [trackingData, setTrackingData] = useState<typeof mockTrackingData['WLC-A1B2C3D4E'] | null>(
    orderIdFromUrl ? mockTrackingData[orderIdFromUrl as keyof typeof mockTrackingData] || null : null
  );
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const data = mockTrackingData[orderId as keyof typeof mockTrackingData];
    if (data) {
      setTrackingData(data);
    } else {
      setError('Order not found. Please check your order ID and try again.');
      setTrackingData(null);
    }

    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400';
      case 'processing':
        return 'text-blue-400';
      case 'shipped':
        return 'text-purple-400';
      case 'delivered':
        return 'text-green-400';
      default:
        return 'text-white/50';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-6xl block mb-6">📦</span>
            <h1
              className="text-4xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              TRACK YOUR ORDER
            </h1>
            <p className="text-white/60 max-w-xl mx-auto">
              Enter your order ID to see the current status and estimated delivery date.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search Form */}
      <section className="px-6 pb-12">
        <div className="max-w-xl mx-auto">
          <form onSubmit={handleTrack} className="glass rounded-2xl p-6">
            <div className="flex gap-4">
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter Order ID (e.g., WLC-A1B2C3D4E)"
                required
                className="flex-1 px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors font-mono"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl disabled:opacity-50"
              >
                {isLoading ? 'Tracking...' : 'Track'}
              </motion.button>
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm mt-4"
              >
                {error}
              </motion.p>
            )}
          </form>
        </div>
      </section>

      {/* Tracking Results */}
      {trackingData && (
        <section className="px-6 pb-16">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Order Summary */}
              <div className="glass rounded-2xl p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-white/50 text-sm">Order ID</p>
                    <p className="text-gold-400 font-mono font-bold text-lg">{trackingData.orderId}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-white/50 text-sm">Status</p>
                    <p className={`font-bold text-lg capitalize ${getStatusColor(trackingData.status)}`}>
                      {trackingData.status}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gold-500/10 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-white/50 text-sm">Carrier</p>
                    <p className="text-white font-semibold">{trackingData.carrier}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">Tracking Number</p>
                    <p className="text-white font-mono">{trackingData.trackingNumber}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">Estimated Delivery</p>
                    <p className="text-gold-400 font-semibold">
                      {new Date(trackingData.estimatedDelivery).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="glass rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Shipment Progress</h2>
                <div className="relative">
                  {trackingData.timeline.map((step, index) => (
                    <div key={step.status} className="flex gap-4 pb-8 last:pb-0">
                      {/* Line */}
                      {index < trackingData.timeline.length - 1 && (
                        <div
                          className={`absolute left-5 top-10 w-0.5 h-[calc(100%-40px)] ${
                            step.completed ? 'bg-gold-500' : 'bg-night-600'
                          }`}
                          style={{ transform: `translateY(${index * 72}px)`, height: '56px' }}
                        />
                      )}

                      {/* Icon */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                          step.current
                            ? 'bg-gold-500 animate-pulse'
                            : step.completed
                            ? 'bg-gold-500/20 border-2 border-gold-500'
                            : 'bg-night-700 border-2 border-night-600'
                        }`}
                      >
                        <span className={step.completed || step.current ? '' : 'opacity-30'}>
                          {step.icon}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <p className={`font-semibold ${step.completed || step.current ? 'text-white' : 'text-white/40'}`}>
                          {step.status}
                        </p>
                        <p className={`text-sm ${step.completed || step.current ? 'text-white/60' : 'text-white/30'}`}>
                          {step.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address & Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-white font-semibold mb-4">Shipping Address</h3>
                  <div className="text-white/60 space-y-1">
                    <p>{trackingData.shippingAddress.name}</p>
                    <p>{trackingData.shippingAddress.street}</p>
                    <p>
                      {trackingData.shippingAddress.city}, {trackingData.shippingAddress.state}{' '}
                      {trackingData.shippingAddress.zipCode}
                    </p>
                    <p>{trackingData.shippingAddress.country}</p>
                  </div>
                </div>

                <div className="glass rounded-2xl p-6">
                  <h3 className="text-white font-semibold mb-4">Items in Shipment</h3>
                  <div className="space-y-3">
                    {trackingData.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-white/60">
                        <span>
                          {item.name}
                          {item.size && ` (${item.size})`}
                        </span>
                        <span>×{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-4">
                <Link href="/contact">
                  <button className="px-6 py-3 bg-night-700 text-white/70 rounded-xl hover:bg-night-600 hover:text-white transition-colors">
                    Contact Support
                  </button>
                </Link>
                <Link href="/account/orders">
                  <button className="px-6 py-3 bg-night-700 text-white/70 rounded-xl hover:bg-night-600 hover:text-white transition-colors">
                    View All Orders
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Demo Note */}
      <section className="px-6">
        <div className="max-w-xl mx-auto">
          <p className="text-white/30 text-sm text-center">
            Demo: Try tracking order ID &quot;WLC-A1B2C3D4E&quot;
          </p>
        </div>
      </section>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 pb-16 flex items-center justify-center"><p className="text-white/50">Loading...</p></div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
