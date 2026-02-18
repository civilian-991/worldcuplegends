'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const SPLASH_DURATION = 1800;

export default function SplashScreen() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('splash-shown')) return;
    setShow(true);
    sessionStorage.setItem('splash-shown', '1');
    const timer = setTimeout(() => setShow(false), SPLASH_DURATION);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-night-900"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, duration: 0.6 }}
            className="trophy-glow"
          >
            <Image
              src="/legends-cup.png"
              alt="World Cup Legends Trophy"
              width={220}
              height={320}
              priority
              className="drop-shadow-[0_0_40px_rgba(212,175,55,0.6)]"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
