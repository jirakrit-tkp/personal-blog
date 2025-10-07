import { LinkedinIcon, Github, Mail, Search, AlignJustify } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from 'react-router-dom';

export function NavBar() {
    return (
      <nav className="flex flex-row justify-between items-center px-6 py-4 bg-neutral-50 border-b border-neutral-200">
        {/* <!-- Logo --> */}
        <img src="./public/Plotline_text.svg" alt="Plotline logo" className="w-25 h-25 mx-10 -my-25"/>
  
        {/* <!-- Buttons --> */}
        <div className="flex items-center space-x-[8px] max-sm:hidden">
          <Link 
            to="/login"
            className="px-4 py-1.5 border border-neutral-800 text-neutral-800 rounded-full text-sm hover:bg-neutral-100 transition-colors"
          >
            Log in
          </Link>
          <Link 
            to="/signup"
            className="px-4 py-1.5 bg-neutral-900 text-white rounded-full text-sm hover:bg-neutral-800 transition-colors"
          >
            Sign up
          </Link>
        </div>
        
        {/* <!-- Buttons Mobile --> */}
        <div className="sm:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild><AlignJustify /></DropdownMenuTrigger>
            <DropdownMenuContent className="w-[100vw] border-0 rounded-none">
              <div className="space-y-4 p-2">
                <DropdownMenuItem className="hover:bg-transparent p-0">
                  <Link 
                    to="/login"
                    className="w-full px-4 py-3 border border-neutral-800 text-neutral-800 rounded-full text-sm hover:bg-neutral-100 transition-colors block text-center"
                  >
                    Log in
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-transparent p-0">
                  <Link 
                    to="/signup"
                    className="w-full px-4 py-3 bg-neutral-900 text-white rounded-full text-sm hover:bg-neutral-800 transition-colors block text-center"
                  >
                    Sign up
                  </Link>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
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
              Every Story<br/>
              Leaves a Trace
            </h1>
            <p className="text-lg text-neutral-700 leading-relaxed">
              Discover honest thoughts, weird feelings, and random rants about stories that hit too hard.
              You’re now in Plotlines — my corner for every scene that stuck in my head.
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
            <div className="bg-neutral-200 px-6 py-4">
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
                        <Link 
                            to={"/"}
                            className="text-neutral-800 underline hover:text-neutral-600 transition-colors text-sm"
                        >
                            Home page
                        </Link >
                    </div>
                </div>
            </div>
        </footer>
    )
}