'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

type CheckoutStep = 'shipping' | 'payment' | 'review';

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [orderComplete, setOrderComplete] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  const shippingCost = totalPrice >= 100 ? 0 : 9.99;
  const taxRate = 0.08;
  const taxAmount = totalPrice * taxRate;
  const orderTotal = totalPrice + shippingCost + taxAmount;

  const steps = [
    { id: 'shipping', label: 'Shipping', icon: '📦' },
    { id: 'payment', label: 'Payment', icon: '💳' },
    { id: 'review', label: 'Review', icon: '✓' },
  ];

  const handleSubmitOrder = () => {
    setOrderComplete(true);
    clearCart();
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="text-8xl block mb-6">🛒</span>
          <h1
            className="text-4xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            YOUR CART IS EMPTY
          </h1>
          <p className="text-white/50 mb-8">Add some items to your cart before checking out.</p>
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-full"
            >
              Browse Shop
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-lg mx-auto px-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center"
          >
            <span className="text-4xl">✓</span>
          </motion.div>
          <h1
            className="text-4xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            ORDER CONFIRMED!
          </h1>
          <p className="text-white/60 mb-6">
            Thank you for your purchase! You will receive a confirmation email shortly with your order details.
          </p>
          <div className="glass rounded-2xl p-6 mb-8">
            <p className="text-gold-400 text-sm mb-2">Order Number</p>
            <p
              className="text-2xl font-bold text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              WLC-{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-full"
              >
                Continue Shopping
              </motion.button>
            </Link>
            <Link href="/">
              <button className="px-8 py-4 border border-gold-500/30 text-gold-400 font-semibold rounded-full hover:bg-gold-500/10 transition-colors">
                Back to Home
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/cart" className="text-gold-400 hover:text-gold-300 text-sm mb-4 inline-block">
            ← Back to Cart
          </Link>
          <h1
            className="text-4xl font-bold text-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            CHECKOUT
          </h1>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => {
                    if (step.id === 'shipping' ||
                       (step.id === 'payment' && currentStep !== 'shipping') ||
                       (step.id === 'review' && currentStep === 'review')) {
                      setCurrentStep(step.id as CheckoutStep);
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    currentStep === step.id
                      ? 'bg-gold-500 text-night-900'
                      : steps.findIndex(s => s.id === currentStep) > index
                      ? 'bg-gold-500/20 text-gold-400'
                      : 'bg-night-600 text-white/50'
                  }`}
                >
                  <span>{step.icon}</span>
                  <span className="font-semibold">{step.label}</span>
                </button>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    steps.findIndex(s => s.id === currentStep) > index
                      ? 'bg-gold-500'
                      : 'bg-night-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              {/* Shipping Form */}
              {currentStep === 'shipping' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass rounded-2xl p-8"
                >
                  <h2
                    className="text-2xl font-bold text-white mb-6"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    SHIPPING INFORMATION
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-white/50 text-sm mb-2 block">First Name *</label>
                      <input
                        type="text"
                        value={shippingInfo.firstName}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                        className="w-full px-4 py-3 bg-night-600 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="text-white/50 text-sm mb-2 block">Last Name *</label>
                      <input
                        type="text"
                        value={shippingInfo.lastName}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                        className="w-full px-4 py-3 bg-night-600 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
                        placeholder="Doe"
                      />
                    </div>
                    <div>
                      <label className="text-white/50 text-sm mb-2 block">Email *</label>
                      <input
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                        className="w-full px-4 py-3 bg-night-600 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="text-white/50 text-sm mb-2 block">Phone</label>
                      <input
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-night-600 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-white/50 text-sm mb-2 block">Address *</label>
                      <input
                        type="text"
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                        className="w-full px-4 py-3 bg-night-600 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
                        placeholder="123 Main Street, Apt 4B"
                      />
                    </div>
                    <div>
                      <label className="text-white/50 text-sm mb-2 block">City *</label>
                      <input
                        type="text"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                        className="w-full px-4 py-3 bg-night-600 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label className="text-white/50 text-sm mb-2 block">State/Province *</label>
                      <input
                        type="text"
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                        className="w-full px-4 py-3 bg-night-600 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
                        placeholder="NY"
                      />
                    </div>
                    <div>
                      <label className="text-white/50 text-sm mb-2 block">ZIP/Postal Code *</label>
                      <input
                        type="text"
                        value={shippingInfo.zipCode}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                        className="w-full px-4 py-3 bg-night-600 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
                        placeholder="10001"
                      />
                    </div>
                    <div>
                      <label className="text-white/50 text-sm mb-2 block">Country *</label>
                      <select
                        value={shippingInfo.country}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                        className="w-full px-4 py-3 bg-night-600 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors cursor-pointer"
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Spain">Spain</option>
                        <option value="Italy">Italy</option>
                        <option value="Brazil">Brazil</option>
                        <option value="Argentina">Argentina</option>
                        <option value="Mexico">Mexico</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCurrentStep('payment')}
                      className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-full"
                    >
                      Continue to Payment
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Payment Form */}
              {currentStep === 'payment' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass rounded-2xl p-8"
                >
                  <h2
                    className="text-2xl font-bold text-white mb-6"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    PAYMENT DETAILS
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="text-white/50 text-sm mb-2 block">Card Number *</label>
                      <input
                        type="text"
                        value={paymentInfo.cardNumber}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                        className="w-full px-4 py-3 bg-night-600 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div>
                      <label className="text-white/50 text-sm mb-2 block">Name on Card *</label>
                      <input
                        type="text"
                        value={paymentInfo.cardName}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                        className="w-full px-4 py-3 bg-night-600 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
                        placeholder="JOHN DOE"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="text-white/50 text-sm mb-2 block">Expiry Date *</label>
                        <input
                          type="text"
                          value={paymentInfo.expiry}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, expiry: e.target.value })}
                          className="w-full px-4 py-3 bg-night-600 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="text-white/50 text-sm mb-2 block">CVV *</label>
                        <input
                          type="text"
                          value={paymentInfo.cvv}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                          className="w-full px-4 py-3 bg-night-600 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Secure Payment Badge */}
                  <div className="mt-6 p-4 bg-night-700 rounded-xl flex items-center gap-3">
                    <span className="text-2xl">🔒</span>
                    <div>
                      <p className="text-white font-semibold">Secure Payment</p>
                      <p className="text-white/50 text-sm">Your payment information is encrypted and secure.</p>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between">
                    <button
                      onClick={() => setCurrentStep('shipping')}
                      className="text-gold-400 hover:text-gold-300 font-semibold"
                    >
                      ← Back to Shipping
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCurrentStep('review')}
                      className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-full"
                    >
                      Review Order
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Order Review */}
              {currentStep === 'review' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Shipping Info Review */}
                  <div className="glass rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-white font-semibold">Shipping Address</h3>
                      <button
                        onClick={() => setCurrentStep('shipping')}
                        className="text-gold-400 hover:text-gold-300 text-sm"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="text-white/60">
                      <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                      <p>{shippingInfo.address}</p>
                      <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                      <p>{shippingInfo.country}</p>
                      <p className="mt-2">{shippingInfo.email}</p>
                    </div>
                  </div>

                  {/* Payment Info Review */}
                  <div className="glass rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-white font-semibold">Payment Method</h3>
                      <button
                        onClick={() => setCurrentStep('payment')}
                        className="text-gold-400 hover:text-gold-300 text-sm"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="flex items-center gap-3 text-white/60">
                      <span className="text-2xl">💳</span>
                      <span>Card ending in {paymentInfo.cardNumber.slice(-4) || '****'}</span>
                    </div>
                  </div>

                  {/* Items Review */}
                  <div className="glass rounded-2xl p-6">
                    <h3 className="text-white font-semibold mb-4">Order Items ({totalItems})</h3>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div
                          key={`${item.product.id}-${item.size}-${item.color}`}
                          className="flex items-center gap-4"
                        >
                          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gold-500/20 to-night-800 flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl">👕</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-semibold">{item.product.name}</p>
                            <p className="text-white/50 text-sm">
                              {item.size && `Size: ${item.size}`}
                              {item.size && item.color && ' • '}
                              {item.color && item.color}
                              {' • Qty: '}{item.quantity}
                            </p>
                          </div>
                          <p className="text-gold-400 font-semibold">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => setCurrentStep('payment')}
                      className="text-gold-400 hover:text-gold-300 font-semibold"
                    >
                      ← Back to Payment
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmitOrder}
                      className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-full"
                    >
                      Place Order — ${orderTotal.toFixed(2)}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="glass rounded-2xl p-6 sticky top-28">
                <h2
                  className="text-xl font-bold text-white mb-6"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  ORDER SUMMARY
                </h2>

                {/* Items Preview */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.size}-${item.color}`}
                      className="flex gap-3"
                    >
                      <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-gold-500/20 to-night-800 flex items-center justify-center flex-shrink-0">
                        <span>👕</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate">{item.product.name}</p>
                        <p className="text-white/40 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-gold-400 text-sm font-semibold">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gold-500/10 pt-4 space-y-3">
                  <div className="flex justify-between text-white/70">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Tax</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-gold-500/10 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Total</span>
                    <span
                      className="text-2xl font-bold text-gold-400"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      ${orderTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Security Badges */}
                <div className="mt-6 pt-6 border-t border-gold-500/10 text-center">
                  <div className="flex items-center justify-center gap-2 text-white/40 text-sm mb-3">
                    <span>🔒</span>
                    <span>Secure SSL Encryption</span>
                  </div>
                  <div className="flex justify-center gap-4">
                    <span className="text-xl opacity-50">💳</span>
                    <span className="text-xl opacity-50">🏦</span>
                    <span className="text-xl opacity-50">📱</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
