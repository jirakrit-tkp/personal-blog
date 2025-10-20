import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getMarkdownHTML } from '../../lib/markdownUtils';
import { User } from 'lucide-react';

const AuthorSection = ({ onLoadComplete }) => {
  const [publicAdmin, setPublicAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const fetchPublicAdmin = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001/api';
        const adminId = import.meta.env.VITE_PUBLIC_ADMIN_ID; // UUID of admin user
        if (!adminId) { 
          setLoading(false); 
          if (onLoadComplete) onLoadComplete();
          return; 
        }
        const res = await axios.get(`${apiBase}/profiles/${adminId}`, { signal: controller.signal });
        if (res?.data?.success) {
          setPublicAdmin(res.data.data);
        }
      } catch (err) {
        // silent fail; will fallback to defaults
      } finally {
        setLoading(false);
        if (onLoadComplete) onLoadComplete();
      }
    };

    fetchPublicAdmin();
    return () => controller.abort();
  }, [onLoadComplete]);
  AuthorSection.displayName = "AuthorSection";

  return (
    <section className="bg-stone-50 py-16 px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 justify-center items-center">
        {loading || !publicAdmin ? (
          <>
            {/* Left skeleton (match article style) */}
            <div className="flex flex-col space-y-6 items-center lg:items-end flex-1 text-center lg:text-end w-full animate-pulse">
              <div className="h-10 w-64 bg-stone-200 rounded" />
              <div className="h-10 w-80 bg-stone-200 rounded" />
              <div className="h-20 w-full max-w-md bg-stone-200 rounded" />
            </div>

            {/* Middle skeleton - blank card (no image while loading) */}
            <div className="flex justify-center flex-1 w-full">
              <div className="rounded-2xl bg-stone-200 w-full max-w-[300px] lg:w-[386px] h-[420px] lg:h-[529px] shadow-lg" aria-hidden="true" />
            </div>

            {/* Right skeleton */}
            <div className="flex flex-col items-start space-y-4 flex-1 text-start w-full animate-pulse">
              <div className="h-4 w-20 bg-stone-200 rounded" />
              <div className="h-6 w-40 bg-stone-200 rounded" />
              <div className="space-y-3 w-full">
                <div className="h-4 w-11/12 bg-stone-200 rounded" />
                <div className="h-4 w-10/12 bg-stone-200 rounded" />
                <div className="h-4 w-9/12 bg-stone-200 rounded" />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Left Section - Text Content */}
            <div className="flex flex-col space-y-6 items-center lg:items-end flex-1 text-center lg:text-end">
              <h1 className="text-4xl lg:text-5xl font-bold text-stone-900 leading-tight">
                Every Story<br/>
                Leaves a Trace
              </h1>
              <p className="text-lg text-stone-700 leading-relaxed whitespace-pre-line">
                {'Discover honest thoughts, weird feelings, and random rants about stories that hit too hard.\nYou\'re now in Plotlines — my corner for every scene that stuck in my head.'}
              </p>
            </div>

            {/* Middle Section - Image */}
            <div className="flex justify-center flex-1">
              <div className="relative">
                {publicAdmin?.profile_pic ? (
                  <img 
                    src={publicAdmin.profile_pic}
                    alt={`${publicAdmin?.name || 'Author'} profile picture`}
                    className="rounded-2xl shadow-lg w-full max-w-[300px] lg:w-[386px] h-auto lg:h-[529px] object-cover"
                  />
                ) : (
                  <div className="rounded-2xl bg-stone-200 w-full max-w-[300px] lg:w-[386px] h-[420px] lg:h-[529px] shadow-lg flex items-center justify-center" aria-hidden="true">
                    <User className="w-24 h-24 text-stone-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Right Section - Author Bio */}
            <div className="flex flex-col items-start space-y-4 flex-1 text-start">
              <p className="text-sm text-stone-500 font-medium">-Author</p>
              {publicAdmin?.name && (
                <h2 className="text-2xl font-bold text-stone-900">{publicAdmin.name}</h2>
              )}
              <div className="space-y-3 text-stone-700 leading-relaxed">
                <div dangerouslySetInnerHTML={getMarkdownHTML(publicAdmin?.bio || '')} />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default AuthorSection;
