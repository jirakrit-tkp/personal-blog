import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { LandingPage, ViewPost, NotFound, Login, Signup } from './pages'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/post/:id" element={<ViewPost />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
