import { motion } from 'framer-motion'

export default function Blogs() {
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
      transition: { duration: 0.3 }
    }
  }

  const blogs = [
    {
      title: "Getting Started with React Hooks",
      excerpt: "Learn how to use React Hooks to manage state and side effects in your functional components.",
      category: "React",
      date: "Apr 29, 2025",
      readTime: "5 min read",
      gradient: "from-pink-500 to-purple-500"
    },
    {
      title: "Building Responsive Layouts with Tailwind CSS",
      excerpt: "A comprehensive guide to creating beautiful, responsive layouts using Tailwind CSS utility classes.",
      category: "CSS",
      date: "Apr 28, 2025",
      readTime: "7 min read",
      gradient: "from-purple-500 to-orange-500"
    },
    {
      title: "Modern JavaScript Features You Should Know",
      excerpt: "Explore the latest JavaScript features that will make your code more elegant and efficient.",
      category: "JavaScript",
      date: "Apr 27, 2025",
      readTime: "6 min read",
      gradient: "from-orange-500 to-pink-500"
    },
    {
      title: "Introduction to Next.js 13",
      excerpt: "Discover the new features and improvements in Next.js 13 and how to use them in your projects.",
      category: "Next.js",
      date: "Apr 26, 2025",
      readTime: "8 min read",
      gradient: "from-pink-500 to-orange-500"
    },
    {
      title: "State Management with Redux Toolkit",
      excerpt: "Learn how to efficiently manage state in your React applications using Redux Toolkit.",
      category: "Redux",
      date: "Apr 25, 2025",
      readTime: "10 min read",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "TypeScript Best Practices",
      excerpt: "Essential TypeScript patterns and practices for writing maintainable and type-safe code.",
      category: "TypeScript",
      date: "Apr 24, 2025",
      readTime: "9 min read",
      gradient: "from-orange-500 to-purple-500"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-900 pt-28 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-pink-600/10 blur-3xl animate-pulse"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 rounded-full bg-purple-600/10 blur-3xl animate-pulse delay-300"></div>
        <div className="absolute -bottom-40 left-1/2 w-80 h-80 rounded-full bg-orange-600/10 blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 animate-gradient">
              Latest Blog Posts
            </span>
          </h1>
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
            Stay updated with the latest in web development. Discover tutorials, tips, and best practices.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {blogs.map((blog, index) => (
            <motion.article
              key={index}
              variants={itemVariants}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 text-sm rounded-full bg-gradient-to-r ${blog.gradient} text-white font-medium`}>
                    {blog.category}
                  </span>
                  <div className="flex items-center text-sm text-gray-400">
                    <span>{blog.readTime}</span>
                  </div>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 line-clamp-2">
                  {blog.title}
                </h2>
                <p className="text-gray-400 mb-4 line-clamp-3">
                  {blog.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{blog.date}</span>
                  <button className="text-pink-400 hover:text-pink-300 transition-colors duration-200 flex items-center gap-1 group">
                    Read more
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 transform transition-transform duration-200 group-hover:translate-x-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </div>
  )
}