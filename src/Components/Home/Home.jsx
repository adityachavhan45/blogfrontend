import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Home() {
  const features = [
    {
      title: 'Latest Tech Insights',
      description: 'Stay updated with the latest trends and technologies in web development.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      title: 'Expert Solutions',
      description: 'Find expert solutions to complex programming challenges and problems.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    },
    {
      title: 'Community Driven',
      description: 'Join a vibrant community of developers sharing knowledge and experiences.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  ]

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

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-12 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-pink-600/10 blur-3xl animate-pulse"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 rounded-full bg-purple-600/10 blur-3xl animate-pulse delay-300"></div>
        <div className="absolute -bottom-40 left-1/2 w-80 h-80 rounded-full bg-orange-600/10 blur-3xl animate-pulse delay-700"></div>
      </div>

      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.div 
          className="text-center max-w-3xl mx-auto pt-16 pb-24"
          variants={itemVariants}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 animate-gradient">
              Your Source for Tech Solutions
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 mb-12 leading-relaxed">
            Discover expert insights, tutorials, and best practices in web development.
            Join our community of developers and stay ahead in the tech world.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/blogs"
              className="w-full sm:w-auto px-8 py-3 rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white font-medium hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
            >
              Explore Blogs
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-3 rounded-lg border border-gray-700 text-white font-medium hover:bg-gray-800/50 transition-all duration-300"
            >
              Get in Touch
            </Link>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12"
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-orange-500/10 flex items-center justify-center mb-4">
                <div className="text-pink-400">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="mt-24 text-center"
          variants={itemVariants}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500">
              Ready to Get Started?
            </span>
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join our community of developers and start exploring the latest in tech solutions.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-8 py-3 rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white font-medium hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
          >
            Join Now
            <svg 
              className="ml-2 w-5 h-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 7l5 5m0 0l-5 5m5-5H6" 
              />
            </svg>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}