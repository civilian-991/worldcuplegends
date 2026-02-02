'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, SESSION_TIMEOUT_MS, SESSION_WARNING_MS } from '@/context/AuthContext';

/**
 * SessionTimeoutWarning Component
 *
 * Displays a warning modal when the user's session is about to expire due to inactivity.
 * Allows users to extend their session or logout.
 */
export default function SessionTimeoutWarning() {
  const { user, lastActivity, resetActivity, logout } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  // Calculate time until session expires
  const calculateTimeRemaining = useCallback(() => {
    const now = Date.now();
    const timeSinceActivity = now - lastActivity;
    const timeUntilTimeout = SESSION_TIMEOUT_MS - timeSinceActivity;
    return Math.max(0, Math.ceil(timeUntilTimeout / 1000));
  }, [lastActivity]);

  // Check if we should show the warning
  useEffect(() => {
    if (!user) {
      setShowWarning(false);
      return;
    }

    const checkWarning = () => {
      const now = Date.now();
      const timeSinceActivity = now - lastActivity;
      const timeUntilTimeout = SESSION_TIMEOUT_MS - timeSinceActivity;

      // Show warning if within the warning window
      if (timeUntilTimeout <= SESSION_WARNING_MS && timeUntilTimeout > 0) {
        setShowWarning(true);
        setRemainingSeconds(Math.ceil(timeUntilTimeout / 1000));
      } else if (timeUntilTimeout <= 0) {
        // Session expired
        setShowWarning(false);
      } else {
        setShowWarning(false);
      }
    };

    // Check immediately
    checkWarning();

    // Check every second when warning might be needed
    const interval = setInterval(checkWarning, 1000);

    return () => clearInterval(interval);
  }, [user, lastActivity]);

  // Update countdown
  useEffect(() => {
    if (!showWarning) return;

    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setRemainingSeconds(remaining);

      if (remaining <= 0) {
        setShowWarning(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [showWarning, calculateTimeRemaining]);

  // Handle extending the session
  const handleExtendSession = () => {
    resetActivity();
    setShowWarning(false);
  };

  // Handle logout
  const handleLogout = async () => {
    setShowWarning(false);
    await logout();
  };

  // Format time remaining
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    return `${secs} seconds`;
  };

  if (!user) return null;

  return (
    <AnimatePresence>
      {showWarning && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={handleExtendSession}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-md mx-4"
          >
            <div className="glass rounded-2xl p-8 border border-gold-500/20">
              {/* Warning Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-yellow-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h2
                className="text-2xl font-bold text-white text-center mb-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Session Expiring Soon
              </h2>

              {/* Message */}
              <p className="text-white/60 text-center mb-6">
                Your session will expire in{' '}
                <span className="text-yellow-400 font-semibold">
                  {formatTime(remainingSeconds)}
                </span>{' '}
                due to inactivity. Would you like to stay logged in?
              </p>

              {/* Progress bar */}
              <div className="w-full h-2 bg-night-700 rounded-full overflow-hidden mb-6">
                <motion.div
                  className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400"
                  initial={{ width: '100%' }}
                  animate={{
                    width: `${(remainingSeconds / (SESSION_WARNING_MS / 1000)) * 100}%`,
                  }}
                  transition={{ duration: 1, ease: 'linear' }}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleLogout}
                  className="flex-1 py-3 px-4 bg-night-700 hover:bg-night-600 text-white/70 hover:text-white rounded-xl font-medium transition-colors"
                >
                  Log Out
                </button>
                <button
                  onClick={handleExtendSession}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl hover:from-gold-400 hover:to-gold-500 transition-colors"
                >
                  Stay Logged In
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
