import { motion } from 'framer-motion'
import { useState } from 'react'

export default function TermsOfService() {
  const [expandedSection, setExpandedSection] = useState(null);

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
      title: "Agreement to Terms",
      content: (
        <>
          <p>
            These Terms of Service govern your use of the SolutionBlog website and services operated by SolutionBlog.
          </p>
          <p>
            By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.
          </p>
        </>
      )
    },
    {
      title: "User Accounts",
      content: (
        <>
          <p>
            When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
          </p>
          <p>
            You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.
          </p>
          <p>
            You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
          </p>
          
          <h3>Account Types</h3>
          <p>
            SolutionBlog offers the following types of accounts:
          </p>
          <ul>
            <li><strong>Regular User Accounts:</strong> For individuals who want to read, bookmark, and comment on blogs.</li>
            <li><strong>Admin Accounts:</strong> For authorized administrators who manage content and users on the platform.</li>
          </ul>
        </>
      )
    },
    {
      title: "Intellectual Property",
      content: (
        <>
          <p>
            The service and its original content, features, and functionality are and will remain the exclusive property of SolutionBlog and its licensors. The service is protected by copyright, trademark, and other laws.
          </p>
          <p>
            Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of SolutionBlog.
          </p>
          <p>
            User-generated content remains the intellectual property of the user who created it, but by posting content on our platform, you grant SolutionBlog a non-exclusive, royalty-free, perpetual, and worldwide license to use, modify, publicly perform, publicly display, reproduce, and distribute such content on and through the service.
          </p>
        </>
      )
    },
    {
      title: "Prohibited Uses",
      content: (
        <>
          <p>
            You may not use our service for any illegal purposes or to conduct any unlawful activity, including, but not limited to:
          </p>
          <ul>
            <li>To harass, abuse, or harm another person.</li>
            <li>To impersonate or attempt to impersonate SolutionBlog, a SolutionBlog employee, another user, or any other person or entity.</li>
            <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful.</li>
            <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the service, or which may harm SolutionBlog or users of the service.</li>
          </ul>
          
          <p>
            Additionally, you agree not to:
          </p>
          <ul>
            <li>Use the service in any manner that could disable, overburden, damage, or impair the site or interfere with any other party's use of the service.</li>
            <li>Use any robot, spider, or other automatic device, process, or means to access the service for any purpose, including monitoring or copying any of the material on the service.</li>
            <li>Use any manual process to monitor or copy any of the material on the service or for any other unauthorized purpose without our prior written consent.</li>
            <li>Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the service, the server on which the service is stored, or any server, computer, or database connected to the service.</li>
          </ul>
        </>
      )
    },
    {
      title: "Termination",
      content: (
        <>
          <p>
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
          <p>
            Upon termination, your right to use the service will immediately cease. If you wish to terminate your account, you may simply discontinue using the service or contact us to request account deletion.
          </p>
        </>
      )
    },
    {
      title: "Limitation of Liability",
      content: (
        <>
          <p>
            In no event shall SolutionBlog, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
          </p>
          <ul>
            <li>Your access to or use of or inability to access or use the service;</li>
            <li>Any conduct or content of any third party on the service;</li>
            <li>Any content obtained from the service; and</li>
            <li>Unauthorized access, use or alteration of your transmissions or content.</li>
          </ul>
          
          <h3>Changes to Terms</h3>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.
          </p>
          <p>
            By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the service.
          </p>
          
          <h3>Contact Us</h3>
          <p>
            If you have any questions about these Terms, please contact us through our Contact page.
          </p>
        </>
      )
    }
  ];

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
              Terms of Service
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4">
          {sections.map((section, index) => (
            <div 
              key={index} 
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden transition-all duration-300 hover:border-purple-500/50"
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
      </motion.div>
    </div>
  )
}
