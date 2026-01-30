'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Legend, Match } from '@/lib/api';
import Flag from '@/components/Flag';
import SocialShare from '@/components/SocialShare';

// Types for different card variants
interface BaseShareCardProps {
  onClose?: () => void;
  className?: string;
}

interface LegendShareCardProps extends BaseShareCardProps {
  type: 'legend';
  data: Legend;
  shareUrl: string;
}

interface ProductShareCardProps extends BaseShareCardProps {
  type: 'product';
  data: {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    image?: string;
    category: string;
    rating: number;
  };
  shareUrl: string;
}

interface MatchShareCardProps extends BaseShareCardProps {
  type: 'match';
  data: Match;
  shareUrl: string;
}

interface PreviewShareCardProps extends BaseShareCardProps {
  type: 'preview';
  title: string;
  description: string;
  image?: string;
  siteName?: string;
  shareUrl: string;
}

type ShareCardProps =
  | LegendShareCardProps
  | ProductShareCardProps
  | MatchShareCardProps
  | PreviewShareCardProps;

// OG Preview Card Component
function OGPreviewCard({
  title,
  description,
  image,
  siteName = 'World Legends Cup',
  url,
}: {
  title: string;
  description: string;
  image?: string;
  siteName?: string;
  url: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl overflow-hidden max-w-md"
    >
      {/* Image Preview */}
      <div className="relative h-48 bg-gradient-to-br from-gold-500/20 to-night-800 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/wlc-text-logo.png"
              alt="WLC"
              className="w-32 opacity-50"
            />
          </div>
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-gold-400 text-xs uppercase tracking-wider mb-1">
          {siteName}
        </p>
        <h3
          className="text-white font-bold text-lg mb-2 line-clamp-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </h3>
        <p className="text-white/60 text-sm line-clamp-2 mb-3">
          {description}
        </p>
        <p className="text-white/40 text-xs truncate">
          {url}
        </p>
      </div>
    </motion.div>
  );
}

// Legend Share Card Component
function LegendCard({
  legend,
  shareUrl,
}: {
  legend: Legend;
  shareUrl: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Team colors
  const teamColors: Record<string, string> = {
    BR: '#009c3b',
    AR: '#75aadb',
    FR: '#002654',
    DE: '#000000',
    IT: '#008c45',
    NL: '#ff6f00',
    PT: '#006600',
    ES: '#c60b1e',
    GB: '#012169',
  };

  const teamColor = teamColors[legend.countryCode] || '#d4af37';
  const nameParts = legend.name.split(' ');
  const lastName = nameParts.slice(1).join(' ') || nameParts[0];

  const generateShareableImage = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsGenerating(true);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 1200;
    canvas.height = 630;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0A0A0A');
    gradient.addColorStop(1, '#050505');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Team color accent
    ctx.fillStyle = teamColor + '30';
    ctx.beginPath();
    ctx.arc(-100, canvas.height, 600, 0, Math.PI * 2);
    ctx.fill();

    // Gold accent
    ctx.fillStyle = '#D4AF3720';
    ctx.beginPath();
    ctx.arc(canvas.width + 100, 0, 400, 0, Math.PI * 2);
    ctx.fill();

    // Name
    ctx.font = 'bold 120px Bebas Neue, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.fillText(lastName.toUpperCase(), 60, canvas.height / 2);

    // Rating badge
    ctx.fillStyle = '#D4AF37';
    ctx.beginPath();
    ctx.roundRect(60, canvas.height / 2 + 40, 120, 50, 10);
    ctx.fill();
    ctx.font = 'bold 32px Bebas Neue, sans-serif';
    ctx.fillStyle = '#0A0A0A';
    ctx.fillText(`${legend.rating} OVR`, 80, canvas.height / 2 + 75);

    // Stats
    ctx.font = '24px Bebas Neue, sans-serif';
    ctx.fillStyle = '#FFFFFF80';
    ctx.fillText(
      `${legend.goals} GOALS  |  ${legend.assists} ASSISTS  |  ${legend.appearances} APPS`,
      60,
      canvas.height / 2 + 130
    );

    // Logo/Brand
    ctx.font = 'bold 28px Bebas Neue, sans-serif';
    ctx.fillStyle = '#D4AF37';
    ctx.textAlign = 'right';
    ctx.fillText('WORLD LEGENDS CUP 2026', canvas.width - 60, canvas.height - 40);

    // Side accent bar
    ctx.fillStyle = teamColor;
    ctx.fillRect(0, 0, 8, canvas.height);

    setIsGenerating(false);
  }, [legend, teamColor, lastName]);

  useEffect(() => {
    generateShareableImage();
  }, [generateShareableImage]);

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `${legend.name.replace(/\s+/g, '-').toLowerCase()}-wlc2026.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-2xl overflow-hidden max-w-2xl"
    >
      {/* Card Preview */}
      <div className="relative">
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${teamColor}30 0%, transparent 50%, transparent 100%)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-night-800/90 to-night-900/70" />

        <div className="relative p-6 flex gap-6">
          {/* Left - Stats */}
          <div className="flex-1">
            {/* Rating Badge */}
            <div className="mb-4">
              <span
                className={`inline-block px-4 py-2 rounded-lg text-lg font-bold ${
                  legend.rating >= 97
                    ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                    : legend.rating >= 95
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}
              >
                {legend.rating} RATING
              </span>
            </div>

            {/* Name */}
            <p className="text-white/60 text-sm">{nameParts[0]}</p>
            <h2
              className="text-4xl font-black text-white mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {lastName.toUpperCase()}
            </h2>

            {/* Country */}
            <div className="flex items-center gap-2 mb-6">
              <Flag countryCode={legend.countryCode} size="lg" />
              <span className="text-white/70">{legend.country}</span>
              <span className="text-white/30">|</span>
              <span className="text-white/50">{legend.position}</span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { value: legend.goals, label: 'Goals' },
                { value: legend.assists, label: 'Assists' },
                { value: legend.appearances, label: 'Apps' },
                { value: legend.worldCups, label: 'Titles' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p
                    className="text-2xl font-black text-gold-400"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-white/40 text-xs uppercase">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Image */}
          <div className="w-48 h-64 relative rounded-xl overflow-hidden">
            {legend.image ? (
              <img
                src={legend.image}
                alt={legend.name}
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-night-700">
                <span
                  className="text-6xl font-black text-white/10"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {legend.jerseyNumber}
                </span>
              </div>
            )}
            {/* Jersey Number Overlay */}
            <div className="absolute bottom-2 right-2">
              <span
                className="text-4xl font-black text-white/30"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {legend.jerseyNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Team Color Bar */}
        <div className="h-1" style={{ backgroundColor: teamColor }} />
      </div>

      {/* Share Actions */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <SocialShare
            url={shareUrl}
            title={`${legend.name} - World Legends Cup 2026`}
            description={`${legend.rating} rated ${legend.position} from ${legend.country}. ${legend.goals} goals, ${legend.assists} assists in ${legend.appearances} appearances.`}
            variant="compact"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadImage}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-night-900 font-semibold text-sm rounded-full hover:bg-gold-400 transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Image
          </motion.button>
        </div>
      </div>

      {/* Hidden Canvas for Image Generation */}
      <canvas ref={canvasRef} className="hidden" />
    </motion.div>
  );
}

// Product Share Card Component
function ProductCard({
  product,
  shareUrl,
}: {
  product: ProductShareCardProps['data'];
  shareUrl: string;
}) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-2xl overflow-hidden max-w-md"
    >
      {/* Product Image */}
      <div className="relative h-64 bg-gradient-to-br from-gold-500/20 to-night-800 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-8xl opacity-30">
              {product.category === 'Jerseys' ? '⚽' : '🛍️'}
            </span>
          </div>
        )}

        {/* Badges */}
        {discount > 0 && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
              -{discount}%
            </span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-gold-400 text-xs uppercase tracking-wider mb-1">
          {product.category}
        </p>
        <h3
          className="text-white font-bold text-xl mb-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {product.name.toUpperCase()}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
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
          <span className="text-white/50 text-sm">{product.rating}</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-3 mb-5">
          <span
            className="text-3xl font-bold text-gold-400"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-lg text-white/40 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Share Actions */}
        <div className="pt-4 border-t border-white/10">
          <SocialShare
            url={shareUrl}
            title={`${product.name} - World Legends Cup 2026 Official Merch`}
            description={`Get the official ${product.category} for $${product.price}!`}
            variant="compact"
          />
        </div>
      </div>
    </motion.div>
  );
}

// Match Share Card Component
function MatchCard({
  match,
  shareUrl,
}: {
  match: Match;
  shareUrl: string;
}) {
  const matchDate = new Date(match.matchDate);
  const formattedDate = matchDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const hasScore = match.homeScore !== null && match.awayScore !== null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-2xl overflow-hidden max-w-md"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-gold-500/20 to-transparent p-4">
        <div className="flex items-center justify-between">
          <span className="text-gold-400 text-sm font-semibold uppercase tracking-wider">
            {match.stage}
          </span>
          {match.isLive && (
            <span className="flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-400 text-sm font-semibold rounded-full">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              LIVE
            </span>
          )}
        </div>
      </div>

      {/* Teams */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          {/* Home Team */}
          <div className="flex-1 text-center">
            <Flag countryCode={match.homeCountryCode} size="xl" className="mx-auto mb-3" />
            <p
              className="text-white font-bold text-lg"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {match.homeTeam.toUpperCase()}
            </p>
          </div>

          {/* Score / VS */}
          <div className="px-6">
            {hasScore ? (
              <div className="flex items-center gap-2">
                <span
                  className="text-4xl font-black text-white"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {match.homeScore}
                </span>
                <span className="text-white/30 text-xl">-</span>
                <span
                  className="text-4xl font-black text-white"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {match.awayScore}
                </span>
              </div>
            ) : (
              <span
                className="text-3xl font-bold text-gold-400"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                VS
              </span>
            )}
          </div>

          {/* Away Team */}
          <div className="flex-1 text-center">
            <Flag countryCode={match.awayCountryCode} size="xl" className="mx-auto mb-3" />
            <p
              className="text-white font-bold text-lg"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {match.awayTeam.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Match Info */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center gap-4 text-white/50 text-sm">
          <span>{formattedDate}</span>
          <span className="w-1 h-1 bg-white/30 rounded-full" />
          <span>{match.matchTime}</span>
          <span className="w-1 h-1 bg-white/30 rounded-full" />
          <span>{match.venue}</span>
        </div>
      </div>

      {/* Share Actions */}
      <div className="p-4 border-t border-white/10">
        <SocialShare
          url={shareUrl}
          title={`${match.homeTeam} vs ${match.awayTeam} - World Legends Cup 2026`}
          description={`${match.stage} | ${formattedDate} at ${match.matchTime} | ${match.venue}`}
          variant="compact"
        />
      </div>
    </motion.div>
  );
}

// Main ShareCard Component
export default function ShareCard(props: ShareCardProps) {
  const { onClose, className = '' } = props;

  const renderCard = () => {
    switch (props.type) {
      case 'legend':
        return <LegendCard legend={props.data} shareUrl={props.shareUrl} />;
      case 'product':
        return <ProductCard product={props.data} shareUrl={props.shareUrl} />;
      case 'match':
        return <MatchCard match={props.data} shareUrl={props.shareUrl} />;
      case 'preview':
        return (
          <div>
            <OGPreviewCard
              title={props.title}
              description={props.description}
              image={props.image}
              siteName={props.siteName}
              url={props.shareUrl}
            />
            <div className="mt-4">
              <SocialShare
                url={props.shareUrl}
                title={props.title}
                description={props.description}
                variant="inline"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Close Button */}
      {onClose && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute -top-3 -right-3 w-8 h-8 bg-night-600 text-white rounded-full flex items-center justify-center hover:bg-night-500 transition-colors z-10"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>
      )}
      {renderCard()}
    </div>
  );
}

// Modal wrapper for ShareCard
export function ShareCardModal({
  isOpen,
  onClose,
  ...props
}: ShareCardProps & { isOpen: boolean }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-night-900/90 backdrop-blur-sm"
          />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative z-10"
          >
            <ShareCard {...props} onClose={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
