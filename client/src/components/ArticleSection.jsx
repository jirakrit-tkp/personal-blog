import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { LinkedinIcon, Github, Mail, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useArticles } from '@/hooks/useArticles';
import SearchComponent from './Search';
import CustomDropdown from './ui/CustomDropdown.jsx';

function ArticleSection() {
    const filterScrollRef = useRef(null);
    const scrollFilters = (dx) => {
        if (filterScrollRef.current) {
            filterScrollRef.current.scrollBy({ left: dx, behavior: 'smooth' });
        }
    };
    const {
        articles: blogPosts,
        categories: filters,
        loading,
        loadingMore,
        hasMore,
        selectedFilter,
        searchKeyword,
        updateFilter,
        updateSearchKeyword,
        loadMoreArticles
    } = useArticles();
    
    return (
        <section className="py-12 px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Heading */}
                    <h2 className="text-3xl font-bold text-stone-900 mb-8">
                        Latest articles
                    </h2>
                    
                    {/* Desktop Layout */}
                    <div className="hidden lg:block bg-stone-100 rounded-lg p-4 mb-8">
                        <div className="flex justify-between items-center gap-4">
                            {/* Left side - Filters/Categories (fixed width + horizontal scroll) */}
                            <div className="relative flex-1 min-w-0">
                                {/* Left button */}
                                <button
                                    type="button"
                                    onClick={() => scrollFilters(-200)}
                                    className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white border border-stone-200 rounded-full p-1 shadow-sm"
                                    aria-label="Scroll left"
                                >
                                    <ChevronLeft className="w-4 h-4 text-stone-700" />
                                </button>
                                
                                <div ref={filterScrollRef} className="flex items-center gap-3 w-full overflow-x-auto no-scrollbar flex-nowrap pr-10 pl-10">
                                    {filters.map((filter, idx) => (
                                        <button
                                            key={`${filter}-${idx}`}
                                            onClick={() => updateFilter(filter)}
                                            className={`px-4 py-2 rounded-lg font-medium transition-colors flex-shrink-0 ${
                                                selectedFilter === filter
                                                    ? 'bg-stone-200 text-stone-800'
                                                    : 'text-stone-600 hover:text-stone-800'
                                            }`}
                                        >
                                            {filter}
                                        </button>
                                    ))}
                                </div>
                                {/* Right button */}
                                <button
                                    type="button"
                                    onClick={() => scrollFilters(200)}
                                    className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white border border-stone-200 rounded-full p-1 shadow-sm"
                                    aria-label="Scroll right"
                                >
                                    <ChevronRight className="w-4 h-4 text-stone-700" />
                                </button>
                            </div>
                            
                            {/* Right side - Search */}
                            <div className="w-80">
                                <SearchComponent 
                                    onSearch={(query) => updateSearchKeyword(query)}
                                    onSelectPost={(title) => updateSearchKeyword(title)}
                                    selectedFilter={selectedFilter}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="lg:hidden bg-stone-100 rounded-lg p-4 mb-8">
                        <div className="space-y-4">
                            {/* Search Input */}
                            <div className="w-full">
                                <SearchComponent 
                                    onSearch={(query) => updateSearchKeyword(query)}
                                    onSelectPost={(title) => updateSearchKeyword(title)}
                                    selectedFilter={selectedFilter}
                                />
                            </div>
                            
                            {/* Genre Dropdown */}
                            <CustomDropdown 
                              label="Genre"
                              options={filters}
                              value={selectedFilter}
                              onChange={updateFilter}
                              placeholder="Select genre..."
                              searchable={true}
                              className="w-full"
                            />
                        </div>
                    </div>

                    {/* Posts Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[...Array(4)].map((_, index) => (
                                <LoadingCard key={index} />
                            ))}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {blogPosts.map((article, idx) => (
                                    <BlogCard key={`${article?.id ?? article?.title ?? 'post'}-${idx}`} {...article} />
                                ))}
                            </div>
                            
                            {/* Loading indicator when loading more */}
                            {loadingMore && (
                                <div className="mt-6 text-center">
                                    <div className="inline-flex items-center gap-2 text-stone-500">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-stone-700"></div>
                                        <span className="text-sm">Loading more posts...</span>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* View More Controls */}
                    {!loading && blogPosts.length > 0 && (
                        <div className="mt-8 flex flex-col items-center gap-6">
                            {/* View More button - Centered and Bigger */}
                            <button
                                onClick={loadMoreArticles}
                                disabled={!hasMore || loadingMore}
                                className={`px-8 py-3 text-base font-semibold rounded-lg transition-colors ${
                                    hasMore && !loadingMore
                                        ? 'bg-stone-600 text-white hover:bg-stone-700'
                                        : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                                }`}
                            >
                                {loadingMore ? 'Loading...' : hasMore ? 'View More' : 'No more posts'}
                            </button>

                            {/* Posts per page selector removed: fixed at 6 via pagination hook default */}
                        </div>
                    )}
                </div>
        </section>
    )
}

function BlogCard(props) {
    // Handle genres array from post_genres relationship
    const genres = props.genres || [];
    const primaryGenre = genres.length > 0 ? genres[0].name : 'Uncategorized';
    
    return (
        <div className="flex flex-col gap-4">
          <Link to={`/post/${props.id}`} className="relative h-[212px] sm:h-[360px]">
            <img className="w-full h-full object-cover rounded-md" src={props.image} alt={props.title}/>
          </Link>
          <div className="flex flex-col">
            <div className="flex flex-wrap gap-2 mb-2">
              {genres.map((genre, idx) => (
                <span key={`${genre.id}-${idx}`} className="bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-green-600">
                  {genre.name}
                </span>
              ))}
              {genres.length === 0 && (
                <span className="bg-stone-200 rounded-full px-3 py-1 text-sm font-semibold text-stone-600">
                  Uncategorized
                </span>
              )}
            </div>
            <Link to={`/post/${props.id}`}>
              <h2 className="text-start font-bold text-xl mb-2 line-clamp-2 hover:underline">
              {props.title}
              </h2>
            </Link>
            <p className="text-muted-foreground text-stone-400 text-sm mb-4 flex-grow line-clamp-3">
            {props.description}</p>
            <div className="flex items-center justify-between text-sm">
              {props.author && (
                <div className="flex items-center">
                  {props.author.profile_pic && (
                    <img className="w-8 h-8 rounded-full mr-2 object-cover" src={props.author.profile_pic} alt={props.author.name || ''} />
                  )}
                  {props.author.name && (
                    <span>{props.author.name}</span>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2">
                <span>{props.likes_count || 0} likes</span>
                <span className="text-stone-300">|</span>
                <span>{new Date(props.created_at || props.date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      );
}

function LoadingCard() {
    return (
        <div className="flex flex-col gap-4 animate-pulse">
            {/* Image skeleton */}
            <div className="h-[212px] sm:h-[360px] bg-stone-200 rounded-md flex items-center justify-center">
                <span className="text-stone-400 text-sm">Loading...</span>
            </div>
            
            <div className="flex flex-col gap-3">
                {/* Category skeleton */}
                <div className="h-6 w-20 bg-stone-200 rounded-full"></div>
                
                {/* Title skeleton */}
                <div className="space-y-2">
                    <div className="h-5 bg-stone-200 rounded w-3/4"></div>
                    <div className="h-5 bg-stone-200 rounded w-1/2"></div>
                </div>
                
                {/* Description skeleton */}
                <div className="space-y-2">
                    <div className="h-4 bg-stone-200 rounded w-full"></div>
                    <div className="h-4 bg-stone-200 rounded w-full"></div>
                    <div className="h-4 bg-stone-200 rounded w-2/3"></div>
                </div>
                
                {/* Author info skeleton */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-stone-200 rounded-full"></div>
                    <div className="h-4 bg-stone-200 rounded w-24"></div>
                    <div className="h-4 bg-stone-200 rounded w-16"></div>
                </div>
            </div>
        </div>
    );
}

export default ArticleSection
