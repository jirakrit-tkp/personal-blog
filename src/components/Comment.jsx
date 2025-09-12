import { useState, useEffect } from 'react';
import { Heart, Copy, Facebook, Linkedin, Twitter, X } from 'lucide-react';
import LoginModal from './LoginModal';

// Individual Comment Component
function CommentItem({ comment, replies = [], onReply }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleReply = () => {
    if (replyText.trim()) {
      onReply(comment.id, replyText);
      setReplyText('');
      setShowReplyForm(false);
    }
  };

  return (
    <div className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
      {/* Comment Header */}
      <div className="flex items-center gap-3 mb-3">
        <img 
          className="w-8 h-8 rounded-full" 
          src={comment.avatar || "https://via.placeholder.com/32x32?text=U"} 
          alt={comment.author}
        />
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-sm">{comment.author}</h4>
          <p className="text-xs text-gray-500">{comment.date}</p>
        </div>
      </div>

      {/* Comment Content */}
      <div className="ml-11">
        <p className="text-gray-700 text-sm leading-relaxed mb-3">{comment.content}</p>
        
        {/* Reply Button */}
        <button 
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="text-blue-600 hover:text-blue-800 text-xs font-medium"
        >
          Reply
        </button>

        {/* Reply Form */}
        {showReplyForm && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="w-full p-2 border border-gray-300 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleReply}
                className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
              >
                Reply
              </button>
              <button
                onClick={() => {
                  setShowReplyForm(false);
                  setReplyText('');
                }}
                className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Replies */}
        {replies.length > 0 && (
          <div className="mt-4 ml-4 space-y-4">
            {replies.map((reply) => (
              <div key={reply.id} className="border-l-2 border-gray-200 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <img 
                    className="w-6 h-6 rounded-full" 
                    src={reply.avatar || "https://via.placeholder.com/24x24?text=U"} 
                    alt={reply.author}
                  />
                  <h5 className="font-medium text-gray-900 text-xs">{reply.author}</h5>
                  <p className="text-xs text-gray-500">{reply.date}</p>
                </div>
                <p className="text-gray-700 text-xs leading-relaxed">{reply.content}</p>
              </div>
            ))}
          </div>
        )}
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
          className="text-white hover:text-gray-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// Main Comment Component with all functionality
function Comment({ postId }) {
  const [likes, setLikes] = useState(321);
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Sarah Johnson",
      date: "2 hours ago",
      content: "Great article! I've been looking for information about this topic for a while. Thanks for sharing your insights.",
      avatar: "https://via.placeholder.com/32x32?text=SJ",
      replies: [
        {
          id: 11,
          author: "Author",
          date: "1 hour ago",
          content: "Thank you Sarah! I'm glad you found it helpful.",
          avatar: "https://via.placeholder.com/24x24?text=A"
        }
      ]
    },
    {
      id: 2,
      author: "Mike Chen",
      date: "4 hours ago",
      content: "This is exactly what I needed to know. The examples you provided really helped me understand the concept better.",
      avatar: "https://via.placeholder.com/32x32?text=MC",
      replies: []
    },
    {
      id: 3,
      author: "Emily Davis",
      date: "6 hours ago",
      content: "I have a question about the implementation. Could you provide more details about the configuration?",
      avatar: "https://via.placeholder.com/32x32?text=ED",
      replies: [
        {
          id: 31,
          author: "Author",
          date: "5 hours ago",
          content: "Sure Emily! I'll add a detailed configuration section in my next post.",
          avatar: "https://via.placeholder.com/24x24?text=A"
        },
        {
          id: 32,
          author: "Emily Davis",
          date: "4 hours ago",
          content: "That would be great! Looking forward to it.",
          avatar: "https://via.placeholder.com/24x24?text=ED"
        }
      ]
    }
  ]);

  const handleLike = () => {
    // สมมติว่าผู้ใช้ยังไม่ได้ login - แสดง login modal
    setShowLoginModal(true);
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
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const handleSubmitComment = async () => {
    if (!comment.trim()) return;

    // สมมติว่าผู้ใช้ยังไม่ได้ login - แสดง login modal
    setShowLoginModal(true);
  };

  const handleReply = (commentId, replyText) => {
    const reply = {
      id: Date.now(),
      author: "You",
      date: "Just now",
      content: replyText,
      avatar: "https://via.placeholder.com/24x24?text=Y"
    };

    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, replies: [...comment.replies, reply] }
          : comment
      )
    );
  };

  return (
    <>
    <div>
      {/* Reaction and Share Row */}
      <div className="bg-neutral-200 sm:rounded-3xl p-4 gap-4 flex flex-col sm:flex-row items-center justify-between mb-6">
        <div className="flex items-center gap-4 w-full">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`flex items-center justify-center w-full sm:w-auto gap-2 px-4 py-2 rounded-full border transition-colors ${
              isLiked 
                ? 'bg-red-50 border-red-200 text-red-600' 
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{likes}</span>
          </button>
        </div>

        {/* Social Share Buttons */}
        <div className="flex items-center justify-center sm:justify-end gap-2 w-full">
          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Copy className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:flex">Copy link</span>
          </button>
          <button
            onClick={() => handleShare('facebook')}
            className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors"
          >
            <Facebook className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => handleShare('linkedin')}
            className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center hover:bg-blue-800 transition-colors"
          >
            <Linkedin className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => handleShare('twitter')}
            className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center hover:bg-blue-500 transition-colors"
          >
            <Twitter className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Comment Input Section */}
      <div className="mb-8 px-4">
        <label className="block text-sm font-medium text-gray-900 mb-3">
          Comment
        </label>
        <div className="relative">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What are your thoughts?"
            className="w-full bg-white p-4 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="4"
          />
          <div className="absolute bottom-3 right-3">
            <button
              onClick={handleSubmitComment}
              disabled={!comment.trim() || isSubmitting}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !comment.trim() || isSubmitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-800 text-white hover:bg-gray-900'
              }`}
            >
              {isSubmitting ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6 bg-white p-4">
        {comments.map((commentItem) => (
          <CommentItem
            key={commentItem.id}
            comment={commentItem}
            replies={commentItem.replies}
            onReply={handleReply}
          />
        ))}
      </div>

      {/* Load More Comments */}
      {comments.length > 3 && (
        <div className="text-center mt-6">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
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
