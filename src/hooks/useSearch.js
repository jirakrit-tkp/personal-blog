import { useState, useEffect } from 'react';

export const useSearch = () => {
    const [selectedFilter, setSelectedFilter] = useState('Highlight');
    const [searchKeyword, setSearchKeyword] = useState('');

    // Debounce search keyword
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            // Trigger search when keyword changes
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchKeyword]);

    const updateFilter = (filter) => {
        setSelectedFilter(filter);
    };

    const updateSearchKeyword = (keyword) => {
        setSearchKeyword(keyword);
    };

    const resetSearch = () => {
        setSelectedFilter('Highlight');
        setSearchKeyword('');
    };

    return {
        selectedFilter,
        searchKeyword,
        updateFilter,
        updateSearchKeyword,
        resetSearch
    };
};
