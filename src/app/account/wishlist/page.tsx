'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

export default function AccountWishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = (product: typeof items[0]) => {
    addToCart(product, 1, product.sizes?.[2], product.colors?.[0]?.name);
    showToast('Added to cart', 'success');
  };

  const handleRemove = (productId: number) => {
    removeFromWishlist(productId);
    showToast('Removed from wishlist', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2
          className="text-2xl font-bold text-white"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          MY WISHLIST
        </h2>
        {items.length > 0 && (
          <button
            onClick={() => {
              clearWishlist();
              showToast('Wishlist cleared', 'info');
            }}
            className="text-white/50 hover:text-red-400 text-sm transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <span className="text-6xl block mb-4">♥</span>
          <h3 className="text-xl font-bold text-white mb-2">Your wishlist is empty</h3>
          <p className="text-white/50 mb-6">Save items you love by clicking the heart icon</p>
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl"
            >
              Browse Shop
            </motion.button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass rounded-2xl overflow-hidden group"
            >
              {/* Product Image */}
              <Link href={`/shop/${product.id}`}>
                <div className="relative h-48 bg-gradient-to-br from-gold-500/10 to-night-800 overflow-hidden">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl opacity-50 group-hover:scale-110 transition-transform">
                        {product.category === 'Jerseys' ? '👕' :
                         product.category === 'T-Shirts' ? '👔' :
                         product.category === 'Outerwear' ? '🧥' :
                         product.category === 'Shorts' ? '🩳' :
                         product.category === 'Accessories' ? '🧢' :
                         product.category === 'Equipment' ? '⚽' :
                         product.category === 'Collectibles' ? '🏆' : '🛍️'}
                      </span>
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemove(product.id);
                    }}
                    className="absolute top-3 right-3 w-10 h-10 rounded-full bg-night-900/80 flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                  >
                    ♥
                  </button>

                  {/* Badges */}
                  {product.originalPrice && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                      SALE
                    </span>
                  )}
                </div>
              </Link>

              {/* Product Info */}
              <div className="p-4">
                <p className="text-gold-400/70 text-xs uppercase tracking-wider mb-1">
                  {product.category}
                </p>
                <Link href={`/shop/${product.id}`}>
                  <h3 className="text-white font-semibold group-hover:text-gold-400 transition-colors line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${i < Math.floor(product.rating) ? 'text-gold-400' : 'text-white/20'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-white/40 text-xs">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="text-xl font-bold text-gold-400"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-white/40 text-sm line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                {product.inStock ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAddToCart(product)}
                    className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl"
                  >
                    Add to Cart
                  </motion.button>
                ) : (
                  <button
                    disabled
                    className="w-full py-3 bg-night-700 text-white/50 font-semibold rounded-xl cursor-not-allowed"
                  >
                    Out of Stock
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
