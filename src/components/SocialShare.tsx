'use client';

import { useState, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useToast } from '@/context/ToastContext';

// Platform types
interface PlatformBase {
  name: string;
  icon: ReactNode;
  color: string;
  hoverColor: string;
}

interface ShareablePlatform extends PlatformBase {
  getShareUrl: (url: string, text: string) => string;
}

interface CopyPlatform extends PlatformBase {
  getShareUrl?: never;
}

type Platform = ShareablePlatform | CopyPlatform;

// Platform configuration with brand colors
const platforms: Record<string, Platform> = {
  twitter: {
    name: 'X (Twitter)',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    color: '#000000',
    hoverColor: '#1a1a1a',
    getShareUrl: (url: string, text: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  facebook: {
    name: 'Facebook',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    color: '#1877F2',
    hoverColor: '#166FE5',
    getShareUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  whatsapp: {
    name: 'WhatsApp',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    color: '#25D366',
    hoverColor: '#20BD5A',
    getShareUrl: (url: string, text: string) =>
      `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
  },
  linkedin: {
    name: 'LinkedIn',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    color: '#0A66C2',
    hoverColor: '#004182',
    getShareUrl: (url: string, text: string) =>
      `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
  },
  copy: {
    name: 'Copy Link',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    color: '#D4AF37',
    hoverColor: '#F5C542',
  },
};

type PlatformKey = 'twitter' | 'facebook' | 'whatsapp' | 'linkedin' | 'copy';

export interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
  variant?: 'floating' | 'inline' | 'compact';
  showCounts?: boolean;
  className?: string;
}

// Mock share counts for display
const mockShareCounts: Record<PlatformKey, number> = {
  twitter: 1247,
  facebook: 3891,
  whatsapp: 892,
  linkedin: 456,
  copy: 0,
};

const platformKeys: PlatformKey[] = ['twitter', 'facebook', 'whatsapp', 'linkedin', 'copy'];

export default function SocialShare({
  url,
  title,
  description = '',
  variant = 'inline',
  showCounts = false,
  className = '',
}: SocialShareProps) {
  const { showToast } = useToast();
  const [copiedState, setCopiedState] = useState(false);
  const [activeRipple, setActiveRipple] = useState<string | null>(null);
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);

  const shareText = description || title;

  const handleShare = useCallback(
    async (platform: PlatformKey) => {
      // Trigger ripple effect
      setActiveRipple(platform);
      setTimeout(() => setActiveRipple(null), 600);

      if (platform === 'copy') {
        try {
          await navigator.clipboard.writeText(url);
          setCopiedState(true);
          showToast('Link copied to clipboard!', 'success');
          setTimeout(() => setCopiedState(false), 2000);
        } catch {
          showToast('Failed to copy link', 'error');
        }
        return;
      }

      const platformConfig = platforms[platform];
      if ('getShareUrl' in platformConfig && platformConfig.getShareUrl) {
        const shareUrl = platformConfig.getShareUrl(url, shareText);
        window.open(shareUrl, '_blank', 'width=600,height=400,noopener,noreferrer');
      }
    },
    [url, title, shareText, showToast]
  );

  const formatCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const buttonVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 260,
        damping: 20,
      },
    },
  };

  const renderButton = (platform: PlatformKey, index: number) => {
    const config = platforms[platform];
    const isHovered = hoveredPlatform === platform;
    const isCopied = platform === 'copy' && copiedState;
    const isRippling = activeRipple === platform;

    return (
      <motion.div
        key={platform}
        variants={buttonVariants}
        className="relative"
        onMouseEnter={() => setHoveredPlatform(platform)}
        onMouseLeave={() => setHoveredPlatform(null)}
      >
        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && variant !== 'compact' && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-night-600 text-white text-xs font-medium rounded-lg whitespace-nowrap z-50 pointer-events-none"
            >
              {isCopied ? 'Copied!' : config.name}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-night-600 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleShare(platform)}
          className={`
            relative overflow-hidden rounded-full transition-all duration-300
            ${variant === 'compact' ? 'w-10 h-10' : 'w-12 h-12'}
            ${variant === 'floating' ? 'shadow-lg' : ''}
            flex items-center justify-center
          `}
          style={{
            backgroundColor: isHovered ? config.hoverColor : config.color,
            boxShadow: isHovered ? `0 0 20px ${config.color}40` : 'none',
          }}
          aria-label={`Share on ${config.name}`}
        >
          {/* Ripple Effect */}
          <AnimatePresence>
            {isRippling && (
              <motion.div
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 4, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 bg-white rounded-full"
                style={{ transformOrigin: 'center' }}
              />
            )}
          </AnimatePresence>

          {/* Icon with success checkmark animation */}
          <AnimatePresence mode="wait">
            {isCopied ? (
              <motion.div
                key="check"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="text-night-900"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            ) : (
              <motion.div
                key="icon"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className={platform === 'copy' ? 'text-night-900' : 'text-white'}
              >
                {config.icon}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Share Count */}
        {showCounts && platform !== 'copy' && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="block text-center text-xs text-white/50 mt-1"
          >
            {formatCount(mockShareCounts[platform])}
          </motion.span>
        )}
      </motion.div>
    );
  };

  // Floating variant - fixed position on screen
  if (variant === 'floating') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className={`fixed left-6 top-1/2 -translate-y-1/2 z-40 ${className}`}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-3 p-3 glass rounded-2xl"
        >
          {/* Share Label */}
          <div className="text-center mb-1">
            <span
              className="text-xs text-gold-400 uppercase tracking-wider font-semibold"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Share
            </span>
          </div>
          {platformKeys.map((platform, index) =>
            renderButton(platform, index)
          )}
        </motion.div>
      </motion.div>
    );
  }

  // Inline variant - horizontal layout
  if (variant === 'inline') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`flex items-center gap-4 ${className}`}
      >
        <span
          className="text-white/60 text-sm uppercase tracking-wider"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Share
        </span>
        <div className="flex items-center gap-3">
          {platformKeys.map((platform, index) =>
            renderButton(platform, index)
          )}
        </div>
      </motion.div>
    );
  }

  // Compact variant - smaller buttons, no labels
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`flex items-center gap-2 ${className}`}
    >
      {(Object.keys(platforms) as PlatformKey[]).map((platform, index) =>
        renderButton(platform, index)
      )}
    </motion.div>
  );
}

// Export a share button that can be used standalone
export function ShareButton({
  url,
  title,
  className = '',
}: {
  url: string;
  title: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full glass-gold flex items-center justify-center text-gold-400 hover:text-gold-300 transition-colors glow-gold-sm"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="absolute right-0 top-full mt-3 z-50 glass rounded-2xl p-4"
            >
              <SocialShare
                url={url}
                title={title}
                variant="compact"
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
