import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import { usePagination } from './usePagination';
import { useSearch } from './useSearch';

export const useArticles = () => {
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState(['Highlight']);
    const [categoriesLoaded, setCategoriesLoaded] = useState(false);
    
    const { loading, loadingMore, error, fetchPosts } = useApi();
    const { 
        currentPage, 
        postsPerPage, 
        hasMore, 
        goToNextPage, 
        resetPagination, 
        updateHasMore,
        setPostsPerPage 
    } = usePagination();
    const { 
        selectedFilter, 
        searchKeyword, 
        updateFilter, 
        updateSearchKeyword, 
        resetSearch 
    } = useSearch();

    // Extract unique categories from articles
    const extractCategories = (articlesData) => {
        const uniqueCategories = [...new Set(articlesData.map(article => article.category))];
        return ['Highlight', ...uniqueCategories.filter(cat => cat !== 'Highlight')];
    };

    // Load articles
    const loadArticles = async (isLoadMore = false) => {
        try {
            const params = {
                category: selectedFilter,
                keyword: searchKeyword,
                page: currentPage,
                limit: postsPerPage
            };

            const result = await fetchPosts(params, isLoadMore);
            
            if (isLoadMore) {
                // ถ้าเป็น load more ให้เพิ่มข้อมูลเข้าไปใน array เดิม
                setArticles(prev => [...prev, ...result.data]);
            } else {
                // ถ้าไม่ใช่ load more ให้แทนที่ข้อมูลทั้งหมด
                setArticles(result.data);
            }
            
            // ตรวจสอบว่ามีข้อมูลต่อหรือไม่
            updateHasMore(result.hasMore);
        } catch (err) {
            console.error('Error loading articles:', err);
            if (!isLoadMore) {
                setArticles([]);
            }
            updateHasMore(false);
        }
    };

    // Load more articles
    const loadMoreArticles = () => {
        goToNextPage();
    };

    // Reset articles when filter or search changes
    useEffect(() => {
        resetPagination();
        loadArticles();
    }, [selectedFilter, searchKeyword, postsPerPage]);

    // Load more when page changes
    useEffect(() => {
        if (currentPage > 1) {
            loadArticles(true);
        }
    }, [currentPage]);

    // Load categories from API (only once)
    const loadCategories = async () => {
        if (categoriesLoaded) return; // ไม่โหลดซ้ำ
        
        try {
            const params = {
                category: 'Highlight',
                keyword: '',
                page: 1,
                limit: 100 // เอาเยอะๆ เพื่อให้ได้ categories ครบ
            };

            const result = await fetchPosts(params, false);
            const newCategories = extractCategories(result.data);
            setCategories(newCategories);
            setCategoriesLoaded(true);
        } catch (err) {
            console.error('Error loading categories:', err);
        }
    };

    // Initial load
    useEffect(() => {
        loadCategories(); // โหลด categories ก่อน
        loadArticles();
    }, []);

    return {
        articles,
        categories,
        loading,
        loadingMore,
        error,
        hasMore,
        selectedFilter,
        searchKeyword,
        postsPerPage,
        updateFilter,
        updateSearchKeyword,
        loadMoreArticles,
        setPostsPerPage
    };
};
