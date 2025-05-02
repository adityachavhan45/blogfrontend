import { motion } from 'framer-motion'
import { useState } from 'react'

export default function PrivacyPolicy() {
  const [expandedSection, setExpandedSection] = useState(null);
  const [activeTab, setActiveTab] = useState('general');

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

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
      title: "Introduction",
      content: (
        <>
          <p>
            At LikhoVerse, we respect your privacy and are committed to protecting your personal data. This Privacy Policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
          </p>
          <p>
            This Privacy Policy applies to all users of our platform, including registered users, subscribers, and visitors. Please read this Privacy Policy carefully to understand our practices regarding your personal data.
          </p>
        </>
      )
    },
    {
      title: "Information We Collect",
      content: (
        <>
          <p>
            We collect several types of information from and about users of our website, including:
          </p>
          <ul>
            <li><strong>Personal Identifiers:</strong> Such as name, email address, and username when you register for an account.</li>
            <li><strong>Usage Data:</strong> Information about how you interact with our website, including browsing patterns, clicked links, and time spent on pages.</li>
            <li><strong>Device Information:</strong> Information about the device you use to access our website, including IP address, browser type, and operating system.</li>
            <li><strong>User Content:</strong> Information you provide when you comment on blogs, interact with other users, or submit content to our platform.</li>
          </ul>
          
          <h3>How We Collect Your Information</h3>
          <p>
            We collect information in the following ways:
          </p>
          <ul>
            <li><strong>Direct Interactions:</strong> Information you provide when you register for an account, subscribe to our newsletter, or contact us.</li>
            <li><strong>Automated Technologies:</strong> As you navigate through our website, we may automatically collect technical data about your equipment, browsing actions, and patterns.</li>
            <li><strong>Third Parties:</strong> We may receive information about you from various third parties, such as analytics providers or advertising networks.</li>
          </ul>
        </>
      )
    },
    {
      title: "How We Use Your Information",
      content: (
        <>
          <p>
            We use your information for the following purposes:
          </p>
          <ul>
            <li>To provide and maintain our service, including monitoring the usage of our service.</li>
            <li>To manage your account, including verifying your identity and enforcing our terms and policies.</li>
            <li>To contact you regarding updates, security alerts, and support messages.</li>
            <li>To provide you with news, special offers, and general information about other goods, services, and events.</li>
            <li>To improve our website and develop new features based on how users interact with our platform.</li>
            <li>To communicate with you, including sending you updates, security alerts, and support messages.</li>
            <li>To ensure the security of our platform and prevent fraud or unauthorized access.</li>
            <li>To comply with legal obligations and enforce our terms of service.</li>
          </ul>
          
          <h3>AI-Powered Features</h3>
          <p>
            Our platform uses artificial intelligence to enhance your experience. This includes:
          </p>
          <ul>
            <li>Analyzing your reading patterns to provide personalized content recommendations.</li>
            <li>Generating summaries of blog content to help you quickly understand the main points.</li>
            <li>Tracking your engagement with content to improve our recommendation algorithms.</li>
          </ul>
        </>
      )
    },
    {
      title: "Data Security",
      content: (
        <>
          <p>
            We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way. We limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
          </p>
          <p>
            We have procedures in place to deal with any suspected personal data breach and will notify you and any applicable regulator of a breach where we are legally required to do so.
          </p>
        </>
      )
    },
    {
      title: "Your Rights",
      content: (
        <>
          <p>
            Depending on your location, you may have certain rights regarding your personal data, including:
          </p>
          <ul>
            <li><strong>Access:</strong> The right to request copies of your personal data.</li>
            <li><strong>Rectification:</strong> The right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
            <li><strong>Erasure:</strong> The right to request that we delete your personal data in certain circumstances.</li>
            <li><strong>Restriction:</strong> The right to request that we restrict the processing of your personal data in certain circumstances.</li>
            <li><strong>Data Portability:</strong> The right to request the transfer of your personal data to another organization or directly to you.</li>
          </ul>
          
          <p>
            To exercise any of these rights, please contact us through our Contact page. We may need to request specific information from you to help us confirm your identity and ensure your right to access your personal data.
          </p>
          
          <h3>Changes to This Privacy Policy</h3>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
          </p>
          <p>
            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </p>
        </>
      )
    }
  ];

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'data', label: 'Your Data' },
    { id: 'cookies', label: 'Cookies' }
  ];

  const tabContent = {
    general: (
      <motion.div 
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {sections.map((section, index) => (
          <div 
            key={index} 
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden transition-all duration-300 hover:border-pink-500/50"
          >
            <button
              onClick={() => toggleSection(index)}
              className="w-full p-6 sm:p-8 flex justify-between items-center text-left focus:outline-none"
            >
              <h2 className="text-2xl font-bold text-white">{section.title}</h2>
              <div className={`text-white transition-transform duration-300 ${expandedSection === index ? 'rotate-180' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            <div 
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                expandedSection === index ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-6 sm:p-8 pt-0 sm:pt-0 border-t border-gray-700">
                <div className="prose prose-invert max-w-none text-gray-300">
                  {section.content}
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    ),
    data: (
      <motion.div 
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-gray-700"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Your Data Rights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600 hover:border-pink-500/50 transition-all duration-300">
            <h3 className="text-xl font-semibold text-white mb-3">Download Your Data</h3>
            <p className="text-gray-300 mb-4">You can request a copy of all the personal data we have about you.</p>
            <button className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-md transition-colors duration-300">
              Request Data
            </button>
          </div>
          <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600 hover:border-purple-500/50 transition-all duration-300">
            <h3 className="text-xl font-semibold text-white mb-3">Delete Your Data</h3>
            <p className="text-gray-300 mb-4">You can request the deletion of your personal data from our systems.</p>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors duration-300">
              Request Deletion
            </button>
          </div>
          <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600 hover:border-orange-500/50 transition-all duration-300">
            <h3 className="text-xl font-semibold text-white mb-3">Update Your Preferences</h3>
            <p className="text-gray-300 mb-4">Manage how we use your data and what communications you receive.</p>
            <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors duration-300">
              Manage Preferences
            </button>
          </div>
          <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600 hover:border-blue-500/50 transition-all duration-300">
            <h3 className="text-xl font-semibold text-white mb-3">Data Processing Activities</h3>
            <p className="text-gray-300 mb-4">View a list of all the ways we process your personal data.</p>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-300">
              View Activities
            </button>
          </div>
        </div>
      </motion.div>
    ),
    cookies: (
      <motion.div 
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-gray-700"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Cookie Policy</h2>
        <div className="prose prose-invert max-w-none text-gray-300">
          <p>
            Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site.
          </p>
          <h3>What are cookies?</h3>
          <p>
            Cookies are small text files that are placed on your computer or mobile device when you browse websites. They allow the website to recognize your device and remember if you've been to the website before.
          </p>
          <h3>How we use cookies</h3>
          <p>
            We use the following types of cookies:
          </p>
          <ul>
            <li><strong>Essential cookies:</strong> These are cookies that are required for the operation of our website.</li>
            <li><strong>Analytical/performance cookies:</strong> These allow us to recognize and count the number of visitors and to see how visitors move around our website when they are using it.</li>
            <li><strong>Functionality cookies:</strong> These are used to recognize you when you return to our website.</li>
            <li><strong>Targeting cookies:</strong> These cookies record your visit to our website, the pages you have visited and the links you have followed.</li>
          </ul>
          
          <div className="mt-6 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
            <h3 className="text-xl font-semibold text-white mb-3">Cookie Preferences</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-white">Essential Cookies</label>
                <div className="bg-gray-600 w-12 h-6 rounded-full flex items-center p-1">
                  <div className="bg-green-500 w-4 h-4 rounded-full ml-auto"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-white">Analytics Cookies</label>
                <div className="bg-gray-600 w-12 h-6 rounded-full flex items-center p-1 cursor-pointer">
                  <div className="bg-green-500 w-4 h-4 rounded-full ml-auto"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-white">Marketing Cookies</label>
                <div className="bg-gray-600 w-12 h-6 rounded-full flex items-center p-1 cursor-pointer">
                  <div className="bg-gray-400 w-4 h-4 rounded-full"></div>
                </div>
              </div>
              <button className="w-full mt-3 px-4 py-2 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white rounded-md transition-colors duration-300 hover:from-pink-600 hover:via-purple-600 hover:to-orange-600">
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-28 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-pink-600/10 blur-3xl animate-pulse"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 rounded-full bg-purple-600/10 blur-3xl animate-pulse delay-300"></div>
        <div className="absolute -bottom-40 left-1/2 w-80 h-80 rounded-full bg-orange-600/10 blur-3xl animate-pulse delay-700"></div>
      </div>

      <motion.div
        className="max-w-4xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 animate-gradient">
              Privacy Policy
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-full transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white font-medium shadow-lg' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          {tabContent[activeTab]}
        </motion.div>
      </motion.div>
    </div>
  )
}
