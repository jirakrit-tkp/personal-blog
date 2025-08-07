import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from './components/ui/button'
import { NavBar, HeroSection, Footer} from './components/WebSection.jsx'
import ArticleSection from './components/ArticleSection'

function App() {
  return (
    <>
      <NavBar />
      <HeroSection />
      <ArticleSection />
      <Footer />
    </>
  )
}

export default App
