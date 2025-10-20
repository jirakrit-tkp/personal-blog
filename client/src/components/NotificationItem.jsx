import React from 'react';
import { User, X, Star, Eye } from 'lucide-react';
import Rating from 'react-rating';

const NotificationItem = ({ 
  notification, 
  onClick, 
  onDelete,
  onMarkAsRead,
  showDeleteButton = true,
  compact = false 
}) => {
  const getNotificationMessage = (notification) => {
    const actorName = <strong>{notification.actor_name}</strong>;
    
    switch (notification.type) {
      case 'new_blog':
        return <>{actorName} published new article.</>;
      case 'comment':
        return <>{actorName} commented on your article.</>;
      case 'comment_reply':
        return <>{actorName} commented on the article you have commented on.</>;
      case 'like':
        return <>{actorName} liked your article.</>;
      case 'rate':
        return <>{actorName} rated your article.</>;
      default:
        return notification.message || 'You have a new notification';
    }
  };

  const getRatingStars = (notification) => {
    if (notification.type !== 'rate' || !notification.rating) return null;
    
    return (
      <div className="mt-1">
        <Rating
          readonly
          initialRating={notification.rating / 2}
          emptySymbol={<Star className="w-4 h-4 inline stroke-stone-300" />}
          fullSymbol={<Star className="w-4 h-4 inline fill-yellow-400 stroke-yellow-400" />}
          fractions={2}
        />
      </div>
    );
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(notification.id);
    }
  };

  const handleMarkAsRead = (e) => {
    e.stopPropagation();
    if (onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  NotificationItem.displayName = "NotificationItem";

  return (
    <div
      onClick={() => onClick(notification)}
      className={`flex items-start gap-2 ${compact ? 'px-2 py-1.5' : 'px-6 py-4'} hover:bg-stone-${compact ? '100' : '100'} cursor-pointer transition-colors ${compact ? '' : ''} ${
        !notification.read ? 'bg-stone-50' : 'bg-stone-200'
      }`}
    >
      {/* Profile Picture */}
      <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
        {notification.actor_profile_pic ? (
          <img 
            src={notification.actor_profile_pic} 
            alt={notification.actor_name || 'User'}
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-5 h-5 text-stone-400" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        {/* Action message */}
        <p className="text-sm text-stone-800">
          {getNotificationMessage(notification)}
        </p>
        
        {/* Blog title */}
        {!compact && notification.blog_title && (
          <p className="text-sm font-medium text-stone-900 mt-1">
            {notification.blog_title}
          </p>
        )}
        
        {/* Rating stars (for rate type) */}
        {!compact && getRatingStars(notification)}
        
        {/* Comment content (for comment types) */}
        {!compact && notification.comment_content && (
          <p className="text-sm text-stone-600 mt-1 italic">
            {`"${notification.comment_content}"`}
          </p>
        )}
        
        {/* Timestamp */}
        <p className="text-xs text-orange-300 mt-1">
          {new Date(notification.created_at).toLocaleString('en-US', {
            year: compact ? 'numeric' : undefined,
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Mark as read button - only show if unread */}
        {!notification.read && onMarkAsRead && (
          <button
            onClick={handleMarkAsRead}
            className={`${
              compact 
                ? 'text-stone-400 hover:text-stone-700' 
                : 'text-stone-400 hover:text-stone-700'
            } transition-colors cursor-pointer`}
            aria-label="Mark as read"
            title="Mark as read"
          >
            {compact ? (
              <Eye className="w-4 h-4" />
            ) : (
              <span className="text-sm">Read</span>
            )}
          </button>
        )}
        
        {/* Delete button */}
        {showDeleteButton && (
          <button
            onClick={handleDelete}
            className={`${
              compact 
                ? 'text-stone-400 hover:text-red-500' 
                : 'text-stone-400 hover:text-red-600'
            } transition-colors cursor-pointer`}
            aria-label="Delete notification"
            title="Delete"
          >
            {compact ? (
              <X className="w-4 h-4" />
            ) : (
              <span className="text-sm">Delete</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;

