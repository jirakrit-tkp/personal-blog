import { useState, useEffect } from 'react';
import { useApi } from './useApi';

export const useSinglePost = (postId) => {
    const [post, setPost] = useState(null);
    
    const { loading, error, fetchPost } = useApi();

    const loadPost = async () => {
        if (!postId) return;
        
        try {
            const result = await fetchPost(postId);
            setPost(result.data);
        } catch (err) {
            console.error('Error loading post:', err);
            setPost(null);
        }
    };

    // Load post when postId changes
    useEffect(() => {
        loadPost();
    }, [postId]);

    return {
        post,
        loading,
        error,
        loadPost
    };
};
