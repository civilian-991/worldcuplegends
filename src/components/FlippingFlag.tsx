'use client';

import { useState, useEffect, useRef } from 'react';
import Flag from '@/components/Flag';

const NATION_CODES = ['BR', 'DE', 'AR', 'FR', 'IT', 'NL', 'ES', 'GB'];
const FLIP_INTERVAL = 2000;
const FLIP_DURATION = 500;

export default function FlippingFlag({ size }: { size: 'sm' | 'lg' }) {
  const [rotation, setRotation] = useState(0);
  const [frontFlag, setFrontFlag] = useState(0);
  const [backFlag, setBackFlag] = useState(1);
  const nextFlagRef = useRef(2);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      const startIdx = Math.floor(Math.random() * NATION_CODES.length);
      setFrontFlag(startIdx);
      setBackFlag((startIdx + 1) % NATION_CODES.length);
      nextFlagRef.current = (startIdx + 2) % NATION_CODES.length;
      initializedRef.current = true;
    }

    const delay = Math.random() * FLIP_INTERVAL;
    let intervalId: ReturnType<typeof setInterval>;

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        setRotation(prev => {
          const next = prev + 180;
          // After flip animation, update the now-hidden face for the next flip
          setTimeout(() => {
            if ((next / 180) % 2 === 1) {
              setFrontFlag(nextFlagRef.current);
            } else {
              setBackFlag(nextFlagRef.current);
            }
            nextFlagRef.current = (nextFlagRef.current + 1) % NATION_CODES.length;
          }, FLIP_DURATION);
          return next;
        });
      }, FLIP_INTERVAL);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const flagSize = size === 'lg' ? 'xl' : 'md';
  const containerClass = size === 'lg'
    ? 'w-12 h-12 md:w-14 md:h-14'
    : 'w-8 h-8';

  return (
    <div className={`${containerClass} relative`} style={{ perspective: '400px' }}>
      <div
        className="w-full h-full relative"
        style={{
          transformStyle: 'preserve-3d',
          transition: `transform ${FLIP_DURATION}ms ease-in-out`,
          transform: `rotateY(${rotation}deg)`,
        }}
      >
        {/* Front face */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <Flag countryCode={NATION_CODES[frontFlag]} size={flagSize} />
        </div>
        {/* Back face */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <Flag countryCode={NATION_CODES[backFlag]} size={flagSize} />
        </div>
      </div>
    </div>
  );
}
