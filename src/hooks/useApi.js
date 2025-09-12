import { useState } from 'react';
import axios from 'axios';

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

            // สร้าง query parameters
            const queryParams = new URLSearchParams();
            
            // เพิ่ม category ถ้าไม่ใช่ Highlight
            if (params.category && params.category !== 'Highlight') {
                queryParams.append('category', params.category);
            }
            
            // เพิ่ม keyword ถ้ามีการค้นหา
            if (params.keyword && params.keyword.trim()) {
                queryParams.append('keyword', params.keyword.trim());
            }
            
            // เพิ่ม page และ limit
            queryParams.append('page', params.page.toString());
            queryParams.append('limit', params.limit.toString());
            
            // สร้าง URL
            const url = `https://blog-post-project-api.vercel.app/posts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
            
            const response = await axios.get(url);
            
            return {
                data: response.data.posts || [],
                hasMore: response.data.posts?.length === params.limit
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

            // สร้าง URL สำหรับ single post
            const url = `https://blog-post-project-api.vercel.app/posts/${postId}`;
            
            const response = await axios.get(url);
            
            return {
                data: response.data.post || response.data
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
        fetchPost
    };
};
