import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { LandingPage, ViewPost, NotFound } from './pages'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/post/:id" element={<ViewPost />} />
        <Route path="*" element={<NotFound />} />
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  )
}

export default App
