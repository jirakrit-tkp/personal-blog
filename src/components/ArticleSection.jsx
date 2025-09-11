import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { useState, useEffect } from 'react';
import { LinkedinIcon, Github, Mail, Search } from 'lucide-react';
import { blogPosts } from '@/data/blogPosts';
import axios from 'axios';

function ArticleSection() {
    const [selectedFilter, setSelectedFilter] = useState('Highlight');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(6);
    const [blogPosts, setBlogPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const getPosts = async (isLoadMore = false) => {
        try {
            if (isLoadMore) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }
            
            // สร้าง query parameters
            const params = new URLSearchParams();
            
            // เพิ่ม category ถ้าไม่ใช่ Highlight
            if (selectedFilter !== 'Highlight') {
                params.append('category', selectedFilter);
            }
            
            // เพิ่ม keyword ถ้ามีการค้นหา
            if (searchKeyword.trim()) {
                params.append('keyword', searchKeyword.trim());
            }
            
            // เพิ่ม page และ limit
            params.append('page', currentPage.toString());
            params.append('limit', postsPerPage.toString());
            
            // สร้าง URL
            const url = `https://blog-post-project-api.vercel.app/posts${params.toString() ? `?${params.toString()}` : ''}`;
            
            const postsData = await axios.get(url);
            console.log(postsData);
            
            if (isLoadMore) {
                // ถ้าเป็น load more ให้เพิ่มข้อมูลเข้าไปใน array เดิม
                setBlogPosts(prev => [...prev, ...postsData.data.posts]);
            } else {
                // ถ้าไม่ใช่ load more ให้แทนที่ข้อมูลทั้งหมด
                setBlogPosts(postsData.data.posts);
            }
            
            // ตรวจสอบว่ามีข้อมูลต่อหรือไม่
            setHasMore(postsData.data.posts.length === postsPerPage);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setBlogPosts([]);
            setHasMore(false);
        } finally {
            if (isLoadMore) {
                setLoadingMore(false);
            } else {
                setLoading(false);
            }
        }
    }
    console.log(blogPosts)

    // Initial load
    useEffect(() => {
        getPosts();
    }, []);

    // Reset page เมื่อเปลี่ยน filter หรือ search
    useEffect(() => {
        setCurrentPage(1);
        setHasMore(true);
    }, [selectedFilter, searchKeyword]);

    // Debounce search keyword และ filter changes
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            getPosts();
        }, 500); // รอ 500ms หลังจากผู้ใช้หยุดพิมพ์

        return () => clearTimeout(timeoutId);
    }, [selectedFilter, searchKeyword, postsPerPage]);

    // Load more เมื่อ page เปลี่ยน
    useEffect(() => {
        if (currentPage > 1) {
            getPosts(true); // isLoadMore = true
        }
    }, [currentPage]);

    // Function สำหรับ load more
    const handleLoadMore = () => {
        setCurrentPage(prev => prev + 1);
    };
    
    const filters = ['Highlight', 'Cat', 'Inspiration', 'General'];
    // const articles = blogPosts;
    
    return (
        <section className="py-12 px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Heading */}
                    <h2 className="text-3xl font-bold text-neutral-900 mb-8">
                        Latest articles
                    </h2>
                    
                    {/* Desktop Layout */}
                    <div className="hidden lg:block bg-neutral-100 rounded-lg p-4 mb-8">
                        <div className="flex justify-between items-center">
                            {/* Left side - Filters/Categories */}
                            <div className="flex items-center space-x-6">
                                {filters.map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => setSelectedFilter(filter)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                            selectedFilter === filter
                                                ? 'bg-neutral-200 text-neutral-800'
                                                : 'text-neutral-600 hover:text-neutral-800'
                                        }`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                            
                            {/* Right side - Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
                                <Input 
                                    type="text" 
                                    placeholder="Search" 
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-64 bg-white border-neutral-200 focus:border-neutral-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="lg:hidden bg-neutral-100 rounded-lg p-4 mb-8">
                        <div className="space-y-4">
                            {/* Search Input */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
                                <Input 
                                    type="text" 
                                    placeholder="Search" 
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-full bg-white border-neutral-200 focus:border-neutral-400"
                                />
                            </div>
                            
                            {/* Category Label */}
                            <div className="text-neutral-800 font-medium">
                                Category
                            </div>
                            
                            {/* Category Select */}
                            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                                <SelectTrigger className="w-full bg-white border-neutral-200 focus:border-neutral-400">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filters.map((filter) => (
                                        <SelectItem key={filter} value={filter}>
                                            {filter}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                                {blogPosts.map((article) => (
                                    <BlogCard key={article.id} {...article} />
                                ))}
                            </div>
                            
                            {/* Loading indicator when loading more */}
                            {loadingMore && (
                                <div className="mt-6 text-center">
                                    <div className="inline-flex items-center gap-2 text-gray-500">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
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
                                onClick={handleLoadMore}
                                disabled={!hasMore || loadingMore}
                                className={`px-8 py-3 text-base font-semibold rounded-lg transition-colors ${
                                    hasMore && !loadingMore
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                {loadingMore ? 'Loading...' : hasMore ? 'View More' : 'No more posts'}
                            </button>

                            {/* Posts per page selector - Smaller and below */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">Show:</span>
                                <Select value={postsPerPage.toString()} onValueChange={(value) => setPostsPerPage(parseInt(value))}>
                                    <SelectTrigger className="w-16 h-8 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="3">3</SelectItem>
                                        <SelectItem value="6">6</SelectItem>
                                        <SelectItem value="9">9</SelectItem>
                                        <SelectItem value="12">12</SelectItem>
                                    </SelectContent>
                                </Select>
                                <span className="text-xs text-gray-500">posts per page</span>
                            </div>
                        </div>
                    )}
                </div>
        </section>
    )
}

function BlogCard(props) {
    return (
        <div className="flex flex-col gap-4">
          <a href="#" className="relative h-[212px] sm:h-[360px]">
            <img className="w-full h-full object-cover rounded-md" src={props.image} alt={props.title}/>
          </a>
          <div className="flex flex-col">
            <div className="flex">
              <span className="bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-green-600 mb-2">{props.category}
              </span>
            </div>
            <a href="#" >
              <h2 className="text-start font-bold text-xl mb-2 line-clamp-2 hover:underline">
              {props.title}
              </h2>
            </a>
            <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-3">
            {props.description}</p>
            <div className="flex items-center text-sm">
              <img className="w-8 h-8 rounded-full mr-2" src="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg" alt="Tomson P." />
              <span>{props.author}</span>
              <span className="mx-2 text-gray-300">|</span>
              <span>{props.date}</span>
            </div>
          </div>
        </div>
      );
}

function LoadingCard() {
    return (
        <div className="flex flex-col gap-4 animate-pulse">
            {/* Image skeleton */}
            <div className="h-[212px] sm:h-[360px] bg-gray-200 rounded-md flex items-center justify-center">
                <span className="text-gray-400 text-sm">Loading...</span>
            </div>
            
            <div className="flex flex-col gap-3">
                {/* Category skeleton */}
                <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                
                {/* Title skeleton */}
                <div className="space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                </div>
                
                {/* Description skeleton */}
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
                
                {/* Author info skeleton */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
            </div>
        </div>
    );
}

export default ArticleSection
