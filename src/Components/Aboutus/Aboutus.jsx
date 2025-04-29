import { motion } from 'framer-motion';

export default function Aboutus() {
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
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-28 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-pink-600/10 blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-orange-600/10 blur-3xl animate-pulse delay-1000"></div>
      
      <motion.div 
        className="max-w-4xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* About Section */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 animate-gradient">
              About SolutionBlog
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Your go-to destination for comprehensive programming solutions, tutorials, and industry insights. We're dedicated to making technology education accessible and engaging.
          </p>
        </motion.div>

        {/* Mission & Vision Section */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300">
            <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
              Our Mission
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Our mission is to empower developers worldwide by providing high-quality, practical programming solutions and educational content. We strive to break down complex concepts into understandable pieces, making learning more accessible and enjoyable.
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
            <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-orange-500">
              Our Vision
            </h2>
            <p className="text-gray-400 leading-relaxed">
              We envision a world where quality programming education is accessible to everyone. Our goal is to build a thriving community of developers who learn, share, and grow together, breaking down barriers in the tech industry.
            </p>
          </div>
        </motion.div>

        {/* What We Offer Section */}
        <motion.div variants={itemVariants} className="mb-16">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500">
              What We Offer
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-pink-500/10">
                    <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                  </span>
                  <div>
                    <h3 className="text-white font-medium mb-1">In-depth Tutorials</h3>
                    <p className="text-gray-400">Comprehensive guides covering various programming languages and frameworks</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-purple-500/10">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  </span>
                  <div>
                    <h3 className="text-white font-medium mb-1">Problem-Solving</h3>
                    <p className="text-gray-400">Practical solutions to common programming challenges and debugging tips</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-orange-500/10">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  </span>
                  <div>
                    <h3 className="text-white font-medium mb-1">Best Practices</h3>
                    <p className="text-gray-400">Industry-standard coding conventions and architectural patterns</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-pink-500/10">
                    <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                  </span>
                  <div>
                    <h3 className="text-white font-medium mb-1">Latest Tech News</h3>
                    <p className="text-gray-400">Stay updated with the latest trends and developments in technology</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-purple-500/10">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  </span>
                  <div>
                    <h3 className="text-white font-medium mb-1">Community Support</h3>
                    <p className="text-gray-400">Active community of developers helping each other grow</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-orange-500/10">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  </span>
                  <div>
                    <h3 className="text-white font-medium mb-1">Resource Library</h3>
                    <p className="text-gray-400">Curated collection of tools, libraries, and learning materials</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div variants={itemVariants}>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                <h3 className="text-xl font-semibold mb-3 text-white">Quality</h3>
                <p className="text-gray-400">We maintain high standards in our content, ensuring accuracy and relevance.</p>
              </div>
              <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                <h3 className="text-xl font-semibold mb-3 text-white">Innovation</h3>
                <p className="text-gray-400">We stay ahead of the curve, embracing new technologies and methodologies.</p>
              </div>
              <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                <h3 className="text-xl font-semibold mb-3 text-white">Community</h3>
                <p className="text-gray-400">We foster an inclusive environment where everyone can learn and contribute.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}