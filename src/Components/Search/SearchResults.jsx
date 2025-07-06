import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setBlogs([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/search?q=${encodeURIComponent(query)}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch search results')
        }
        
        const data = await response.json()
        setBlogs(data)
        setLoading(false)
      } catch (err) {
        console.error('Search error:', err)
        setError('Failed to load search results. Please try again.')
        setLoading(false)
      }
    }

    fetchSearchResults()
  }, [query])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
          <span className="block">Search Results</span>
        </h1>
        <p className="mt-4 text-xl text-gray-400">
          {query ? `Showing results for "${query}"` : 'Enter a search term to find blogs'}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-400 text-lg">
            {query ? 'No blogs found matching your search.' : 'Enter a search term to find blogs'}
          </p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {blogs.map((blog) => (
            <motion.div 
              key={blog._id} 
              className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-md overflow-hidden hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
              variants={itemVariants}
            >
              <Link to={`/blog/${blog._id}`}>
                {blog.coverImage && (
                  <div className="h-48 w-full overflow-hidden">
                    <img 
                      src={`${import.meta.env.VITE_API_URL}${blog.coverImage}`} 
                      alt={blog.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2 py-1 text-xs font-semibold bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 rounded-full">
                      {blog.category || 'General'}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(blog.createdAt)}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-500 transition-all duration-300">{blog.title}</h2>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {blog.summary}
                  </p>
                  <div className="flex items-center">
                    <div className="text-sm">
                      <p className="text-white font-semibold">
                        {blog.author?.username || 'Anonymous'}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
