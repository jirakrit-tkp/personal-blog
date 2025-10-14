import { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

function Search({ onSearch, onSelectPost, selectedFilter }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Search suggestions from API
  useEffect(() => {
    if (query.length > 0) {
      setLoading(true);
      
      // Fetch search suggestions from Supabase
      const searchPosts = async () => {
        try {
          let q = supabase
            .from('posts')
            .select('title')
            .order('date', { ascending: false })
            .limit(10);

          if (selectedFilter && selectedFilter !== 'Highlight') {
            // Use genre name instead of category_id
            q = q.eq('genre', selectedFilter);
          }

          const kw = `%${query.trim()}%`;
          q = q.ilike('title', kw);

          const { data, error } = await q;
          if (error) throw error;

          const titles = (data || []).map(post => post.title);
          
          setSuggestions(titles);
          setIsOpen(true);
        } catch (error) {
          console.error('Error fetching search suggestions:', error);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      };

      // Debounce search
      const timeoutId = setTimeout(searchPosts, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query, selectedFilter]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    // Trigger search on every change
    if (newQuery.trim()) {
      onSearch?.(newQuery);
    } else {
      onSearch?.('');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setIsOpen(false);
    onSelectPost?.(suggestion);
  };

  const handleSearch = () => {
    if (query.trim()) {
      onSearch?.(query);
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full max-w-lg">
      {/* Search Input */}
      <div className="relative">
        <input
          ref={searchRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search articles..."
          className="w-full px-4 py-3 pr-12 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={handleSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600"
        >
          <SearchIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Search Suggestions Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-stone-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          {loading ? (
            <div className="p-4 text-center text-stone-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm">Searching...</p>
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="py-2">
              {suggestions.map((suggestion, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-3 text-left hover:bg-stone-50 focus:bg-stone-50 focus:outline-none transition-colors"
                  >
                    <span className="text-stone-900">{suggestion}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : query.length > 0 ? (
            <div className="p-4 text-center text-stone-500">
              <p className="text-sm">No articles found for {`"${query}"`}</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default Search;
