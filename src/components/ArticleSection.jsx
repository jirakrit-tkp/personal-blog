import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { useState } from 'react';
import { LinkedinIcon, Github, Mail, Search } from 'lucide-react';
import { blogPosts } from '@/data/blogPosts';

function ArticleSection() {
    const [selectedFilter, setSelectedFilter] = useState('Highlight');
    
    const filters = ['Highlight', 'Cat', 'Inspiration', 'General'];
    const articles = blogPosts;
    
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

                    {/* Articles Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {articles.map((article) => (
                            <BlogCard key={article.id} {...article} />
                        ))}
                    </div>
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
export default ArticleSection
