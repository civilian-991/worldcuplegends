'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { InstagramPost } from '@/app/api/instagram/route';

interface GalleryImage {
  id: number;
  title: string;
  category: string;
  url: string;
  sortOrder: number;
  createdAt: string;
}

// --------------- Instagram Section ---------------

function InstagramFallback({ t }: { t: ReturnType<typeof useTranslations<'gallery'>> }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center py-16"
    >
      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      </div>
      <h3
        className="text-2xl md:text-3xl font-bold text-white mb-3"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {t('instagram.followUs')}
      </h3>
      <p className="text-white/60 mb-8 max-w-md mx-auto">
        {t('instagram.followDescription')}
      </p>
      <a
        href="https://www.instagram.com/worldlegendscupofficial/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
        @worldlegendscupofficial
      </a>
    </motion.div>
  );
}

function InstagramCard({ post, index }: { post: InstagramPost; index: number }) {
  const isVideo = post.media_type === 'VIDEO';
  const imageUrl = isVideo ? post.thumbnail_url || post.media_url : post.media_url;

  return (
    <motion.a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-night-800"
    >
      <Image
        src={imageUrl}
        alt={post.caption?.slice(0, 100) || 'Instagram post'}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        unoptimized
      />

      {/* Video play icon */}
      {isVideo && (
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center backdrop-blur-sm">
          <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        {post.caption && (
          <p className="text-white text-sm line-clamp-3 mb-2">{post.caption}</p>
        )}
        <span className="text-gold-400 text-xs font-medium flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
          View on Instagram
        </span>
      </div>
    </motion.a>
  );
}

function InstagramSkeletons() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="aspect-square rounded-2xl bg-white/5 animate-pulse" />
      ))}
    </div>
  );
}

function InstagramSection({ t }: { t: ReturnType<typeof useTranslations<'gallery'>> }) {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [fallback, setFallback] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/instagram');
        const data = await res.json();
        setPosts(data.posts || []);
        setFallback(data.fallback ?? true);
      } catch {
        setFallback(true);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <p className="text-gold-400 text-sm tracking-[0.4em] uppercase mb-4">
            {t('instagram.preTitle')}
          </p>
          <h2
            className="text-3xl md:text-5xl font-bold text-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('instagram.title')} <span className="text-gradient-gold">{t('instagram.titleHighlight')}</span>
          </h2>
        </motion.div>

        {loading ? (
          <InstagramSkeletons />
        ) : fallback || posts.length === 0 ? (
          <InstagramFallback t={t} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {posts.map((post, index) => (
              <InstagramCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// --------------- Uploaded Gallery Section ---------------

function GallerySkeletons() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="aspect-[4/3] rounded-2xl bg-white/5 animate-pulse" />
      ))}
    </div>
  );
}

function LightboxModal({
  image,
  onClose,
  onPrev,
  onNext,
}: {
  image: GalleryImage;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center z-10"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Prev button */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center z-10"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Next button */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center z-10"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Image */}
      <motion.div
        key={image.id}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-5xl max-h-[85vh] w-full h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={image.url}
          alt={image.title || 'Gallery image'}
          fill
          className="object-contain"
          sizes="(max-width: 1280px) 100vw, 1280px"
        />
        {image.title && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
            <p className="text-white text-lg font-medium">{image.title}</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

const IMAGES_PER_PAGE = 12;

function UploadedGallerySection({ t }: { t: ReturnType<typeof useTranslations<'gallery'>> }) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [visibleCount, setVisibleCount] = useState(IMAGES_PER_PAGE);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch('/api/gallery');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setImages(data);
      } catch {
        // fail silently — empty state will show
      } finally {
        setLoading(false);
      }
    }
    fetchImages();
  }, []);

  const categories = ['all', ...Array.from(new Set(images.map(img => img.category)))];
  const filtered = activeCategory === 'all' ? images : images.filter(img => img.category === activeCategory);
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage = useCallback(() => {
    setLightboxIndex(prev => prev !== null ? (prev - 1 + filtered.length) % filtered.length : null);
  }, [filtered.length]);
  const nextImage = useCallback(() => {
    setLightboxIndex(prev => prev !== null ? (prev + 1) % filtered.length : null);
  }, [filtered.length]);

  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <p className="text-gold-400 text-sm tracking-[0.4em] uppercase mb-4">
            {t('uploaded.preTitle')}
          </p>
          <h2
            className="text-3xl md:text-5xl font-bold text-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('uploaded.title')} <span className="text-gradient-gold">{t('uploaded.titleHighlight')}</span>
          </h2>
        </motion.div>

        {/* Category filters */}
        {categories.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setVisibleCount(IMAGES_PER_PAGE); }}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-gold-400 text-night-900'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {cat === 'all' ? t('uploaded.allCategories') : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </motion.div>
        )}

        {loading ? (
          <GallerySkeletons />
        ) : images.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <svg className="w-10 h-10 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3
              className="text-xl font-bold text-white mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('uploaded.emptyTitle')}
            </h3>
            <p className="text-white/50">{t('uploaded.emptyDescription')}</p>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (index % 6) * 0.05 }}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-night-800 cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <Image
                    src={image.url}
                    alt={image.title || 'Gallery image'}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    {image.title && (
                      <p className="text-white font-medium">{image.title}</p>
                    )}
                  </div>
                  {/* Zoom icon */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </motion.div>
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-10">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setVisibleCount(prev => prev + IMAGES_PER_PAGE)}
                  className="px-8 py-3 border border-gold-400/30 text-gold-400 rounded-full hover:bg-gold-400/10 transition-colors font-medium"
                >
                  {t('uploaded.loadMore')}
                </motion.button>
              </div>
            )}
          </>
        )}

        {/* Lightbox */}
        <AnimatePresence>
          {lightboxIndex !== null && filtered[lightboxIndex] && (
            <LightboxModal
              image={filtered[lightboxIndex]}
              onClose={closeLightbox}
              onPrev={prevImage}
              onNext={nextImage}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// --------------- Main Component ---------------

export default function GalleryContent() {
  const t = useTranslations('gallery');

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-night-900 to-night-700" />
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-gold-400/10 rounded-full blur-[200px] hidden md:block" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gold-400 text-sm tracking-[0.4em] uppercase mb-4">
              {t('preTitle')}
            </p>
            <h1
              className="text-5xl md:text-7xl font-bold text-white mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('pageTitle')} <span className="text-gradient-gold">{t('pageTitleHighlight')}</span>
            </h1>
            <p className="text-white/60 text-xl max-w-2xl">
              {t('heroDescription')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Instagram Feed */}
      <InstagramSection t={t} />

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="border-t border-white/10" />
      </div>

      {/* Uploaded Gallery */}
      <UploadedGallerySection t={t} />
    </div>
  );
}
