import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Copy, Facebook, Linkedin, Twitter, X, Trash, Star, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/authentication.jsx';
import LoginModal from './LoginModal';
import axios from 'axios';

// Individual Comment Component
function CommentItem({ comment, replies = [], onReply, onDelete, currentUserId }) {
  const [replyText, setReplyText] = useState('');

  const handleReply = () => {
    if (replyText.trim()) {
      onReply(comment.id, replyText);
      setReplyText('');
    }
  };

  return (
    <div className="border-b border-stone-200 pb-4 mb-4 last:border-b-0">
      {/* Comment Header */}
      <div className="flex items-center gap-3 mb-3">
        {comment.avatar && comment.avatar !== "https://via.placeholder.com/32x32?text=U" ? (
          <img 
            className="w-8 h-8 rounded-full object-cover" 
            src={comment.avatar} 
            alt={comment.author}
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center">
            <User className="w-4 h-4 text-stone-400" />
          </div>
        )}
        <div className="flex-1">
          <h4 className="font-semibold text-stone-900 text-sm inline-flex items-center gap-2">
            <span>{comment.author}</span>
            {typeof comment.rating === 'number' && comment.rating > 0 && (
              <span className="text-xs text-stone-500 inline-flex items-center gap-1 align-middle">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                {Math.round(comment.rating)}
              </span>
            )}
          </h4>
          <p className="text-xs text-stone-400">{comment.created_at || comment.date}</p>
        </div>
        {currentUserId && comment.user_id === currentUserId && (
          <button
            onClick={() => onDelete(comment.id, Boolean(comment.parent_id))}
            className="p-1 text-stone-500 hover:text-stone-700 cursor-pointer"
            aria-label="Delete comment"
          >
            <Trash className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Comment Content */}
      <div className="ml-11">
        <p className="text-stone-700 text-base leading-relaxed mb-2">{comment.content}</p>
        
        {/* Reply Inline Input moved to bottom (rendered after replies) */}

        {/* Replies */}
        {replies.length > 0 && (
          <div className="mt-4 ml-4 space-y-4">
            {replies.map((reply) => (
              <div key={reply.id} className="border-l-2 border-stone-200 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  {reply.avatar && reply.avatar !== "https://via.placeholder.com/24x24?text=U" ? (
                    <img 
                      className="w-6 h-6 rounded-full object-cover" 
                      src={reply.avatar} 
                      alt={reply.author}
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center">
                      <User className="w-3 h-3 text-stone-400" />
                    </div>
                  )}
                  <h5 className="font-medium text-stone-900 text-xs inline-flex items-center gap-1">
                    <span>{reply.author}</span>
                    {typeof reply.rating === 'number' && reply.rating > 0 && (
                      <span className="text-[10px] text-stone-500 inline-flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        {Math.round(reply.rating)}
                      </span>
                    )}
                  </h5>
                  <p className="text-xs text-stone-400">{reply.created_at || reply.date}</p>
                  {currentUserId && reply.user_id === currentUserId && (
                    <button
                      onClick={() => onDelete(reply.id, true)}
                      className="ml-auto p-1 text-stone-500 hover:text-stone-700 cursor-pointer"
                      aria-label="Delete reply"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-stone-700 text-sm leading-relaxed">{reply.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* Reply Input at the bottom */}
        <div className="mt-3">
          <div className="w-full max-w-md flex items-center gap-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onInput={(e) => { e.currentTarget.style.height = 'auto'; e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`; }}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReply(); } }}
              placeholder="Write a reply..."
              rows="1"
              className="w-full pl-3 pr-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-500 bg-white text-stone-900 resize-none no-scrollbar"
            />
            <button
              onClick={handleReply}
              disabled={!replyText.trim()}
              className={`${!replyText.trim() ? 'bg-stone-300 text-stone-500 cursor-not-allowed' : 'bg-stone-800 text-white hover:bg-stone-900 cursor-pointer'} h-9 px-4 text-xs rounded-full font-medium`}
            >
              Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Toast Notification Component
function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right-5 duration-300">
      <div className="bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-4 min-w-80">
        <div className="flex-1">
          <div className="font-semibold text-lg">Copied!</div>
          <div className="text-sm opacity-90">{message}</div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-stone-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// Main Comment Component with all functionality
function Comment({ postId }) {
  const navigate = useNavigate();
  const { isAuthenticated, state } = useAuth();
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [comments, setComments] = useState([]);
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001/api';

  // Helper function to load comments with ratings
  const loadCommentsWithRatings = useCallback(async () => {
    if (!postId) return;
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        users!inner(
          id,
          name,
          profile_pic
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error loading comments:', error);
      return;
    }

    // Build one-level threaded structure (parent -> replies)
    const byId = new Map();
    (data || []).forEach((c) => {
      byId.set(c.id, {
        id: c.id,
        user_id: c.user_id,
        author: c.users?.name || 'User',
        date: new Date(c.created_at).toLocaleString(),
        content: c.comment_text,
        avatar: c.users?.profile_pic || 'https://via.placeholder.com/32x32?text=U',
        replies: [],
        parent_id: c.parent_id,
        rating: null,
      });
    });

    const roots = [];
    byId.forEach((c) => {
      if (c.parent_id) {
        const parent = byId.get(c.parent_id);
        if (parent) parent.replies.push(c);
      } else {
        roots.push(c);
      }
    });
    
    // Fetch ratings for these users for this post
    const uniqueUserIds = [...new Set((data || []).map((c) => c.user_id).filter(Boolean))];
    if (uniqueUserIds.length > 0) {
      const { data: ratings } = await supabase
        .from('post_ratings')
        .select('user_id,rating')
        .eq('post_id', postId)
        .in('user_id', uniqueUserIds);
      (ratings || []).forEach((r) => {
        // assign rating to both root and replies in byId
        byId.forEach((val) => {
          if (val.user_id === r.user_id) val.rating = r.rating;
        });
      });
    }

    setComments(roots);
  }, [postId]);

  // Load comments from database (Supabase)
  useEffect(() => {
    loadCommentsWithRatings();
  }, [loadCommentsWithRatings]);

  // Load likes data: likes_count and per-user isLiked (server check)
  useEffect(() => {
    const loadLikesData = async () => {
      if (!postId) return;
      
      try {
        // Get likes count from post
        const { data: post, error: postError } = await supabase
          .from('posts')
          .select('likes_count')
          .eq('id', postId)
          .single();
        
        if (!postError && post) {
          setLikes(post.likes_count || 0);
        }
        // Check isLiked from server when authenticated
        if (isAuthenticated && state.user?.id) {
          try {
            const res = await axios.get(`${apiBase}/posts/${postId}/likes/check`, {
              params: { user_id: state.user.id }
            });
            setIsLiked(Boolean(res?.data?.isLiked));
          } catch (_) {
            setIsLiked(false);
          }
        } else {
          setIsLiked(false);
        }
      } catch (error) {
        console.error('Error loading likes:', error);
      }
    };
    
    loadLikesData();
  }, [postId, isAuthenticated, state.user?.id, apiBase]);

  const handleLike = async () => {
    // Check authentication first
    if (!isAuthenticated || !state.user?.id) {
      navigate('/login');
      return;
    }

    try {
      if (isLiked) {
        // Unlike
        await axios.delete(`${apiBase}/posts/${postId}/likes`, { data: { user_id: state.user.id } });
        setLikes(prev => Math.max(prev - 1, 0));
        setIsLiked(false);
      } else {
        // Like
        await axios.post(`${apiBase}/posts/${postId}/likes`, { user_id: state.user.id });
        setLikes(prev => prev + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Optionally show error message to user
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowToast(true);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = document.title;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      default:
        return;
    }
    
    // Open in popup window with proper security settings
    const width = 600;
    const height = 500;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    window.open(
      shareUrl, 
      '_blank', 
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,noopener,noreferrer`
    );
  };

  const refreshComments = async () => {
    await loadCommentsWithRatings();
  };

  const handleDelete = async (commentId, isReply) => {
    if (!isAuthenticated || !state.user?.id) {
      navigate('/login');
      return;
    }
    // Delete target comment; if root, also delete its replies (one-level)
    if (!isReply) {
      await supabase.from('comments').delete().eq('parent_id', commentId);
    }
    await supabase.from('comments').delete().eq('id', commentId).eq('user_id', state.user.id);
    await refreshComments();
  };

  const handleSubmitComment = async () => {
    if (!comment.trim()) return;
    if (!isAuthenticated || !state.user?.id) {
      navigate('/login');
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase.from('comments').insert({
        post_id: postId,
        user_id: state.user.id,
        comment_text: comment,
        parent_id: null,
      });
      if (error) throw error;
      setComment('');
      // Reload with ratings
      await loadCommentsWithRatings();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (commentId, replyText) => {
    if (!replyText.trim()) return;
    if (!isAuthenticated || !state.user?.id) {
      navigate('/login');
      return;
    }
    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      user_id: state.user.id,
      comment_text: replyText,
      parent_id: commentId,
    });
    if (!error) {
      // Reload with ratings
      await loadCommentsWithRatings();
    }
  };

  return (
    <>
    <div>
      {/* Reaction and Share Row */}
      <div className="bg-stone-200 sm:rounded-3xl p-4 gap-4 flex flex-col sm:flex-row items-center justify-between mb-6">
        <div className="flex items-center gap-4 w-full">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`flex items-center justify-center w-full sm:w-auto gap-2 px-4 py-2 rounded-full border transition-colors cursor-pointer ${
              isLiked 
                ? 'bg-red-50 border-red-200 text-red-600' 
                : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{likes}</span>
          </button>
        </div>

        {/* Social Share Buttons */}
        <div className="flex items-center justify-between sm:justify-end gap-2 w-full">
          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <Copy className="w-4 h-4" />
            <span className="text-sm font-medium flex">Copy link</span>
          </button>
          <div className="flex flex-row gap-2">
          <button
            onClick={() => handleShare('facebook')}
            className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <Facebook className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => handleShare('linkedin')}
            className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center hover:bg-blue-800 transition-colors cursor-pointer"
          >
            <Linkedin className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => handleShare('twitter')}
            className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center hover:bg-blue-500 transition-colors cursor-pointer"
          >
            <Twitter className="w-4 h-4 text-white" />
          </button>
          </div>
        </div>
      </div>

      {/* Comment Input Section */}
      <div className="mb-8 max-md:px-4">
        <label className="block text-sm font-medium text-stone-900 mb-3">
          Comment
        </label>
        <div className="relative">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What are your thoughts?"
            className="w-full bg-white p-4 border border-stone-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="4"
          />
          <div className="absolute bottom-3 right-3">
            <button
              onClick={handleSubmitComment}
              disabled={!comment.trim() || isSubmitting}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !comment.trim() || isSubmitting
                  ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  : 'bg-stone-800 text-white hover:bg-stone-900 cursor-pointer'
              }`}
            >
              {isSubmitting ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6 max-md:px-4">
        {comments.map((commentItem) => (
          <CommentItem
            key={commentItem.id}
            comment={commentItem}
            replies={commentItem.replies}
            onReply={handleReply}
            onDelete={handleDelete}
            currentUserId={state.user?.id}
          />
        ))}
      </div>

      {/* Load More Comments */}
      {comments.length > 3 && (
        <div className="text-center mt-6">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer">
            Load more comments
          </button>
        </div>
      )}
    </div>

    {/* Toast Notification */}
    {showToast && (
      <Toast 
        message="This article has been copied to your clipboard."
        onClose={() => setShowToast(false)}
      />
    )}

    {/* Login Modal */}
    <LoginModal 
      isOpen={showLoginModal}
      onClose={() => setShowLoginModal(false)}
    />
  </>)
};

export default Comment;
