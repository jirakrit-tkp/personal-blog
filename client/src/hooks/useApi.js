import { useState } from 'react';
import { supabase } from '../lib/supabase';

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

            // คำนวณช่วงข้อมูลสำหรับ Supabase range
            const pageNumber = Number(params.page) || 1;
            const pageSize = Number(params.limit) || 6;
            const from = (pageNumber - 1) * pageSize;
            const to = from + pageSize - 1;

            let query = supabase
                .from('posts')
                .select('*', { count: 'exact' })
                .order('date', { ascending: false })
                .range(from, to);

            // กรองตาม category ถ้ามีและไม่ใช่ Highlight
            if (params.category && params.category !== 'Highlight') {
                // ถ้า category เป็นตัวเลข ให้ใช้เป็น category_id
                if (!Number.isNaN(Number(params.category))) {
                    query = query.eq('category_id', Number(params.category));
                }
            }

            // ค้นหาด้วย keyword
            if (params.keyword && params.keyword.trim()) {
                const kw = `%${params.keyword.trim()}%`;
                query = query.or(
                    `title.ilike.${kw},description.ilike.${kw},content.ilike.${kw}`
                );
            }

            const { data, error, count } = await query;
            if (error) throw error;

            return {
                data: data || [],
                hasMore: Boolean(count && to + 1 < count)
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

            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('id', postId)
                .single();

            if (error) throw error;

            return { data };
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
