import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const location = useLocation();
  
  // Don't render header on admin routes
  if (location.pathname.startsWith('/admin')) {
    return null;
  }
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  // Disable body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ]

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
    setIsProfileMenuOpen(false)
    navigate('/login')
  }

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
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
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  }

  const menuVariants = {
    hidden: { opacity: 0, y: '-100%' },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    },
    exit: {
      opacity: 0,
      y: '-100%',
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  }

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-lg transition-all duration-300 ${
        hasScrolled ? 'shadow-lg shadow-pink-500/10' : ''
      }`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div variants={itemVariants}>
            <Link to="/" className="text-2xl font-black">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500">
                SolutionBlog
              </span>
            </Link>
          </motion.div>

          {/* Search Bar - Desktop */}
          <motion.form 
            variants={itemVariants}
            onSubmit={handleSearch}
            className="hidden lg:flex items-center mx-4 flex-1 max-w-xl"
          >
            <div className={`relative w-full transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search blogs..."
                className="w-full px-4 py-2 pl-10 bg-gray-800/70 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent text-gray-300 placeholder-gray-400 transition-all duration-300 shadow-inner shadow-black/20"
                aria-label="Search blogs"
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-400 transition-colors duration-200"
                aria-label="Submit search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </motion.form>

          {/* Desktop Navigation */}
          <motion.div variants={itemVariants} className="hidden lg:flex items-center space-x-8">
            {links.map(link => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
            {!user ? (
              <Link
                to="/login"
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white font-medium hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
              >
                Sign In
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 flex items-center justify-center text-white font-medium">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.username}</span>
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 rounded-lg bg-gray-800 border border-gray-700 shadow-lg py-1"
                    >
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Your Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors duration-200"
                      >
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>

          {/* Mobile Header */}
          <div className="flex lg:hidden items-center space-x-4">
            {/* Mobile User Profile */}
            {user && (
              <motion.div variants={itemVariants} className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 flex items-center justify-center text-white font-medium">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                </button>

                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 rounded-lg bg-gray-800 border border-gray-700 shadow-lg py-1"
                    >
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Your Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors duration-200"
                      >
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Mobile Search Toggle */}
            <motion.button
              variants={itemVariants}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              variants={itemVariants}
              className="relative z-50 w-10 h-10 flex flex-col items-center justify-center rounded-lg hover:bg-white/5 transition-colors duration-200 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <motion.span
                className="w-6 h-0.5 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 transition-all duration-300 absolute"
                animate={{
                  rotate: isMenuOpen ? 45 : 0,
                  y: isMenuOpen ? 0 : -4
                }}
              />
              <motion.span
                className="w-6 h-0.5 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 transition-all duration-300"
                animate={{
                  opacity: isMenuOpen ? 0 : 1
                }}
              />
              <motion.span
                className="w-6 h-0.5 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 transition-all duration-300 absolute"
                animate={{
                  rotate: isMenuOpen ? -45 : 0,
                  y: isMenuOpen ? 0 : 4
                }}
              />
            </motion.button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.form
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSearch}
              className="lg:hidden mt-4"
            >
              <div className={`relative w-full transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Search blogs..."
                  className="w-full px-4 py-3 pl-10 bg-gray-800/70 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent text-gray-300 placeholder-gray-400 text-lg transition-all duration-300 shadow-inner shadow-black/20"
                  aria-label="Search blogs"
                />
                <button
                  type="submit"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-400 transition-colors duration-200"
                  aria-label="Submit search"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            className="fixed inset-x-0 top-0 h-screen bg-gradient-to-br from-gray-900 via-purple-900/95 to-gray-900 backdrop-blur-lg lg:hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
          >
            <nav className="flex flex-col items-center justify-center min-h-screen space-y-8 relative z-10 pt-20">
              {links.map(link => (
                <motion.div
                  key={link.name}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <Link
                    to={link.path}
                    className="text-2xl font-medium text-gray-300 hover:text-white transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              {!user && (
                <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }}>
                  <Link
                    to="/login"
                    className="px-8 py-3 rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white font-medium hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </motion.div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}