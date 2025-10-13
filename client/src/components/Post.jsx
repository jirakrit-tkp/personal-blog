import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Star } from 'lucide-react';
import axios from 'axios';
import { getMarkdownHTML } from '../lib/markdownUtils';
import Comment from './Comment';

function Post({ post, loading }) {
  const [publicAdmin, setPublicAdmin] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchPublicAdmin = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001/api';
        const adminId = import.meta.env.VITE_PUBLIC_ADMIN_ID; // UUID of admin user
        if (!adminId) return;
        const res = await axios.get(`${apiBase}/profiles/${adminId}`, { signal: controller.signal });
        if (res?.data?.success) {
          setPublicAdmin(res.data.data);
        }
      } catch (err) {
        // silent fail; will fallback to defaults
      }
    };

    fetchPublicAdmin();
    return () => controller.abort();
  }, []);
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-stone-600">Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-0 md:px-6 lg:px-8">
        {/* Hero Image */}
        <div className="w-full h-auto pt-0 md:pt-8 mb-8">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover rounded-none sm:rounded-lg"
          />
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8 pb-12 max-md:px-4">
          {/* Left Column - Article Content (80%) */}
          <div className="w-full lg:w-4/5">
            <div>
              {/* Category and Date */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex flex-wrap gap-2">
                  {post.genres && post.genres.length > 0 ? (
                    post.genres.map((genre, idx) => (
                      <span key={`${genre.id}-${idx}`} className="bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-green-600">
                        {genre.name}
                      </span>
                    ))
                  ) : (
                    <span className="bg-stone-200 rounded-full px-3 py-1 text-sm font-semibold text-stone-600">
                      Uncategorized
                    </span>
                  )}
                </div>
                <span className="text-stone-600 text-sm">
                  {new Date(post.created_at || post.date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 mb-2 leading-tight">
                {post.title}
              </h1>

              {/* Introduction */}
              <p className="text-lg sm:text-xl text-stone-400 mb-8 leading-relaxed">
                {post.description}
              </p>

              {/* Rating Section */}
              <div className="mb-8 pb-6 border-b border-stone-200">
                {/* Desktop Layout */}
                <div className="hidden md:flex items-center justify-between">
                  {/* Left Side - IMHb & Rotten Bananas */}
                  <div className="flex items-center gap-8">
                    {/* IMHb RATING */}
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-stone-600">IMHb RATING</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="w-6 h-6 text-yellow-400 fill-current" />
                          <span className="text-2xl font-bold text-stone-900">{post.imhb_score}/10</span>
                        </div>
                      </div>
                    </div>

                    {/* Separator */}
                    <div className="w-px h-12 bg-stone-300"></div>

                    {/* Rotten Bananas */}
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-stone-600">Rotten Bananas</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-2xl font-bold text-stone-900">{post.rotten_potatoes}%</span>
                          <div className="w-6 h-6">
                            {post.rotten_potatoes >= 60 ? (
                              <img src="/banana.svg" alt="Banana" className="w-full h-full" />
                            ) : (
                              <img src="/worm.svg" alt="Worm" className="w-full h-full" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Voters Count */}
                    <span className="text-xs text-stone-500">({post.voters_count || "XX"} Voters)</span>
                  </div>

                  {/* Right Side - YOUR RATING */}
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-stone-600 text-end">YOUR RATING</span>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="w-6 h-6 text-stone-300" />
                        <span className="text-2xl font-semibold text-stone-300">RATE</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden flex flex-col items-center gap-6">
                  {/* Top Row - IMHb & Rotten Bananas */}
                  <div className="flex items-center justify-center gap-6">
                    {/* IMHb RATING */}
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-medium text-stone-600">IMHb RATING</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="w-6 h-6 text-yellow-400 fill-current" />
                          <span className="text-2xl font-bold text-stone-900">{post.imhb_score}/10</span>
                        </div>
                      </div>
                    </div>

                    {/* Separator */}
                    <div className="w-px h-12 bg-stone-300"></div>

                    {/* Rotten Bananas */}
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-medium text-stone-600">Rotten Bananas</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-2xl font-bold text-stone-900">{post.rotten_potatoes}%</span>
                          <div className="w-6 h-6">
                            {post.rotten_potatoes >= 60 ? (
                              <img src="/banana.svg" alt="Banana" className="w-full h-full" />
                            ) : (
                              <img src="/worm.svg" alt="Worm" className="w-full h-full" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Middle Row - Voters Count */}
                  <div className="flex items-center justify-center -mt-4">
                    <span className="text-xs text-stone-500">({post.voters_count || "XX"} Voters)</span>
                  </div>

                  {/* Bottom Row - YOUR RATING */}
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-medium text-stone-600">YOUR RATING</span>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="w-6 h-6 text-stone-300" />
                        <span className="text-2xl font-semibold text-stone-300">RATE</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div className="markdown">
                {post.content && (
                  <ReactMarkdown>
                    {post.content}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Author Box (20%) - Top-bottom on small, right on large */}
          <div className="w-full lg:w-1/5">
            <div className="sticky top-8">
              <div className="bg-stone-200 rounded-lg p-6 shadow-sm border border-stone-200">
                {/* Author Header - Horizontal Layout */}
                <div className="flex items-start gap-4 mb-4">
                  <img 
                    className="w-12 h-12 rounded-full flex-shrink-0 object-cover" 
                    src={publicAdmin?.profile_pic || "https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg"} 
                    alt={publicAdmin?.name ? `${publicAdmin?.name} profile picture` : "Author profile"}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-stone-500 mb-1">Author</p>
                    <h4 className="font-semibold text-stone-900">{publicAdmin?.name || "Admin"}</h4>
                  </div>
                </div>

                {/* Separator Line */}
                <div className="border-t border-stone-400 mb-4"></div>

                {/* Author Bio */}
                <div className="space-y-3 text-sm text-stone-700">
                  <div dangerouslySetInnerHTML={getMarkdownHTML(publicAdmin?.bio || '')} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="pb-12">
          <Comment postId={post?.id} />
        </div>
      </div>
    </div>
  );
}

export default Post;
