'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartSidebar() {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-night-900/80 backdrop-blur-sm z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-night-800 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gold-500/10">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🛒</span>
                <h2
                  className="text-xl font-bold text-white"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  YOUR CART
                </h2>
                <span className="px-2 py-1 bg-gold-500/20 text-gold-400 text-sm rounded-full">
                  {totalItems}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-10 h-10 rounded-full bg-night-600 flex items-center justify-center text-white/50 hover:text-white hover:bg-night-500 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-6xl block mb-4">🛒</span>
                  <p className="text-white/50 mb-4">Your cart is empty</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-gold-400 hover:text-gold-300 font-semibold"
                  >
                    Continue Shopping →
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <motion.div
                      key={`${item.product.id}-${item.size}-${item.color}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex gap-4 p-4 bg-night-700 rounded-xl"
                    >
                      {/* Product Image Placeholder */}
                      <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-gold-500/20 to-night-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">👕</span>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-sm truncate">
                          {item.product.name}
                        </h3>
                        <div className="flex gap-2 mt-1 text-xs text-white/50">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>• {item.color}</span>}
                        </div>
                        <p className="text-gold-400 font-semibold mt-2">
                          ${item.product.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => removeFromCart(item.product.id, item.size, item.color)}
                          className="text-white/30 hover:text-red-400 transition-colors text-sm"
                        >
                          Remove
                        </button>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.size, item.color)}
                            className="w-8 h-8 rounded-full bg-night-600 text-white/70 hover:text-white hover:bg-night-500 transition-colors"
                          >
                            -
                          </button>
                          <span className="text-white w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.size, item.color)}
                            className="w-8 h-8 rounded-full bg-night-600 text-white/70 hover:text-white hover:bg-night-500 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-gold-500/10 bg-night-700">
                {/* Subtotal */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white/70">Subtotal</span>
                  <span
                    className="text-2xl font-bold text-gold-400"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>

                <p className="text-white/40 text-sm mb-4">
                  Shipping and taxes calculated at checkout
                </p>

                {/* Buttons */}
                <div className="space-y-3">
                  <Link href="/checkout" onClick={() => setIsCartOpen(false)}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-full"
                    >
                      Checkout
                    </motion.button>
                  </Link>

                  <Link href="/cart" onClick={() => setIsCartOpen(false)}>
                    <button className="w-full py-4 border border-gold-500/30 text-gold-400 font-semibold rounded-full hover:bg-gold-500/10 transition-colors">
                      View Cart
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
