'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import CommentForm from './CommentForm';
import { Skeleton } from './Skeleton';
import { escapeHtml } from '@/lib/sanitize';

// Types
export interface Comment {
  id: string;
  entityType: 'legend' | 'news' | 'match';
  entityId: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  likes: number;
  likedBy: string[];
  parentId?: string;
  replies?: Comment[];
  isEdited?: boolean;
  isDeleted?: boolean;
}

export interface CommentsProps {
  entityType: 'legend' | 'news' | 'match';
  entityId: number;
  initialComments?: Comment[];
}

type SortOption = 'newest' | 'oldest' | 'most_liked';

// Utility: Time ago formatter
function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'Just now';
}

// Generate initials from name
function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

// Mock data for demonstration
const mockComments: Comment[] = [
  {
    id: '1',
    entityType: 'legend',
    entityId: 1,
    userId: 'user1',
    userName: 'Carlos Mendez',
    content: 'An absolute legend of the beautiful game. His technique was unmatched and he inspired a generation of players. The way he could control the ball in tight spaces was like watching art in motion.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likes: 24,
    likedBy: ['user2', 'user3'],
    replies: [
      {
        id: '1-1',
        entityType: 'legend',
        entityId: 1,
        userId: 'user2',
        userName: 'Maria Santos',
        content: 'Completely agree! I remember watching him play in the 2002 World Cup. Pure magic.',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        likes: 8,
        likedBy: ['user1'],
        parentId: '1',
      },
      {
        id: '1-2',
        entityType: 'legend',
        entityId: 1,
        userId: 'user3',
        userName: 'James Wilson',
        content: 'His free kicks were something else entirely. I still get chills watching the highlights.',
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        likes: 5,
        likedBy: [],
        parentId: '1',
      },
    ],
  },
  {
    id: '2',
    entityType: 'legend',
    entityId: 1,
    userId: 'user4',
    userName: 'Roberto Baggio Fan',
    content: 'This tournament is going to be incredible. Can\'t wait to see all these legends together on the pitch again!',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    likes: 15,
    likedBy: ['user1', 'user2'],
  },
  {
    id: '3',
    entityType: 'legend',
    entityId: 1,
    userId: 'user5',
    userName: 'Football Historian',
    content: 'The tactical intelligence and vision displayed throughout his career set new standards for the position. Players today still study his movements.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 31,
    likedBy: ['user1', 'user2', 'user3', 'user4'],
  },
];

// Comment Skeleton Component
function CommentSkeleton() {
  return (
    <div className="glass rounded-xl p-5 space-y-4">
      <div className="flex items-start gap-3">
        <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
      <div className="flex items-center gap-4 pl-13">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-12" />
      </div>
    </div>
  );
}

// Single Comment Component
interface SingleCommentProps {
  comment: Comment;
  depth: number;
  onReply: (parentId: string) => void;
  onLike: (commentId: string) => void;
  onEdit: (commentId: string, newContent: string) => void;
  onDelete: (commentId: string) => void;
  onReport: (commentId: string) => void;
  replyingTo: string | null;
  onCancelReply: () => void;
  onSubmitReply: (content: string, parentId: string) => void;
  isNew?: boolean;
}

function SingleComment({
  comment,
  depth,
  onReply,
  onLike,
  onEdit,
  onDelete,
  onReport,
  replyingTo,
  onCancelReply,
  onSubmitReply,
  isNew = false,
}: SingleCommentProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showReplies, setShowReplies] = useState(true);
  const [showActions, setShowActions] = useState(false);

  const isOwner = user?.id === comment.userId;
  const hasLiked = user ? comment.likedBy.includes(user.id) : false;
  const maxDepth = 3;

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== comment.content) {
      onEdit(comment.id, editContent);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  if (comment.isDeleted) {
    return (
      <div className="glass rounded-xl p-4 opacity-50">
        <p className="text-white/40 italic">This comment has been deleted.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={isNew ? { opacity: 0, y: -20, scale: 0.95 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className={`relative ${isNew ? 'ring-2 ring-gold-500/50 ring-offset-2 ring-offset-night-700' : ''}`}
    >
      <div
        className={`glass rounded-xl p-5 transition-all duration-300 hover:border-gold-500/20 ${
          depth > 0 ? 'ml-6 sm:ml-10 border-l-2 border-gold-500/20' : ''
        }`}
      >
        {/* Comment Header */}
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {comment.userAvatar ? (
              <Image
                src={comment.userAvatar}
                alt={comment.userName}
                width={40}
                height={40}
                className="rounded-full object-cover ring-2 ring-gold-500/20"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500/30 to-gold-600/30 flex items-center justify-center text-gold-400 font-bold text-sm ring-2 ring-gold-500/20">
                {getInitials(comment.userName)}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-2 mb-2">
              <span className="text-white font-semibold">{comment.userName}</span>
              <span className="text-white/40 text-sm">{timeAgo(comment.createdAt)}</span>
              {comment.isEdited && (
                <span className="text-white/30 text-xs">(edited)</span>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-4 py-3 bg-night-600 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors resize-none"
                  rows={3}
                  maxLength={1000}
                />
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold text-sm rounded-lg"
                  >
                    Save
                  </motion.button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-night-600 text-white/70 text-sm rounded-lg hover:bg-night-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-white/80 leading-relaxed whitespace-pre-wrap break-words">
                {escapeHtml(comment.content)}
              </p>
            )}
          </div>

          {/* Actions Menu */}
          {!isEditing && (
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-night-600 transition-all"
                aria-label="More actions"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>

              <AnimatePresence>
                {showActions && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-10"
                      onClick={() => setShowActions(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      className="absolute right-0 top-full mt-1 w-36 glass rounded-lg py-1 z-20 shadow-xl"
                    >
                      {isOwner && (
                        <>
                          <button
                            onClick={() => {
                              setIsEditing(true);
                              setShowActions(false);
                            }}
                            className="w-full px-4 py-2 text-left text-white/70 hover:text-white hover:bg-night-600 transition-colors flex items-center gap-2 text-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              onDelete(comment.id);
                              setShowActions(false);
                            }}
                            className="w-full px-4 py-2 text-left text-red-400 hover:text-red-300 hover:bg-night-600 transition-colors flex items-center gap-2 text-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => {
                          onReport(comment.id);
                          setShowActions(false);
                        }}
                        className="w-full px-4 py-2 text-left text-white/70 hover:text-white hover:bg-night-600 transition-colors flex items-center gap-2 text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                        </svg>
                        Report
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Actions Bar */}
        {!isEditing && (
          <div className="flex items-center gap-4 mt-4 pl-13">
            {/* Like Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onLike(comment.id)}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                hasLiked ? 'text-red-400' : 'text-white/50 hover:text-red-400'
              }`}
            >
              <motion.span
                animate={hasLiked ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {hasLiked ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )}
              </motion.span>
              <span>{comment.likes}</span>
            </motion.button>

            {/* Reply Button */}
            {depth < maxDepth && (
              <button
                onClick={() => onReply(comment.id)}
                className="flex items-center gap-1.5 text-sm text-white/50 hover:text-gold-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Reply
              </button>
            )}
          </div>
        )}

        {/* Reply Form */}
        <AnimatePresence>
          {replyingTo === comment.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden"
            >
              <CommentForm
                entityType={comment.entityType}
                entityId={comment.entityId}
                onCommentAdd={(content) => onSubmitReply(content, comment.id)}
                parentId={comment.id}
                onCancel={onCancelReply}
                placeholder={`Reply to ${comment.userName}...`}
                compact
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3">
          {comment.replies.length > 2 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-2 text-gold-400 text-sm mb-3 ml-6 sm:ml-10 hover:text-gold-300 transition-colors"
            >
              <motion.svg
                animate={{ rotate: showReplies ? 180 : 0 }}
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
              {showReplies ? 'Hide' : 'Show'} {comment.replies.length} replies
            </button>
          )}

          <AnimatePresence>
            {showReplies && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                {comment.replies.map((reply) => (
                  <SingleComment
                    key={reply.id}
                    comment={reply}
                    depth={depth + 1}
                    onReply={onReply}
                    onLike={onLike}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onReport={onReport}
                    replyingTo={replyingTo}
                    onCancelReply={onCancelReply}
                    onSubmitReply={onSubmitReply}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

// Main Comments Component
export default function Comments({
  entityType,
  entityId,
  initialComments = mockComments,
}: CommentsProps) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [newCommentIds, setNewCommentIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const commentsPerPage = 10;

  // Sort comments
  const sortComments = useCallback((commentsToSort: Comment[]): Comment[] => {
    const sorted = [...commentsToSort];
    switch (sortBy) {
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'most_liked':
        return sorted.sort((a, b) => b.likes - a.likes);
      case 'newest':
      default:
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [sortBy]);

  const sortedComments = sortComments(comments);

  // Handle adding a new comment
  const handleAddComment = useCallback((content: string) => {
    if (!user) return;

    const newComment: Comment = {
      id: `new-${Date.now()}`,
      entityType,
      entityId,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      userAvatar: user.avatar,
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
    };

    setComments((prev) => [newComment, ...prev]);
    setNewCommentIds((prev) => new Set([...prev, newComment.id]));
    showToast('Comment posted successfully!', 'success');

    // Remove highlight after animation
    setTimeout(() => {
      setNewCommentIds((prev) => {
        const updated = new Set(prev);
        updated.delete(newComment.id);
        return updated;
      });
    }, 3000);
  }, [user, entityType, entityId, showToast]);

  // Handle reply submission
  const handleSubmitReply = useCallback((content: string, parentId: string) => {
    if (!user) return;

    const newReply: Comment = {
      id: `reply-${Date.now()}`,
      entityType,
      entityId,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      userAvatar: user.avatar,
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      parentId,
    };

    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply],
          };
        }
        // Check nested replies
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map((reply) => {
              if (reply.id === parentId) {
                return {
                  ...reply,
                  replies: [...(reply.replies || []), newReply],
                };
              }
              return reply;
            }),
          };
        }
        return comment;
      })
    );

    setReplyingTo(null);
    showToast('Reply posted!', 'success');
  }, [user, entityType, entityId, showToast]);

  // Handle like
  const handleLike = useCallback((commentId: string) => {
    if (!user) {
      showToast('Please log in to like comments', 'error');
      return;
    }

    const updateLikes = (commentList: Comment[]): Comment[] =>
      commentList.map((comment) => {
        if (comment.id === commentId) {
          const hasLiked = comment.likedBy.includes(user.id);
          return {
            ...comment,
            likes: hasLiked ? comment.likes - 1 : comment.likes + 1,
            likedBy: hasLiked
              ? comment.likedBy.filter((id) => id !== user.id)
              : [...comment.likedBy, user.id],
          };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: updateLikes(comment.replies),
          };
        }
        return comment;
      });

    setComments(updateLikes);
  }, [user, showToast]);

  // Handle edit
  const handleEdit = useCallback((commentId: string, newContent: string) => {
    const updateContent = (commentList: Comment[]): Comment[] =>
      commentList.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            content: newContent,
            isEdited: true,
            updatedAt: new Date().toISOString(),
          };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: updateContent(comment.replies),
          };
        }
        return comment;
      });

    setComments(updateContent);
    showToast('Comment updated!', 'success');
  }, [showToast]);

  // Handle delete
  const handleDelete = useCallback((commentId: string) => {
    const markDeleted = (commentList: Comment[]): Comment[] =>
      commentList.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            isDeleted: true,
            content: '',
          };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: markDeleted(comment.replies),
          };
        }
        return comment;
      });

    setComments(markDeleted);
    showToast('Comment deleted', 'info');
  }, [showToast]);

  // Handle report
  const handleReport = useCallback((commentId: string) => {
    // In a real app, this would send a report to the backend
    showToast('Comment reported. Thank you for helping keep our community safe.', 'success');
  }, [showToast]);

  // Load more comments
  const handleLoadMore = useCallback(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPage((prev) => prev + 1);
      setIsLoading(false);
      // In a real app, check if there are more comments
      if (page >= 3) {
        setHasMore(false);
      }
    }, 1000);
  }, [page]);

  const totalComments = comments.reduce((acc, comment) => {
    return acc + 1 + (comment.replies?.length || 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3
          className="text-2xl text-gold-400"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          DISCUSSION ({totalComments})
        </h3>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-white/50 text-sm">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 bg-night-700 border border-gold-500/20 rounded-lg text-white text-sm focus:outline-none focus:border-gold-500/50 cursor-pointer transition-colors"
            aria-label="Sort comments"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="most_liked">Most Liked</option>
          </select>
        </div>
      </div>

      {/* Comment Form */}
      <CommentForm
        entityType={entityType}
        entityId={entityId}
        onCommentAdd={handleAddComment}
      />

      {/* Comments List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {sortedComments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <SingleComment
                comment={comment}
                depth={0}
                onReply={setReplyingTo}
                onLike={handleLike}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onReport={handleReport}
                replyingTo={replyingTo}
                onCancelReply={() => setReplyingTo(null)}
                onSubmitReply={handleSubmitReply}
                isNew={newCommentIds.has(comment.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <CommentSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && comments.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-night-600 flex items-center justify-center">
              <svg className="w-8 h-8 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h4 className="text-white font-semibold mb-2">No comments yet</h4>
            <p className="text-white/50 text-sm">Be the first to share your thoughts!</p>
          </motion.div>
        )}

        {/* Load More */}
        {hasMore && comments.length > 0 && !isLoading && (
          <div className="text-center pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLoadMore}
              className="px-6 py-3 glass-gold text-gold-400 rounded-xl hover:bg-gold-500/20 transition-colors"
            >
              Load More Comments
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
