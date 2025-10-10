import ReactMarkdown from 'react-markdown';
import Comment from './Comment';

function Post({ post, loading }) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto">
        {/* Hero Image */}
        <div className="w-full h-auto pt-8 mb-8 px-0 sm:px-6 lg:px-8">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover rounded-none sm:rounded-lg"
          />
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8 px-0 sm:px-6 lg:px-8 pb-12">
          {/* Left Column - Article Content (80%) */}
          <div className="w-full lg:w-4/5">
            <div className="p-4 sm:p-8 lg:p-12">
              {/* Category and Date */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {post.category}
                </span>
                <span className="text-gray-600 text-sm">
                  {new Date(post.created_at || post.date).toLocaleDateString('en-GB', {
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

          {/* Right Column - Author Box (20%) - Top-bottom on small, right on large */}
          <div className="w-full lg:w-1/5">
            <div className="sticky top-8">
              <div className="bg-neutral-200 sm:rounded-lg p-6 shadow-sm border border-gray-200">
                {/* Author Header - Horizontal Layout */}
                <div className="flex items-start gap-4 mb-4">
                  <img 
                    className="w-12 h-12 rounded-full flex-shrink-0" 
                    src="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg" 
                    alt="Author profile"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Author</p>
                    <h4 className="font-semibold text-gray-900">Thompson P.</h4>
                  </div>
                </div>

                {/* Separator Line */}
                <div className="border-t border-gray-400 mb-4"></div>

                {/* Author Bio */}
                <div className="space-y-3 text-sm text-gray-700">
                  <p>
                    I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness.
                  </p>
                  <p>
                    When I'm not writing, I spend time volunteering at my local animal shelter, helping cats find loving homes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="px-0 sm:px-6 lg:px-8 pb-12">
          <Comment postId={post?.id} />
        </div>
      </div>
    </div>
  );
}

export default Post;
