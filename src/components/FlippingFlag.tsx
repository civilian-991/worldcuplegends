'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Flag from '@/components/Flag';

const NATION_CODES = ['BR', 'AR', 'FR', 'IT', 'NL', 'NG', 'SA', 'ES'];
const FLIP_INTERVAL = 2000;
const FLIP_DURATION = 500;

// Shuffle an array (Fisher-Yates)
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * FlippingFlag that cycles through tournament nations.
 * When used as a pair (pairId="home"/"away" with shared excludeRef),
 * the two instances will never show the same flag simultaneously.
 */
export default function FlippingFlag({
  size,
  excludeRef,
  pairId,
}: {
  size: 'sm' | 'lg';
  excludeRef?: React.MutableRefObject<Record<string, string>>;
  pairId?: string;
}) {
  const [rotation, setRotation] = useState(0);
  const [frontFlag, setFrontFlag] = useState('');
  const [backFlag, setBackFlag] = useState('');
  const queueRef = useRef<string[]>([]);
  const initializedRef = useRef(false);

  const pickNext = useCallback(() => {
    if (queueRef.current.length === 0) {
      queueRef.current = shuffle(NATION_CODES);
    }
    // If paired, avoid the code currently shown by the other side
    if (excludeRef && pairId) {
      const otherKey = pairId === 'home' ? 'away' : 'home';
      const otherCode = excludeRef.current[otherKey];
      // Try to find one that doesn't match
      const idx = queueRef.current.findIndex(c => c !== otherCode);
      if (idx !== -1) {
        return queueRef.current.splice(idx, 1)[0];
      }
    }
    return queueRef.current.shift()!;
  }, [excludeRef, pairId]);

  // Register current visible flag with the shared ref
  const register = useCallback(
    (code: string) => {
      if (excludeRef && pairId) {
        excludeRef.current[pairId] = code;
      }
    },
    [excludeRef, pairId]
  );

  useEffect(() => {
    if (!initializedRef.current) {
      const first = pickNext();
      const second = pickNext();
      setFrontFlag(first);
      setBackFlag(second);
      register(first);
      initializedRef.current = true;
    }

    const delay = Math.random() * FLIP_INTERVAL;
    let intervalId: ReturnType<typeof setInterval>;

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        setRotation(prev => {
          const next = prev + 180;
          setTimeout(() => {
            const nextCode = pickNext();
            if ((next / 180) % 2 === 1) {
              // Back face is now visible — update hidden front for next flip
              setFrontFlag(nextCode);
            } else {
              // Front face is now visible — update hidden back for next flip
              setBackFlag(nextCode);
            }
          }, FLIP_DURATION);

          // Register whichever face is about to become visible
          setTimeout(() => {
            if ((next / 180) % 2 === 1) {
              // Back face just became visible
              setBackFlag(cur => { register(cur); return cur; });
            } else {
              setFrontFlag(cur => { register(cur); return cur; });
            }
          }, FLIP_DURATION / 2);

          return next;
        });
      }, FLIP_INTERVAL);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flagSize = size === 'lg' ? 'xl' : 'md';
  const containerClass = size === 'lg'
    ? 'w-12 h-12 md:w-14 md:h-14'
    : 'w-8 h-8';

  if (!frontFlag) return <div className={containerClass} />;

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
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <Flag countryCode={frontFlag} size={flagSize} />
        </div>
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <Flag countryCode={backFlag} size={flagSize} />
        </div>
      </div>
    </div>
  );
}
