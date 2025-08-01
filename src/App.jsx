import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'tailwindcss'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <NavBar />
      <HeroSection />
    </>
  )
}

function NavBar() {
  return (
    <nav class="flex flex-row justify-between items-center px-6 py-4 bg-neutral-50">
      {/* <!-- Logo --> */}
      <div class="text-lg font-semibold text-neutral-800">
        hh.
      </div>

      {/* <!-- Buttons --> */}
      <div class="flex items-center space-x-[8px]">
        <button class="px-4 py-1.5 border border-neutral-800 text-neutral-800 rounded-full text-sm">
          Log in
        </button>
        <button class="px-4 py-1.5 bg-neutral-900 text-white rounded-full text-sm">
          Sign up
        </button>
      </div>
    </nav>
  )
}

function HeroSection() {
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

export default App
