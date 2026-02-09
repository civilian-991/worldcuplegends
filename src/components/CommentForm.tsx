'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';
import { escapeHtml } from '@/lib/sanitize';

interface CommentFormProps {
  entityType: 'legend' | 'news' | 'match';
  entityId: number;
  onCommentAdd: (content: string) => void;
  parentId?: string;
  onCancel?: () => void;
  placeholder?: string;
  compact?: boolean;
}

// Character limit for comments
const MAX_CHARACTERS = 1000;

// Mock users for @ mention autocomplete
const mockUsers = [
  { id: '1', name: 'Carlos Mendez', avatar: null },
  { id: '2', name: 'Maria Santos', avatar: null },
  { id: '3', name: 'James Wilson', avatar: null },
  { id: '4', name: 'Roberto Baggio Fan', avatar: null },
  { id: '5', name: 'Football Historian', avatar: null },
  { id: '6', name: 'Legends United', avatar: null },
  { id: '7', name: 'WorldCup2026', avatar: null },
];

// Generate initials from name
function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function CommentForm({
  entityType,
  entityId,
  onCommentAdd,
  parentId,
  onCancel,
  placeholder = 'Share your thoughts...',
  compact = false,
}: CommentFormProps) {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionIndex, setMentionIndex] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mentionMenuRef = useRef<HTMLDivElement>(null);

  const charactersLeft = MAX_CHARACTERS - content.length;
  const isOverLimit = charactersLeft < 0;
  const canSubmit = content.trim().length > 0 && !isOverLimit && !isSubmitting;

  // Filter users for mention autocomplete
  const filteredUsers = mentionQuery
    ? mockUsers.filter((u) =>
        u.name.toLowerCase().includes(mentionQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  // Handle content change with mention detection
  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    const newPosition = e.target.selectionStart || 0;

    setContent(newContent);
    setCursorPosition(newPosition);

    // Detect @ mentions
    const textBeforeCursor = newContent.slice(0, newPosition);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

    if (mentionMatch) {
      setMentionQuery(mentionMatch[1]);
      setMentionIndex(0);
    } else {
      setMentionQuery(null);
    }
  }, []);

  // Insert mention
  const insertMention = useCallback((userName: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const textBeforeCursor = content.slice(0, cursorPosition);
    const textAfterCursor = content.slice(cursorPosition);

    // Find the @ symbol position
    const atIndex = textBeforeCursor.lastIndexOf('@');
    const beforeMention = content.slice(0, atIndex);

    const newContent = `${beforeMention}@${userName} ${textAfterCursor}`;
    setContent(newContent);
    setMentionQuery(null);

    // Set cursor after the inserted mention
    setTimeout(() => {
      const newPosition = atIndex + userName.length + 2;
      textarea.setSelectionRange(newPosition, newPosition);
      textarea.focus();
    }, 0);
  }, [content, cursorPosition]);

  // Handle keyboard navigation in mention menu
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (mentionQuery !== null && filteredUsers.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setMentionIndex((prev) => Math.min(prev + 1, filteredUsers.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setMentionIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        insertMention(filteredUsers[mentionIndex].name);
      } else if (e.key === 'Escape') {
        setMentionQuery(null);
      }
    }
  }, [mentionQuery, filteredUsers, mentionIndex, insertMention]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showToast('Please log in to comment', 'error');
      return;
    }

    if (!canSubmit) return;

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      onCommentAdd(content.trim());
      setContent('');
      setShowPreview(false);
      setIsFocused(false);
    } catch {
      showToast('Failed to post comment. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  // Close mention menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mentionMenuRef.current && !mentionMenuRef.current.contains(e.target as Node)) {
        setMentionQuery(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Unauthenticated state
  if (!isAuthenticated) {
    return (
      <div className={`glass rounded-xl ${compact ? 'p-4' : 'p-6'}`}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-night-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-white/60 mb-2">Join the discussion!</p>
            <div className="flex gap-3">
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold text-sm rounded-lg"
                >
                  Log In
                </motion.button>
              </Link>
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 glass-gold text-gold-400 text-sm rounded-lg"
                >
                  Sign Up
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={compact ? { opacity: 0, y: -10 } : false}
      animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-xl transition-all duration-300 ${
        isFocused ? 'ring-2 ring-gold-500/30' : ''
      } ${compact ? 'p-4' : 'p-6'}`}
    >
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          {/* User Avatar */}
          <div className="flex-shrink-0">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt={`${user.firstName} ${user.lastName}`}
                width={40}
                height={40}
                className="rounded-full object-cover ring-2 ring-gold-500/20"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500/30 to-gold-600/30 flex items-center justify-center text-gold-400 font-bold text-sm ring-2 ring-gold-500/20">
                {user ? getInitials(`${user.firstName} ${user.lastName}`) : '??'}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex-1 min-w-0">
            {/* Preview Mode */}
            <AnimatePresence mode="wait">
              {showPreview ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="min-h-[80px] p-4 bg-night-600 rounded-xl border border-gold-500/10"
                >
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Preview</p>
                  <p className="text-white/80 whitespace-pre-wrap break-words">{escapeHtml(content)}</p>
                </motion.div>
              ) : (
                <motion.div
                  key="editor"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative"
                >
                  <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={handleContentChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => !mentionQuery && setIsFocused(false)}
                    placeholder={placeholder}
                    rows={compact ? 2 : 3}
                    maxLength={MAX_CHARACTERS + 100} // Allow slight overflow for visual feedback
                    className="w-full px-4 py-3 bg-night-600 border border-gold-500/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/30 transition-colors resize-none overflow-hidden"
                    style={{ minHeight: compact ? '60px' : '80px' }}
                  />

                  {/* Mention Autocomplete Menu */}
                  <AnimatePresence>
                    {mentionQuery !== null && filteredUsers.length > 0 && (
                      <motion.div
                        ref={mentionMenuRef}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-0 right-0 top-full mt-1 glass rounded-lg py-1 z-20 max-h-48 overflow-y-auto shadow-xl"
                      >
                        {filteredUsers.map((mentionUser, index) => (
                          <button
                            key={mentionUser.id}
                            type="button"
                            onClick={() => insertMention(mentionUser.name)}
                            className={`w-full px-4 py-2 flex items-center gap-3 transition-colors ${
                              index === mentionIndex
                                ? 'bg-gold-500/20 text-gold-400'
                                : 'text-white/70 hover:bg-night-600'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-500/30 to-gold-600/30 flex items-center justify-center text-gold-400 text-xs font-bold">
                              {getInitials(mentionUser.name)}
                            </div>
                            <span>{mentionUser.name}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions Bar */}
            <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
              {/* Left: Character count & preview toggle */}
              <div className="flex items-center gap-4">
                <span
                  className={`text-sm transition-colors ${
                    isOverLimit
                      ? 'text-red-400'
                      : charactersLeft < 100
                      ? 'text-yellow-400'
                      : 'text-white/40'
                  }`}
                >
                  {charactersLeft} characters left
                </span>

                {content.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-sm text-white/50 hover:text-gold-400 transition-colors flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showPreview ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      )}
                    </svg>
                    {showPreview ? 'Edit' : 'Preview'}
                  </button>
                )}
              </div>

              {/* Right: Submit buttons */}
              <div className="flex items-center gap-2">
                {onCancel && (
                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-white/50 text-sm hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                )}

                <motion.button
                  whileHover={canSubmit ? { scale: 1.02 } : {}}
                  whileTap={canSubmit ? { scale: 0.98 } : {}}
                  type="submit"
                  disabled={!canSubmit}
                  className={`relative px-5 py-2 rounded-lg font-bold text-sm transition-all overflow-hidden ${
                    canSubmit
                      ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 hover:shadow-lg hover:shadow-gold-500/20'
                      : 'bg-night-600 text-white/30 cursor-not-allowed'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {isSubmitting ? (
                      <motion.span
                        key="submitting"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-night-900/30 border-t-night-900 rounded-full inline-block"
                        />
                        Posting...
                      </motion.span>
                    ) : (
                      <motion.span
                        key="submit"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        {parentId ? 'Reply' : 'Post'}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
