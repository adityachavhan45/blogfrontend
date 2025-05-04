import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false)
  const [emailVerified, setEmailVerified] = useState(true)
  const [emailChecked, setEmailChecked] = useState(false)
  const emailTimeout = useRef(null)

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    if (token && user) {
      navigate('/')
    }
  }, [navigate])

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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  }

  // Function to verify email existence
  const verifyEmail = async (email) => {
    try {
      setIsVerifyingEmail(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error verifying email')
      }

      return data.exists
    } catch (err) {
      console.error('Email verification error:', err)
      return false
    } finally {
      setIsVerifyingEmail(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return
    }
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // For registration, verify email existence first
      if (!isLogin) {
        const emailExists = await verifyEmail(formData.email)
        setEmailVerified(emailExists)
        
        if (!emailExists) {
          setError('This email address does not exist or cannot be verified. Please use a valid email.')
          setIsSubmitting(false)
          return
        }
      }
      
      const endpoint = isLogin ? '/api/login' : '/api/register'
      const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      // Save token and user data
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      // Reset form
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      })

      // Show success message and redirect
      setError('')
      navigate('/')
      window.location.reload() // Reload to update header state
      
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // If in register mode and email field is changed, verify email after a delay
    if (!isLogin && name === 'email' && value) {
      // Clear any existing timeout
      if (emailTimeout.current) {
        clearTimeout(emailTimeout.current)
      }
      
      // Only validate if it looks like an email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (emailRegex.test(value)) {
        setIsVerifyingEmail(true)
        // Set a new timeout for email verification (1 second delay)
        emailTimeout.current = setTimeout(async () => {
          const emailExists = await verifyEmail(value)
          setEmailVerified(emailExists)
          setEmailChecked(true)
        }, 1000)
      } else {
        setEmailVerified(false)
        setEmailChecked(false)
      }
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError('')
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden pt-24">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-pink-600/10 blur-3xl animate-pulse"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 rounded-full bg-purple-600/10 blur-3xl animate-pulse delay-300"></div>
        <div className="absolute -bottom-40 left-1/2 w-80 h-80 rounded-full bg-orange-600/10 blur-3xl animate-pulse delay-700"></div>
      </div>

      <motion.div
        className="max-w-md w-full space-y-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center">
          <h2 className="text-3xl sm:text-4xl font-black">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 animate-gradient">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-400">
            {isLogin ? 'Sign in to access your account' : 'Join us to start your journey'}
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm"
          >
            {error}
          </motion.div>
        )}

        <motion.form 
          variants={itemVariants} 
          onSubmit={handleSubmit}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-gray-700 space-y-6"
        >
          {!isLogin && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required={!isLogin}
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full bg-gray-900/50 border border-gray-600 rounded-lg py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                  placeholder="Your Name"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email Address
            </label>
            <div className="mt-1 relative">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`block w-full bg-gray-900/50 border ${!isLogin && !emailVerified && formData.email ? 'border-red-500' : 'border-gray-600'} rounded-lg py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 ${isVerifyingEmail ? 'pr-10' : ''}`}
                placeholder="you@example.com"
              />
              {isVerifyingEmail && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="animate-spin h-5 w-5 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
              {!isLogin && !isVerifyingEmail && emailChecked && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {emailVerified ? (
                    <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              )}
              {!isLogin && !emailVerified && formData.email && !isVerifyingEmail && emailChecked && (
                <div className="text-xs text-red-500 mt-1">
                  This email could not be verified. Please use a real email address.
                </div>
              )}
              {!isLogin && emailVerified && formData.email && !isVerifyingEmail && emailChecked && (
                <div className="text-xs text-green-500 mt-1">
                  Email verified successfully!
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full bg-gray-900/50 border border-gray-600 rounded-lg py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent pr-10 transition-all duration-300"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required={!isLogin}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full bg-gray-900/50 border border-gray-600 rounded-lg py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent pr-10 transition-all duration-300"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          {isLogin && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-600 bg-gray-900/50 text-pink-500 focus:ring-pink-500 focus:ring-offset-gray-900"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-pink-400 hover:text-pink-300 transition-colors duration-200">
                  Forgot password?
                </a>
              </div>
            </div>
          )}

          <motion.button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 hover:shadow-lg hover:shadow-pink-500/25 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-300 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              isLogin ? 'Sign in' : 'Create Account'
            )}
          </motion.button>
        </motion.form>

        <motion.div variants={itemVariants} className="text-center">
          <button
            onClick={toggleMode}
            className="text-gray-400 hover:text-pink-400 transition-colors duration-300 inline-flex items-center gap-2"
          >
            {isLogin ? (
              <>
                <span>Don't have an account?</span>
                <span className="font-medium text-pink-400 hover:text-pink-300">Sign up</span>
              </>
            ) : (
              <>
                <span>Already have an account?</span>
                <span className="font-medium text-pink-400 hover:text-pink-300">Sign in</span>
              </>
            )}
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}