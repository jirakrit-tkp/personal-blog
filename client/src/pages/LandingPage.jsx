import { useState } from 'react'
import { NavBar, AuthorSection, Footer } from '../components/websection'
import ArticleSection from '../components/ArticleSection'

const LandingPage = () => {
  const [authorLoaded, setAuthorLoaded] = useState(false)

  return (
    <>
      <NavBar />
      <AuthorSection onLoadComplete={() => setAuthorLoaded(true)} />
      <ArticleSection shouldLoad={authorLoaded} />
      <Footer />
    </>
  )
}

LandingPage.displayName = 'LandingPage'

export default LandingPage
