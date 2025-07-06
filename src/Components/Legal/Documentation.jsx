import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Documentation() {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
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

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
        </svg>
      ),
      content: (
        <>
          <p>
            Welcome to LikhoVerse! This documentation will help you navigate and make the most of our platform.
            Whether you're looking to read blogs, create an account, or interact with our community, you'll find
            all the information you need here.
          </p>
          
          <h3>Creating an Account</h3>
          <p>
            To create an account, click on the "Login" button in the top navigation bar and select "Create Account".
            You'll need to provide:
          </p>
          <ul>
            <li>A valid email address</li>
            <li>A username</li>
            <li>A secure password</li>
          </ul>
          
          <h3>Browsing Blogs</h3>
          <p>
            You can browse blogs without creating an account. Simply navigate to the "Blogs" section to see all
            available content. You can filter blogs by category or use the search function to find specific topics.
          </p>
          
          <h3>Interacting with Content</h3>
          <p>
            Once logged in, you can:
          </p>
          <ul>
            <li>Like blogs to show appreciation</li>
            <li>Bookmark blogs to save for later</li>
            <li>Comment on blogs to engage with the community</li>
            <li>View personalized recommendations based on your reading history</li>
          </ul>
        </>
      )
    },
    {
      id: 'features',
      title: 'Features',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      content: (
        <>
          <h3>AI-Powered Recommendations</h3>
          <p>
            Our platform uses advanced AI algorithms to analyze your reading patterns and provide personalized
            content recommendations. The more you interact with blogs, the better our recommendations become.
          </p>
          
          <h3>Blog Summaries</h3>
          <p>
            For longer articles, we provide AI-generated summaries to help you quickly understand the main points
            before diving into the full content.
          </p>
          
          <h3>Reading Time Tracking</h3>
          <p>
            We track how long it takes to read each blog and display this information to help you manage your time
            effectively. We also remember your progress if you need to continue reading later.
          </p>
          
          <h3>Bookmarking System</h3>
          <p>
            Save blogs for later by using our bookmarking feature. You can access all your bookmarked content from
            your profile page.
          </p>
        </>
      )
    },
    {
      id: 'support',
      title: 'Technical Support',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      ),
      content: (
        <>
          <p>
            If you encounter any issues while using LikhoVerse, please contact our support team through the
            Contact page. We're here to help you with:
          </p>
          <ul>
            <li>Account-related problems</li>
            <li>Content display issues</li>
            <li>Feature requests</li>
            <li>General questions about the platform</li>
          </ul>
          
          <p>
            Our team typically responds within 24-48 hours during business days.
          </p>
          
          <h3>System Requirements</h3>
          <p>
          LikhoVerse works best on:
          </p>
          <ul>
            <li>Modern browsers (Chrome, Firefox, Safari, Edge)</li>
            <li>Desktop, tablet, and mobile devices</li>
            <li>Stable internet connection for optimal experience</li>
          </ul>
        </>
      )
    }
  ];

  const filteredSections = searchQuery 
    ? sections.filter(section => 
        section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.content.props.children.some(child => 
          typeof child === 'string' && child.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : sections;

  return (
    <div className="min-h-screen bg-gray-900 pt-28 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-pink-600/10 blur-3xl animate-pulse"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 rounded-full bg-purple-600/10 blur-3xl animate-pulse delay-300"></div>
        <div className="absolute -bottom-40 left-1/2 w-80 h-80 rounded-full bg-orange-600/10 blur-3xl animate-pulse delay-700"></div>
      </div>

      <motion.div
        className="max-w-6xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 animate-gradient">
              Documentation
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Everything you need to know about using the SolutionBlog platform
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <motion.div 
            variants={itemVariants}
            className="lg:w-1/4"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4 sticky top-28">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Contents
              </h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-300 ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white shadow-lg shadow-purple-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    <span className={`mr-3 ${activeSection === section.id ? 'text-white' : 'text-purple-400'}`}>{section.icon}</span>
                    <span className="font-medium">{section.title}</span>
                  </button>
                ))}
              </nav>
              
              <div className="mt-8 p-5 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 shadow-lg">
                <div className="flex items-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-white font-semibold">Need Help?</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">Can't find what you're looking for in our documentation?</p>
                <a 
                  href="/contact" 
                  className="inline-block w-full text-center px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-md transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            variants={itemVariants}
            className="lg:w-3/4"
          >
            {searchQuery ? (
              filteredSections.length > 0 ? (
                <div className="space-y-8">
                  <p className="text-gray-400 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                    Found {filteredSections.length} results for "<span className="text-white font-medium">{searchQuery}</span>"
                  </p>
                  {filteredSections.map((section) => (
                    <div 
                      key={section.id}
                      className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-gray-700 shadow-xl hover:shadow-purple-500/5 transition-all duration-300"
                    >
                      <h2 className="text-2xl font-bold text-white mb-6 flex items-center pb-4 border-b border-gray-700">
                        <span className="mr-3 text-purple-400">{section.icon}</span>
                        {section.title}
                      </h2>
                      <div className="prose prose-invert max-w-none text-gray-300 prose-headings:text-purple-300 prose-headings:font-semibold prose-li:marker:text-purple-400">
                        {section.content}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-8 border border-gray-700 text-center shadow-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    We couldn't find any documentation matching "<span className="text-white">{searchQuery}</span>".
                    Try using different keywords or browse the sections.
                  </p>
                </div>
              )
            ) : (
              sections.map((section) => (
                <div 
                  key={section.id}
                  className={`bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-gray-700 transition-all duration-500 shadow-xl hover:shadow-purple-500/5 ${
                    activeSection === section.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 hidden'
                  }`}
                >
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center pb-4 border-b border-gray-700">
                    <span className="mr-3 text-purple-400">{section.icon}</span>
                    {section.title}
                  </h2>
                  <div className="prose prose-lg prose-invert max-w-none text-gray-300 prose-headings:text-purple-300 prose-headings:font-semibold prose-li:marker:text-purple-400">
                    {section.id === 'getting-started' && (
                      <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-gray-800/50 p-5 rounded-lg border border-gray-700 hover:border-purple-500/30 transition-all duration-300">
                          <div className="flex items-center mb-3">
                            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white m-0">Create Account</h3>
                          </div>
                          <p className="text-gray-300 m-0">Sign up to access all features including comments, likes, and personalized recommendations.</p>
                        </div>
                        <div className="bg-gray-800/50 p-5 rounded-lg border border-gray-700 hover:border-pink-500/30 transition-all duration-300">
                          <div className="flex items-center mb-3">
                            <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                              </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white m-0">Browse Blogs</h3>
                          </div>
                          <p className="text-gray-300 m-0">Explore our collection of blogs on various topics with easy filtering and search.</p>
                        </div>
                      </div>
                    )}
                    {section.content}
                  </div>
                </div>
              ))
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
