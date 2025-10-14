import { Link } from 'react-router-dom'
import { NavBar, Footer } from '../components/websection'

function NotFound() {
  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          {/* Icon */}
          <div className="mb-8">
            <div className="w-16 h-16 mx-auto border-2 border-black rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-black">!</span>
            </div>
          </div>
          
          {/* Text */}
          <h1 className="text-4xl font-bold text-black mb-8">Page Not Found</h1>
          
          {/* Button */}
          <Link 
            to="/"
            className="inline-block bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-stone-800 transition-colors"
          >
            Go To Homepage
          </Link>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default NotFound
