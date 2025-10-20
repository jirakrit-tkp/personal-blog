import { useState } from 'react';
import { User } from 'lucide-react';

const Avatar = ({ src, alt = 'User avatar', size = 'md', className = '' }) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
    '2xl': 'w-16 h-16'
  };

  const iconSizeClasses = {
    xs: 'w-2 h-2',
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
    '2xl': 'w-8 h-8'
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const iconSizeClass = iconSizeClasses[size] || iconSizeClasses.md;

  const shouldShowFallback = !src || 
    src === "https://via.placeholder.com/32x32?text=U" || 
    src === "https://via.placeholder.com/24x24?text=U" ||
    hasError;

  if (shouldShowFallback) {
    return (
      <div className={`${sizeClass} rounded-full bg-stone-200 flex items-center justify-center flex-shrink-0 ${className}`}>
        <User className={`${iconSizeClass} text-stone-400`} />
      </div>
    );
  }

  return (
    <img 
      className={`${sizeClass} rounded-full object-cover flex-shrink-0 ${className}`}
      src={src} 
      alt={alt}
      onError={() => setHasError(true)}
    />
  );
};

Avatar.displayName = 'Avatar';

export default Avatar;

