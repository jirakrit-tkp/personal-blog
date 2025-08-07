import { LinkedinIcon, Github, Mail, Search } from 'lucide-react';
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { useState } from 'react';

export function NavBar() {
    return (
      <nav className="flex flex-row justify-between items-center px-6 py-4 bg-neutral-50">
        {/* <!-- Logo --> */}
        <div className="text-lg font-semibold text-neutral-800">
          hh.
        </div>
  
        {/* <!-- Buttons --> */}
        <div className="flex items-center space-x-[8px]">
          <button className="px-4 py-1.5 border border-neutral-800 text-neutral-800 rounded-full text-sm">
            Log in
          </button>
          <button className="px-4 py-1.5 bg-neutral-900 text-white rounded-full text-sm">
            Sign up
          </button>
        </div>
      </nav>
    )
}

export function HeroSection() {
    return (
      <section className="bg-neutral-50 py-16 px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 justify-center items-center">
          {/* Left Section - Text Content */}
          <div className="flex flex-col space-y-6 items-center lg:items-end flex-1 text-center lg:text-end">
            <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 leading-tight">
              Stay<br />Informed,<br />
              Stay Inspired
            </h1>
            <p className="text-lg text-neutral-700 leading-relaxed">
              Discover a World of Knowledge at Your Fingertips. Your Daily Dose of Inspiration and Information.
            </p>
          </div>
  
          {/* Middle Section - Image */}
          <div className="flex justify-center flex-1">
            <div className="relative">
              <img 
                src="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg" 
                alt="A man with a beard wearing a beanie and plaid shirt with a black and white cat on his shoulder in an autumn forest setting"
                className="rounded-2xl shadow-lg w-full max-w-[300px] lg:w-[386px] h-auto lg:h-[529px] object-cover"
              />
            </div>
          </div>
  
          {/* Right Section - Author Bio */}
          <div className="flex flex-col items-start space-y-4 flex-1 text-start">
            <p className="text-sm text-neutral-500 font-medium">-Author</p>
            <h2 className="text-2xl font-bold text-neutral-900">Thompson P.</h2>
            <div className="space-y-3 text-neutral-700 leading-relaxed">
              <p>
                I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness.
              </p>
              <p>
                When I'm not writing, I spends time volunteering at my local animal shelter, helping cats find loving homes.
              </p>
            </div>
          </div>
        </div>
      </section>
    )
}

export function Footer() {
    return (
        <footer className="bg-neutral-100">
            <div className="bg-neutral-50 px-6 py-4">
                <div className="flex justify-between items-center">
                    {/* Left side - Flex container with "Get in touch" and social icons */}
                    <div className="flex items-center space-x-6">
                        {/* Left-left - "Get in touch" text */}
                        <div className="text-neutral-800 font-medium text-sm">
                            Get in touch
                        </div>
                        
                        {/* Left-right - Social media icons */}
                        <div className="flex items-center space-x-4">
                            <a 
                                href="#" 
                                className="text-neutral-800 hover:text-neutral-600 transition-colors"
                                aria-label="LinkedIn"
                            >
                                <LinkedinIcon size={10} />
                            </a>
                            <a 
                                href="#" 
                                className="text-neutral-800 hover:text-neutral-600 transition-colors"
                                aria-label="GitHub"
                            >
                                <Github size={10} />
                            </a>
                            <a 
                                href="mailto:contact@example.com" 
                                className="text-neutral-800 hover:text-neutral-600 transition-colors"
                                aria-label="Email"
                            >
                                <Mail size={10} />
                            </a>
                        </div>
                    </div>
                    
                    {/* Right side - "Home page" link */}
                    <div>
                        <a 
                            href="#" 
                            className="text-neutral-800 underline hover:text-neutral-600 transition-colors text-sm"
                        >
                            Home page
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export function ArticleSection() {
    const [selectedFilter, setSelectedFilter] = useState('Highlight');
    
    const filters = ['Highlight', 'Cat', 'Inspiration', 'General'];
    
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
            </div>
        </section>
    )
}