import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { NavBar, Footer } from '../components/WebSection.jsx'
import { useSinglePost } from '../hooks/useSinglePost'

function ViewPost() {
  const { id } = useParams();
  const { post, loading } = useSinglePost(id);

  // Scroll to top when component mounts or id changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-50">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading post...</p>
          </div>
        ) : post ? (
          <div className="max-w-7xl mx-auto">
            {/* Hero Image */}
            <div className="w-full h-[400px] sm:h-[500px] lg:h-[600px] mb-8 px-0 sm:px-6 lg:px-8">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover rounded-none sm:rounded-lg"
              />
            </div>

            {/* Article Content */}
            <div className="pb-12">
              <div className="w-full px-0 sm:px-6 lg:px-8">
                <div className="bg-white rounded-none sm:rounded-lg p-4 sm:p-8 lg:p-12">
                  {/* Category and Date */}
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {post.category}
                    </span>
                    <span className="text-gray-600 text-sm">
                      {new Date(post.date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    {post.title}
                  </h1>

                  {/* Introduction */}
                  <p className="text-lg sm:text-xl text-gray-700 mb-8 leading-relaxed">
                    {post.description}
                  </p>

                  {/* Article Content */}
                  <div className="markdown">
                    {post.content && (
                      <ReactMarkdown>
                        {post.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <Footer />
    </>
  )
}

export default ViewPost
