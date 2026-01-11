'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';

export default function ProductPage() {
  const params = useParams();
  const productId = parseInt(params.id as string);
  const product = products.find((p) => p.id === productId);
  const { addToCart, setIsCartOpen } = useCart();

  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product?.sizes?.[2]
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product?.colors?.[0]?.name
  );
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Product Not Found</h1>
          <Link href="/shop" className="text-gold-400 hover:text-gold-300">
            ← Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    setIsCartOpen(true);
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Breadcrumb */}
      <section className="px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-white/50">
            <Link href="/shop" className="hover:text-gold-400 transition-colors">
              Shop
            </Link>
            <span>/</span>
            <Link
              href={`/shop?category=${product.category.toLowerCase()}`}
              className="hover:text-gold-400 transition-colors"
            >
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-white/70">{product.name}</span>
          </div>
        </div>
      </section>

      {/* Product Detail */}
      <section className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-gold-500/20 to-night-800">
                {/* Product Image */}
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[150px] opacity-30">
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

                {/* Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  {product.featured && (
                    <span className="px-4 py-2 bg-gold-500 text-night-900 text-sm font-bold rounded-full">
                      FEATURED
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-full">
                      SALE
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnail Gallery Placeholder */}
              <div className="flex gap-4 mt-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`w-20 h-20 rounded-xl bg-gradient-to-br from-gold-500/10 to-night-800 cursor-pointer border-2 ${
                      i === 1 ? 'border-gold-500' : 'border-transparent hover:border-gold-500/50'
                    } transition-colors`}
                  />
                ))}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col"
            >
              {/* Category */}
              <p className="text-gold-400 text-sm uppercase tracking-wider mb-2">
                {product.category}
              </p>

              {/* Name */}
              <h1
                className="text-3xl md:text-4xl font-bold text-white mb-4"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {product.name.toUpperCase()}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${i < Math.floor(product.rating) ? 'text-gold-400' : 'text-white/20'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-white/50">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-8">
                <span
                  className="text-4xl font-bold text-gold-400"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-white/40 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <span className="px-3 py-1 bg-red-500/20 text-red-400 text-sm rounded-full">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-white/70 mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <p className="text-white/50 text-sm mb-3">
                    Color: <span className="text-white">{selectedColor}</span>
                  </p>
                  <div className="flex gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          selectedColor === color.name
                            ? 'border-gold-500 scale-110'
                            : 'border-white/20 hover:border-white/50'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-white/50 text-sm">
                      Size: <span className="text-white">{selectedSize}</span>
                    </p>
                    <button className="text-gold-400 text-sm hover:text-gold-300">
                      Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 rounded-xl font-semibold transition-all ${
                          selectedSize === size
                            ? 'bg-gold-500 text-night-900'
                            : 'bg-night-600 text-white hover:bg-night-500'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-8">
                <p className="text-white/50 text-sm mb-3">Quantity</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-night-600 rounded-full">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 text-white/70 hover:text-white transition-colors"
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-white font-semibold">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 text-white/70 hover:text-white transition-colors"
                    >
                      +
                    </button>
                  </div>
                  {product.inStock ? (
                    <span className="text-green-400 text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-400" />
                      In Stock
                    </span>
                  ) : (
                    <span className="text-red-400 text-sm">Out of Stock</span>
                  )}
                </div>
              </div>

              {/* Add to Cart */}
              <div className="flex gap-4 mb-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold text-lg rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Cart — ${(product.price * quantity).toFixed(2)}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-14 h-14 rounded-full border border-gold-500/30 flex items-center justify-center text-gold-400 hover:bg-gold-500/10 transition-colors"
                >
                  ♥
                </motion.button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/10">
                {[
                  { icon: '🚚', text: 'Free shipping over $100' },
                  { icon: '↩️', text: '30-day returns' },
                  { icon: '✓', text: 'Authentic merchandise' },
                  { icon: '🔒', text: 'Secure checkout' },
                ].map((feature) => (
                  <div key={feature.text} className="flex items-center gap-3 text-white/60 text-sm">
                    <span>{feature.icon}</span>
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="px-6 py-16 bg-night-800">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-2xl p-8">
            <h2
              className="text-2xl font-bold text-white mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              PRODUCT DETAILS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-gold-400 font-semibold mb-3">Description</h3>
                <p className="text-white/60 leading-relaxed">
                  {product.description}
                  <br /><br />
                  Premium quality materials ensure comfort and durability. Official World Legends Cup merchandise with authentic licensing.
                </p>
              </div>
              <div>
                <h3 className="text-gold-400 font-semibold mb-3">Features</h3>
                <ul className="space-y-2 text-white/60">
                  <li className="flex items-center gap-2">
                    <span className="text-gold-400">✓</span>
                    Official WLC 2026 licensed product
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gold-400">✓</span>
                    Premium quality materials
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gold-400">✓</span>
                    Machine washable
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gold-400">✓</span>
                    Comfortable fit
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <h2
              className="text-3xl font-bold text-white mb-8"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              YOU MAY ALSO LIKE
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} href={`/shop/${relatedProduct.id}`}>
                  <div className="group glass rounded-xl overflow-hidden">
                    <div className="relative h-40 bg-gradient-to-br from-gold-500/10 to-night-800 overflow-hidden">
                      {relatedProduct.images?.[0] ? (
                        <img
                          src={relatedProduct.images[0]}
                          alt={relatedProduct.name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-4xl opacity-50 group-hover:scale-110 transition-transform">
                            {relatedProduct.category === 'Jerseys' ? '👕' : '🛍️'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-white text-sm font-semibold group-hover:text-gold-400 transition-colors line-clamp-2">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-gold-400 font-bold mt-2">
                        ${relatedProduct.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
