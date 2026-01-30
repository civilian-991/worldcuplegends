'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

// =============================================================================
// BAR CHART COMPONENT
// =============================================================================

export interface BarChartData {
  label: string;
  value: number;
  color?: string;
  icon?: React.ReactNode;
}

export interface BarChartProps {
  data: BarChartData[];
  title?: string;
  maxValue?: number;
  showValues?: boolean;
  orientation?: 'horizontal' | 'vertical';
  height?: number;
  delay?: number;
}

export function BarChart({
  data,
  title,
  maxValue,
  showValues = true,
  orientation = 'horizontal',
  height = 300,
  delay = 0,
}: BarChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const max = maxValue || Math.max(...data.map(d => d.value));

  if (orientation === 'vertical') {
    return (
      <div ref={ref} className="glass rounded-2xl p-6">
        {title && (
          <h3
            className="text-lg font-bold text-white mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {title}
          </h3>
        )}

        <div className="flex items-end justify-between gap-2" style={{ height }}>
          {data.map((item, index) => {
            const percentage = (item.value / max) * 100;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={index}
                className="flex-1 flex flex-col items-center gap-2 relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Tooltip */}
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-night-600 rounded-lg text-sm whitespace-nowrap z-10"
                  >
                    <span className="text-gold-400 font-bold">{item.value}</span>
                    <span className="text-white/60 ml-1">{item.label}</span>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-night-600 rotate-45" />
                  </motion.div>
                )}

                {/* Value */}
                {showValues && (
                  <span className="text-sm text-gold-400 font-semibold">
                    {item.value}
                  </span>
                )}

                {/* Bar */}
                <div className="w-full bg-night-600 rounded-t-lg overflow-hidden relative" style={{ height: '100%' }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={isInView ? { height: `${percentage}%` } : { height: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: delay + index * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`absolute bottom-0 left-0 right-0 rounded-t-lg transition-all duration-300 ${
                      isHovered ? 'brightness-125' : ''
                    }`}
                    style={{
                      background: item.color || 'linear-gradient(to top, #D4AF37, #F5C542)',
                      boxShadow: isHovered ? '0 0 20px rgba(212, 175, 55, 0.5)' : 'none',
                    }}
                  />
                </div>

                {/* Label */}
                <span className="text-xs text-white/60 text-center mt-2 truncate w-full">
                  {item.icon || item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Horizontal orientation
  return (
    <div ref={ref} className="glass rounded-2xl p-6">
      {title && (
        <h3
          className="text-lg font-bold text-white mb-6"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </h3>
      )}

      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = (item.value / max) * 100;
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={index}
              className="relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Label Row */}
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span className="text-sm text-white/80">{item.label}</span>
                </div>
                {showValues && (
                  <span className={`text-sm font-bold transition-colors ${isHovered ? 'text-gold-400' : 'text-white/60'}`}>
                    {item.value}
                  </span>
                )}
              </div>

              {/* Bar */}
              <div className="h-3 bg-night-600 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${percentage}%` } : { width: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: delay + index * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`h-full rounded-full transition-all duration-300 ${
                    isHovered ? 'brightness-125' : ''
                  }`}
                  style={{
                    background: item.color || 'linear-gradient(to right, #D4AF37, #F5C542)',
                    boxShadow: isHovered ? '0 0 15px rgba(212, 175, 55, 0.5)' : 'none',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================================
// DONUT CHART COMPONENT
// =============================================================================

export interface DonutChartData {
  label: string;
  value: number;
  color: string;
}

export interface DonutChartProps {
  data: DonutChartData[];
  title?: string;
  size?: number;
  strokeWidth?: number;
  showLegend?: boolean;
  centerLabel?: string;
  centerValue?: string | number;
  delay?: number;
}

export function DonutChart({
  data,
  title,
  size = 200,
  strokeWidth = 24,
  showLegend = true,
  centerLabel,
  centerValue,
  delay = 0,
}: DonutChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedOffset = 0;

  return (
    <div ref={ref} className="glass rounded-2xl p-6">
      {title && (
        <h3
          className="text-lg font-bold text-white mb-6"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </h3>
      )}

      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Donut SVG */}
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth={strokeWidth}
            />

            {/* Data Segments */}
            {data.map((item, index) => {
              const percentage = item.value / total;
              const strokeDasharray = circumference * percentage;
              const strokeDashoffset = -accumulatedOffset * circumference;
              const currentOffset = accumulatedOffset;
              accumulatedOffset += percentage;

              const isHovered = hoveredIndex === index;

              return (
                <motion.circle
                  key={index}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={item.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={`${strokeDasharray} ${circumference}`}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-300 cursor-pointer"
                  style={{
                    filter: isHovered ? 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.5))' : 'none',
                  }}
                  initial={{ strokeDasharray: `0 ${circumference}` }}
                  animate={isInView ? { strokeDasharray: `${strokeDasharray} ${circumference}` } : {}}
                  transition={{
                    duration: 1,
                    delay: delay + index * 0.2,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })}
          </svg>

          {/* Center Content */}
          {(centerLabel || centerValue) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {centerValue && (
                <span
                  className="text-3xl font-bold text-gold-400"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {centerValue}
                </span>
              )}
              {centerLabel && (
                <span className="text-sm text-white/60 uppercase tracking-wider">
                  {centerLabel}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="flex flex-col gap-3">
            {data.map((item, index) => {
              const percentage = ((item.value / total) * 100).toFixed(1);
              const isHovered = hoveredIndex === index;

              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 transition-all duration-300 cursor-pointer ${
                    isHovered ? 'scale-105' : ''
                  }`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className={`text-sm transition-colors ${isHovered ? 'text-white' : 'text-white/70'}`}>
                    {item.label}
                  </span>
                  <span className={`text-sm font-bold transition-colors ${isHovered ? 'text-gold-400' : 'text-white/50'}`}>
                    {item.value} ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// LINE CHART COMPONENT
// =============================================================================

export interface LineChartData {
  label: string;
  value: number;
}

export interface LineChartProps {
  data: LineChartData[];
  title?: string;
  height?: number;
  showPoints?: boolean;
  showArea?: boolean;
  color?: string;
  delay?: number;
}

export function LineChart({
  data,
  title,
  height = 200,
  showPoints = true,
  showArea = true,
  color = '#D4AF37',
  delay = 0,
}: LineChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const padding = { top: 20, right: 20, bottom: 40, left: 20 };
  const chartWidth = 100; // Percentage-based
  const chartHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = ((maxValue - item.value) / range) * chartHeight + padding.top;
    return { x, y, ...item };
  });

  const pathD = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x}% ${point.y}`)
    .join(' ');

  const areaD = `${pathD} L 100% ${height - padding.bottom} L 0% ${height - padding.bottom} Z`;

  return (
    <div ref={ref} className="glass rounded-2xl p-6">
      {title && (
        <h3
          className="text-lg font-bold text-white mb-6"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </h3>
      )}

      <div className="relative" style={{ height }}>
        <svg
          width="100%"
          height={height}
          className="overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Grid Lines */}
          {[0, 25, 50, 75, 100].map((percent) => (
            <line
              key={percent}
              x1="0%"
              y1={padding.top + (chartHeight * percent) / 100}
              x2="100%"
              y2={padding.top + (chartHeight * percent) / 100}
              stroke="rgba(255,255,255,0.05)"
              strokeDasharray="4 4"
            />
          ))}

          {/* Area */}
          {showArea && (
            <motion.path
              d={areaD}
              fill={`url(#areaGradient-${delay})`}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1, delay }}
            />
          )}

          {/* Line */}
          <motion.path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 1.5, delay, ease: [0.16, 1, 0.3, 1] }}
            style={{ filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.5))' }}
          />

          {/* Points */}
          {showPoints && points.map((point, index) => {
            const isHovered = hoveredIndex === index;

            return (
              <g key={index}>
                <motion.circle
                  cx={`${point.x}%`}
                  cy={point.y}
                  r={isHovered ? 8 : 5}
                  fill={isHovered ? color : 'var(--color-night-700)'}
                  stroke={color}
                  strokeWidth={2}
                  className="cursor-pointer transition-all duration-300"
                  style={{
                    filter: isHovered ? 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.7))' : 'none',
                  }}
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ duration: 0.3, delay: delay + 0.5 + index * 0.1 }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </g>
            );
          })}

          {/* Gradient Definition */}
          <defs>
            <linearGradient id={`areaGradient-${delay}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Tooltip */}
        {hoveredIndex !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute px-3 py-2 bg-night-600 rounded-lg text-sm whitespace-nowrap z-10 pointer-events-none"
            style={{
              left: `${points[hoveredIndex].x}%`,
              top: points[hoveredIndex].y - 50,
              transform: 'translateX(-50%)',
            }}
          >
            <span className="text-gold-400 font-bold">{points[hoveredIndex].value}</span>
            <span className="text-white/60 ml-1">{points[hoveredIndex].label}</span>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-night-600 rotate-45" />
          </motion.div>
        )}

        {/* X-axis Labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
          {data.map((item, index) => (
            <span
              key={index}
              className="text-xs text-white/40 truncate"
              style={{ maxWidth: `${100 / data.length}%` }}
            >
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MINI STAT BAR (inline stat with bar)
// =============================================================================

export interface MiniStatBarProps {
  label: string;
  value: number;
  maxValue: number;
  suffix?: string;
  color?: string;
  delay?: number;
}

export function MiniStatBar({
  label,
  value,
  maxValue,
  suffix = '',
  color,
  delay = 0,
}: MiniStatBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const percentage = (value / maxValue) * 100;

  return (
    <div ref={ref} className="flex items-center gap-4">
      <span className="text-sm text-white/70 w-24 truncate">{label}</span>
      <div className="flex-1 h-2 bg-night-600 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${percentage}%` } : { width: 0 }}
          transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full"
          style={{
            background: color || 'linear-gradient(to right, #D4AF37, #F5C542)',
          }}
        />
      </div>
      <span className="text-sm text-gold-400 font-semibold w-16 text-right">
        {value}{suffix}
      </span>
    </div>
  );
}
