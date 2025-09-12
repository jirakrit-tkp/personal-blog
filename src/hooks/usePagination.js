import { useState, useEffect } from 'react';

export const usePagination = (initialPage = 1, initialLimit = 6) => {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [postsPerPage, setPostsPerPage] = useState(initialLimit);
    const [hasMore, setHasMore] = useState(true);

    // Reset page เมื่อเปลี่ยน limit
    useEffect(() => {
        setCurrentPage(1);
        setHasMore(true);
    }, [postsPerPage]);

    const goToNextPage = () => {
        setCurrentPage(prev => prev + 1);
    };

    const resetPagination = () => {
        setCurrentPage(1);
        setHasMore(true);
    };

    const updateHasMore = (hasMoreData) => {
        setHasMore(hasMoreData);
    };

    return {
        currentPage,
        postsPerPage,
        hasMore,
        goToNextPage,
        resetPagination,
        updateHasMore,
        setPostsPerPage
    };
};
