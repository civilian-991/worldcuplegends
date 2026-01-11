'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();

  if (items.length === 0) {
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
          <p className="text-white/50 mb-8 max-w-md mx-auto">
            Looks like you haven&apos;t added any items to your cart yet. Explore our shop to find legendary merchandise.
          </p>
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-full"
            >
              Start Shopping
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-gold-400 text-sm tracking-[0.4em] uppercase mb-4">Shopping</p>
            <h1
              className="text-5xl font-bold text-white mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              YOUR <span className="text-gradient-gold">CART</span>
            </h1>
            <p className="text-white/50">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
            </p>
          </motion.div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={`${item.product.id}-${item.size}-${item.color}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass rounded-2xl p-6 flex gap-6"
                >
                  {/* Product Image */}
                  <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-gold-500/20 to-night-800 flex items-center justify-center flex-shrink-0">
                    <span className="text-4xl">
                      {item.product.category === 'Jerseys' ? '👕' :
                       item.product.category === 'T-Shirts' ? '👔' :
                       item.product.category === 'Outerwear' ? '🧥' :
                       item.product.category === 'Shorts' ? '🩳' :
                       item.product.category === 'Accessories' ? '🧢' :
                       item.product.category === 'Equipment' ? '⚽' :
                       item.product.category === 'Collectibles' ? '🏆' : '🛍️'}
                    </span>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <Link
                      href={`/shop/${item.product.id}`}
                      className="text-white font-semibold hover:text-gold-400 transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <div className="flex gap-4 mt-2 text-sm text-white/50">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>
                    <p
                      className="text-gold-400 font-bold text-xl mt-3"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      ${item.product.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeFromCart(item.product.id, item.size, item.color)}
                      className="text-white/30 hover:text-red-400 transition-colors text-sm"
                    >
                      Remove
                    </button>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.size, item.color)}
                        className="w-10 h-10 rounded-full bg-night-600 text-white/70 hover:text-white hover:bg-night-500 transition-colors flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="text-white font-semibold w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.size, item.color)}
                        className="w-10 h-10 rounded-full bg-night-600 text-white/70 hover:text-white hover:bg-night-500 transition-colors flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>

                    <p className="text-white font-semibold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Clear Cart */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={clearCart}
                  className="text-white/40 hover:text-red-400 transition-colors text-sm"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass rounded-2xl p-6 sticky top-28"
              >
                <h2
                  className="text-xl font-bold text-white mb-6"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  ORDER SUMMARY
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-white/70">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Shipping</span>
                    <span>{totalPrice >= 100 ? 'FREE' : '$9.99'}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t border-gold-500/10 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Estimated Total</span>
                    <span
                      className="text-2xl font-bold text-gold-400"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      ${(totalPrice + (totalPrice >= 100 ? 0 : 9.99)).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mb-6">
                  <label className="text-white/50 text-sm mb-2 block">Promo Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="flex-1 px-4 py-3 bg-night-600 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
                    />
                    <button className="px-4 py-3 bg-night-600 text-gold-400 font-semibold rounded-xl hover:bg-night-500 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link href="/checkout">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-full mb-4"
                  >
                    Proceed to Checkout
                  </motion.button>
                </Link>

                <Link href="/shop">
                  <button className="w-full py-4 border border-gold-500/30 text-gold-400 font-semibold rounded-full hover:bg-gold-500/10 transition-colors">
                    Continue Shopping
                  </button>
                </Link>

                {/* Secure Checkout */}
                <div className="mt-6 text-center">
                  <div className="flex items-center justify-center gap-2 text-white/40 text-sm">
                    <span>🔒</span>
                    <span>Secure Checkout</span>
                  </div>
                  <div className="flex justify-center gap-3 mt-4">
                    <span className="text-2xl opacity-50">💳</span>
                    <span className="text-2xl opacity-50">🏦</span>
                    <span className="text-2xl opacity-50">📱</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Shipping Banner */}
      {totalPrice < 100 && (
        <section className="px-6 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="glass rounded-2xl p-6 text-center">
              <p className="text-white/70">
                Add <span className="text-gold-400 font-semibold">${(100 - totalPrice).toFixed(2)}</span> more to qualify for{' '}
                <span className="text-gold-400 font-semibold">FREE shipping!</span>
              </p>
              <div className="mt-4 h-2 bg-night-600 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((totalPrice / 100) * 100, 100)}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-gold-500 to-gold-600"
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
