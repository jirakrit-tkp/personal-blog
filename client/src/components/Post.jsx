import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Star } from 'lucide-react';
import Rating from 'react-rating';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authentication.jsx';
import { supabase } from '../lib/supabase';
import { getMarkdownHTML } from '../lib/markdownUtils';
import Comment from './Comment';
import { getGenreChipClasses } from '../lib/genreUtils';
import Avatar from './ui/Avatar';

function Post({ post, loading }) {
  const [publicAdmin, setPublicAdmin] = useState(null);
  const [userRating, setUserRating] = useState(null); // 0-10 scale
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [pendingStars, setPendingStars] = useState(0); // 0-5
  const [postScores, setPostScores] = useState({
    imhb_score: post?.imhb_score,
    rotten_potatoes: post?.rotten_potatoes,
    voters_count: post?.voters_count
  });
  const { isAuthenticated, state } = useAuth();
  const navigate = useNavigate();

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

  // Load current user's rating for this post
  useEffect(() => {
    const loadMyRating = async () => {
      if (!post?.id || !state?.user?.id) {
        setUserRating(null);
        return;
      }
      const { data, error } = await supabase
        .from('post_ratings')
        .select('rating')
        .eq('post_id', post.id)
        .eq('user_id', state.user.id)
        .maybeSingle();
      if (!error && data) setUserRating(data.rating || 0);
    };
    loadMyRating();
  }, [post?.id, state?.user?.id]);

  // Update postScores when post prop changes
  useEffect(() => {
    setPostScores({
      imhb_score: post?.imhb_score,
      rotten_potatoes: post?.rotten_potatoes,
      voters_count: post?.voters_count
    });
  }, [post?.imhb_score, post?.rotten_potatoes, post?.voters_count]);

  // Realtime subscription for post scores changes
  useEffect(() => {
    if (!post?.id) return;

    const channel = supabase
      .channel(`post-${post.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'posts',
          filter: `id=eq.${post.id}`
        },
        (payload) => {
          // Update scores from the posts table directly
          if (payload.new) {
            setPostScores({
              imhb_score: payload.new.imhb_score,
              rotten_potatoes: payload.new.rotten_potatoes,
              voters_count: payload.new.voters_count
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [post?.id]);

  // Realtime subscription for user's own rating changes
  useEffect(() => {
    if (!post?.id || !state?.user?.id) return;

    const channel = supabase
      .channel(`post-ratings-user-${post.id}-${state.user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_ratings',
          filter: `post_id=eq.${post.id}`
        },
        (payload) => {
          // Update user's rating if it's their own
          if (payload.new && payload.new.user_id === state.user.id) {
            setUserRating(payload.new.rating || 0);
          } else if (payload.eventType === 'DELETE' && payload.old && payload.old.user_id === state.user.id) {
            setUserRating(null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [post?.id, state?.user?.id]);

  const openRatingModal = () => {
    // Open modal regardless of auth; we'll gate on submit
    setPendingStars(userRating ? userRating / 2 : 0);
    setShowRatingModal(true);
  };

  const submitRating = async (stars) => {
    if (!isAuthenticated || !state?.user?.id) {
      // Save current path for redirect after login
      const from = window.location.pathname + window.location.search + window.location.hash;
      navigate(`/login?from=${encodeURIComponent(from)}`);
      return;
    }
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001/api';
      await axios.post(`${apiBase}/posts/${post.id}/ratings`, {
        rating: stars * 2,
        user_id: state.user.id,
      });
      setUserRating(stars * 2);
      setShowRatingModal(false);
    } catch (_) {
      // ignore
    }
  };
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
                      <span key={`${genre.id}-${idx}`} className={`rounded-full px-3 py-1 text-sm font-semibold ${getGenreChipClasses(genre)}`}>
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
                          <span className="text-2xl font-bold text-stone-900">{postScores.imhb_score}/10</span>
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
                          <span className="text-2xl font-bold text-stone-900">{Math.round(postScores.rotten_potatoes)}%</span>
                          <div className="w-6 h-6">
                            {postScores.rotten_potatoes >= 60 ? (
                              <img src="/banana.svg" alt="Banana" className="w-full h-full" />
                            ) : (
                              <img src="/worm.svg" alt="Worm" className="w-full h-full" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Voters Count */}
                    <span className="text-xs text-stone-500">({postScores.voters_count || "XX"} Voters)</span>
                  </div>

                  {/* Right Side - YOUR RATING */}
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-medium text-stone-600">YOUR RATING</span>
                      <div className="flex items-center gap-2 mt-1">
                        {userRating && userRating > 0 ? (
                          <Rating
                            readonly
                            initialRating={userRating / 2}
                            emptySymbol={<Star className="w-6 h-6 stroke-stone-300" />}
                            fullSymbol={<Star className="w-6 h-6 fill-yellow-400 stroke-yellow-400" />}
                          />
                        ) : (
                          <button onClick={openRatingModal} className="group flex items-center gap-2 cursor-pointer" title="Rate this post">
                            <Star className="w-6 h-6 text-stone-300 group-hover:text-stone-400 transition-colors" />
                            <span className="text-2xl font-semibold text-stone-300 group-hover:text-stone-400 transition-colors">RATE</span>
                          </button>
                        )}
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
                          <span className="text-2xl font-bold text-stone-900">{postScores.imhb_score}/10</span>
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
                          <span className="text-2xl font-bold text-stone-900">{Math.round(postScores.rotten_potatoes)}%</span>
                          <div className="w-6 h-6">
                            {postScores.rotten_potatoes >= 60 ? (
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
                    <span className="text-xs text-stone-500">({postScores.voters_count || "XX"} Voters)</span>
                  </div>

                  {/* Bottom Row - YOUR RATING */}
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-medium text-stone-600">YOUR RATING</span>
                      <div className="flex items-center gap-2 mt-1">
                        {userRating && userRating > 0 ? (
                          <Rating
                            readonly
                            initialRating={userRating / 2}
                            emptySymbol={<Star className="w-6 h-6 stroke-stone-300" />}
                            fullSymbol={<Star className="w-6 h-6 fill-yellow-400 stroke-yellow-400" />}
                          />
                        ) : (
                          <button onClick={openRatingModal} className="group flex items-center gap-2 cursor-pointer" title="Rate this post">
                            <Star className="w-6 h-6 text-stone-300 group-hover:text-stone-400 transition-colors" />
                            <span className="text-2xl font-semibold text-stone-300 group-hover:text-stone-500 transition-colors">RATE</span>
                          </button>
                        )}
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
            <div className="sticky top-20">
              <div className="bg-stone-200 rounded-lg p-6 shadow-sm border border-stone-200">
                {/* Author Header - Horizontal Layout */}
                <div className="flex items-start gap-4 mb-4">
                  <Avatar 
                    src={publicAdmin?.profile_pic} 
                    alt={publicAdmin?.name ? `${publicAdmin?.name} profile picture` : "Author profile"}
                    size="xl"
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

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 w-80 md:w-100 shadow-xl">
            <div className="text-2xl font-medium text-center text-stone-700 mb-3">Give your score</div>
            <div className="flex items-center justify-center mb-3">
              <Rating
                fractions={2}
                initialRating={pendingStars}
                onChange={(val) => setPendingStars(val)}
                emptySymbol={<Star className="w-8 h-8 stroke-stone-300" />}
                fullSymbol={<Star className="w-8 h-8 fill-yellow-400 stroke-yellow-400" />}
              />
            </div>
            <p className="text-[10px] text-center text-stone-400 mb-4">Used for IMHb (in my head base) and Rotten Bananas.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowRatingModal(false)} className="px-4 py-2 rounded-full bg-stone-200 text-stone-700 hover:bg-stone-300 transition-colors cursor-pointer">Cancel</button>
              <button onClick={() => submitRating(pendingStars)} className="px-4 py-2 rounded-full bg-stone-800 text-white hover:bg-stone-900 transition-colors cursor-pointer">Save</button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default Post;
