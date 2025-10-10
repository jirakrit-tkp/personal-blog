import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getMarkdownHTML } from '../../lib/markdownUtils';

const AuthorSection = () => {
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
  AuthorSection.displayName = "AuthorSection";

  return (
    <section className="bg-neutral-50 py-16 px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 justify-center items-center">
        {/* Left Section - Text Content */}
        <div className="flex flex-col space-y-6 items-center lg:items-end flex-1 text-center lg:text-end">
          <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 leading-tight">
            Every Story<br/>
            Leaves a Trace
          </h1>
          <p className="text-lg text-neutral-700 leading-relaxed whitespace-pre-line">
            {'Discover honest thoughts, weird feelings, and random rants about stories that hit too hard.\nYou\'re now in Plotlines — my corner for every scene that stuck in my head.'}
          </p>
        </div>

        {/* Middle Section - Image */}
        <div className="flex justify-center flex-1">
          <div className="relative">
            <img 
              src={(publicAdmin?.profile_pic) || "https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg"}
              alt={(publicAdmin?.name) ? `${publicAdmin?.name} profile picture` : "Default profile picture"}
              className="rounded-2xl shadow-lg w-full max-w-[300px] lg:w-[386px] h-auto lg:h-[529px] object-cover"
            />
          </div>
        </div>

        {/* Right Section - Author Bio */}
        <div className="flex flex-col items-start space-y-4 flex-1 text-start">
          <p className="text-sm text-neutral-500 font-medium">-Author</p>
          <h2 className="text-2xl font-bold text-neutral-900">{publicAdmin?.name || 'Admin'}</h2>
          <div className="space-y-3 text-neutral-700 leading-relaxed">
            <div dangerouslySetInnerHTML={getMarkdownHTML(publicAdmin?.bio || '')} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthorSection;
