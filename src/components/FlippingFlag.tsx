'use client';

import { useState, useEffect, useRef } from 'react';
import Flag from '@/components/Flag';

const NATION_CODES = ['BR', 'AR', 'FR', 'IT', 'NL', 'NG', 'SA', 'ES'];
const FLIP_INTERVAL = 2000;
const FLIP_DURATION = 500;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Pick two different codes from the queue, refilling with a shuffle when needed */
function pickPair(queue: string[]): [string, string] {
  if (queue.length < 2) {
    queue.push(...shuffle(NATION_CODES));
  }
  const a = queue.shift()!;
  // Make sure b differs from a
  let bIdx = queue.findIndex(c => c !== a);
  if (bIdx === -1) {
    queue.push(...shuffle(NATION_CODES));
    bIdx = queue.findIndex(c => c !== a);
  }
  const b = queue.splice(bIdx, 1)[0];
  return [a, b];
}

interface SingleFlagProps {
  rotation: number;
  frontCode: string;
  backCode: string;
  size: 'sm' | 'lg';
}

function SingleFlip({ rotation, frontCode, backCode, size }: SingleFlagProps) {
  const flagSize = size === 'lg' ? 'xl' as const : 'md' as const;
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
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <Flag countryCode={frontCode} size={flagSize} />
        </div>
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <Flag countryCode={backCode} size={flagSize} />
        </div>
      </div>
    </div>
  );
}

/**
 * Renders a pair of flipping flags (home & away) that are guaranteed
 * to never show the same nation at the same time.
 * Returns [homeElement, awayElement] via render prop.
 */
export default function FlippingFlagPair({
  size,
  children,
}: {
  size: 'sm' | 'lg';
  children: (home: React.ReactNode, away: React.ReactNode) => React.ReactNode;
}) {
  const queueRef = useRef<string[]>(shuffle(NATION_CODES));

  // Each flag has: [frontCode, backCode]
  const [homeFlags, setHomeFlags] = useState<[string, string]>(['', '']);
  const [awayFlags, setAwayFlags] = useState<[string, string]>(['', '']);
  const [homeRotation, setHomeRotation] = useState(0);
  const [awayRotation, setAwayRotation] = useState(0);

  // Track which code is currently visible for each side
  const visibleRef = useRef<{ home: string; away: string }>({ home: '', away: '' });

  useEffect(() => {
    const q = queueRef.current;

    // Initial: pick two distinct pairs
    const [h1, a1] = pickPair(q);
    // For the back faces, pick codes that don't collide with visible fronts
    let h2 = q.shift() || shuffle(NATION_CODES)[0];
    let a2 = q.shift() || shuffle(NATION_CODES)[0];

    setHomeFlags([h1, h2]);
    setAwayFlags([a1, a2]);
    visibleRef.current = { home: h1, away: a1 };

    // Flip home flag on interval
    const homeDelay = Math.random() * FLIP_INTERVAL;
    let homeInterval: ReturnType<typeof setInterval>;
    const homeTimeout = setTimeout(() => {
      homeInterval = setInterval(() => {
        setHomeRotation(prev => {
          const next = prev + 180;
          // After flip completes, update the now-hidden face
          setTimeout(() => {
            // The face that just became visible
            const backIsVisible = (next / 180) % 2 === 1;
            if (backIsVisible) {
              setHomeFlags(cur => {
                visibleRef.current.home = cur[1];
                return cur;
              });
            } else {
              setHomeFlags(cur => {
                visibleRef.current.home = cur[0];
                return cur;
              });
            }
            // Pick a new code for the hidden face, avoiding what away is showing
            const newCode = pickAvoidingCode(q, visibleRef.current.away);
            if (backIsVisible) {
              // Front is hidden, update it
              setHomeFlags(cur => [newCode, cur[1]]);
            } else {
              // Back is hidden, update it
              setHomeFlags(cur => [cur[0], newCode]);
            }
          }, FLIP_DURATION);
          return next;
        });
      }, FLIP_INTERVAL);
    }, homeDelay);

    // Flip away flag on interval (offset so they don't flip in sync)
    const awayDelay = Math.random() * FLIP_INTERVAL;
    let awayInterval: ReturnType<typeof setInterval>;
    const awayTimeout = setTimeout(() => {
      awayInterval = setInterval(() => {
        setAwayRotation(prev => {
          const next = prev + 180;
          setTimeout(() => {
            const backIsVisible = (next / 180) % 2 === 1;
            if (backIsVisible) {
              setAwayFlags(cur => {
                visibleRef.current.away = cur[1];
                return cur;
              });
            } else {
              setAwayFlags(cur => {
                visibleRef.current.away = cur[0];
                return cur;
              });
            }
            const newCode = pickAvoidingCode(q, visibleRef.current.home);
            if (backIsVisible) {
              setAwayFlags(cur => [newCode, cur[1]]);
            } else {
              setAwayFlags(cur => [cur[0], newCode]);
            }
          }, FLIP_DURATION);
          return next;
        });
      }, FLIP_INTERVAL);
    }, awayDelay);

    return () => {
      clearTimeout(homeTimeout);
      clearTimeout(awayTimeout);
      if (homeInterval) clearInterval(homeInterval);
      if (awayInterval) clearInterval(awayInterval);
    };
  }, []);

  if (!homeFlags[0]) return null;

  const home = (
    <SingleFlip rotation={homeRotation} frontCode={homeFlags[0]} backCode={homeFlags[1]} size={size} />
  );
  const away = (
    <SingleFlip rotation={awayRotation} frontCode={awayFlags[0]} backCode={awayFlags[1]} size={size} />
  );

  return <>{children(home, away)}</>;
}

/** Pick a code from the queue that differs from `avoid` */
function pickAvoidingCode(queue: string[], avoid: string): string {
  if (queue.length === 0) {
    queue.push(...shuffle(NATION_CODES));
  }
  const idx = queue.findIndex(c => c !== avoid);
  if (idx !== -1) {
    return queue.splice(idx, 1)[0];
  }
  // Fallback: refill and try again
  queue.push(...shuffle(NATION_CODES));
  const idx2 = queue.findIndex(c => c !== avoid);
  return queue.splice(idx2 !== -1 ? idx2 : 0, 1)[0];
}
