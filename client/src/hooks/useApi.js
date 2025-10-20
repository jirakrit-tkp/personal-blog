import { useState } from 'react';

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);

    const fetchPosts = async (params, isLoadMore = false) => {
        try {
            if (isLoadMore) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }
            setError(null);

            // เรียก backend API แทนการใช้ Supabase โดยตรง
            const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001/api";
            const queryParams = new URLSearchParams();
            
            if (params.page) queryParams.append('page', params.page);
            if (params.limit) queryParams.append('limit', params.limit);
            if (params.category && params.category !== 'Highlight') {
                queryParams.append('category', params.category);
            }
            if (params.keyword) queryParams.append('keyword', params.keyword);

            const response = await fetch(`${apiBase}/posts?${queryParams}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            
            return {
                data: data.posts || [],
                hasMore: Boolean(data.nextPage)
            };
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            if (isLoadMore) {
                setLoadingMore(false);
            } else {
                setLoading(false);
            }
        }
    };

    const fetchPost = async (postId) => {
        try {
            setLoading(true);
            setError(null);

            // เรียก backend API แทนการใช้ Supabase โดยตรง
            const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001/api";
            const response = await fetch(`${apiBase}/posts/${postId}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const result = await response.json();
            
            return { data: result.data };
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchAdminPosts = async (params) => {
        try {
            setLoading(true);
            setError(null);

            // เรียก admin endpoint ที่ fetch posts ทั้งหมด (รวม draft)
            const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001/api";
            const queryParams = new URLSearchParams();
            
            if (params.page) queryParams.append('page', params.page);
            if (params.limit) queryParams.append('limit', params.limit);

            const response = await fetch(`${apiBase}/posts/admin/all?${queryParams}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            
            return {
                data: data.posts || [],
                hasMore: Boolean(data.nextPage)
            };
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        loadingMore,
        error,
        fetchPosts,
        fetchPost,
        fetchAdminPosts
    };
};
