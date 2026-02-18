'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from '@/i18n/navigation';
import Image from 'next/image';

export default function PageTransition() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const isFirst = useRef(true);

  useEffect(() => {
    // Skip the initial render — splash handles that
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    setShow(true);
    const timer = setTimeout(() => setShow(false), 1200);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key={pathname}
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-night-900/95"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="trophy-glow"
          >
            <Image
              src="/legends-cup.png"
              alt=""
              width={160}
              height={240}
              className="drop-shadow-[0_0_40px_rgba(212,175,55,0.6)]"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
