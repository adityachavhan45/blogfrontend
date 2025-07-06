import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaInfoCircle } from 'react-icons/fa';

const SEOChecklist = ({ title, content, focusKeyword, seoTitle, seoDescription, tags }) => {
  const [checks, setChecks] = useState({
    focusKeywordInTitle: false,
    focusKeywordInFirstParagraph: false,
    focusKeywordInURL: false,
    focusKeywordInMetaDescription: false,
    titleLength: false,
    metaDescriptionLength: false,
    contentLength: false,
    internalLinks: false,
    imageAlt: false,
    readability: false
  });
  
  const [score, setScore] = useState(0);
  const [advice, setAdvice] = useState('');
  
  useEffect(() => {
    if (!focusKeyword) return;
    
    const newChecks = { ...checks };
    let passedChecks = 0;
    
    // Check if focus keyword is in title
    newChecks.focusKeywordInTitle = title && title.toLowerCase().includes(focusKeyword.toLowerCase());
    if (newChecks.focusKeywordInTitle) passedChecks++;
    
    // Check if focus keyword is in first paragraph (approximation)
    const firstParagraphEnd = content ? content.indexOf('</p>') : -1;
    const firstParagraph = firstParagraphEnd > -1 ? content.substring(0, firstParagraphEnd) : '';
    newChecks.focusKeywordInFirstParagraph = firstParagraph.toLowerCase().includes(focusKeyword.toLowerCase());
    if (newChecks.focusKeywordInFirstParagraph) passedChecks++;
    
    // Check if focus keyword would be in URL
    const simulatedUrl = title.toLowerCase().replace(/\\s+/g, '-').replace(/[^\\w-]+/g, '');
    newChecks.focusKeywordInURL = simulatedUrl.includes(focusKeyword.toLowerCase().replace(/\\s+/g, '-').replace(/[^\\w-]+/g, ''));
    if (newChecks.focusKeywordInURL) passedChecks++;
    
    // Check if focus keyword is in meta description
    newChecks.focusKeywordInMetaDescription = seoDescription && seoDescription.toLowerCase().includes(focusKeyword.toLowerCase());
    if (newChecks.focusKeywordInMetaDescription) passedChecks++;
    
    // Check title length (ideal is 50-60 characters)
    const titleLength = (seoTitle || title).length;
    newChecks.titleLength = titleLength >= 40 && titleLength <= 60;
    if (newChecks.titleLength) passedChecks++;
    
    // Check meta description length (ideal is 150-160 characters)
    const metaDescriptionLength = (seoDescription || '').length;
    newChecks.metaDescriptionLength = metaDescriptionLength >= 140 && metaDescriptionLength <= 160;
    if (newChecks.metaDescriptionLength) passedChecks++;
    
    // Check content length (at least 300 words is good for SEO)
    const plainTextContent = content ? content.replace(/<[^>]*>/g, ' ') : '';
    const wordCount = plainTextContent.split(/\\s+/).filter(word => word.length > 0).length;
    newChecks.contentLength = wordCount >= 300;
    if (newChecks.contentLength) passedChecks++;
    
    // Check for internal links (simplified check)
    newChecks.internalLinks = content && content.includes('href=');
    if (newChecks.internalLinks) passedChecks++;
    
    // Check for image alt tags (simplified check)
    newChecks.imageAlt = content && content.includes('alt=');
    if (newChecks.imageAlt) passedChecks++;
    
    // Readability check (simplified - checking for headings)
    newChecks.readability = content && (content.includes('<h2') || content.includes('<h3'));
    if (newChecks.readability) passedChecks++;
    
    // Calculate score (0-100)
    const newScore = Math.round((passedChecks / Object.keys(newChecks).length) * 100);
    
    // Set advice based on score
    let newAdvice = '';
    if (newScore < 40) {
      newAdvice = 'Your content needs significant SEO improvements to rank well.';
    } else if (newScore < 70) {
      newAdvice = 'Your content has moderate SEO optimization but could be improved.';
    } else if (newScore < 90) {
      newAdvice = 'Your content is well optimized for SEO with minor improvements possible.';
    } else {
      newAdvice = 'Excellent! Your content is highly optimized for search engines.';
    }
    
    setChecks(newChecks);
    setScore(newScore);
    setAdvice(newAdvice);
  }, [title, content, focusKeyword, seoTitle, seoDescription, tags]);
  
  if (!focusKeyword) {
    return (
      <div className="mt-4 p-4 bg-gray-800/30 rounded-lg">
        <h3 className="text-lg font-medium text-white mb-2">SEO Checklist</h3>
        <p className="text-gray-400">Enter a focus keyword to see SEO recommendations.</p>
      </div>
    );
  }
  
  return (
    <div className="mt-4 p-4 bg-gray-800/30 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white">SEO Checklist</h3>
        <div className="flex items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
            score >= 70 ? 'bg-green-500/20 text-green-400' : 
            score >= 40 ? 'bg-yellow-500/20 text-yellow-400' : 
            'bg-red-500/20 text-red-400'
          }`}>
            {score}%
          </div>
        </div>
      </div>
      
      <p className="text-gray-300 mb-4 text-sm italic">{advice}</p>
      
      <div className="space-y-3">
        <CheckItem 
          passed={checks.focusKeywordInTitle} 
          text={`Focus keyword "${focusKeyword}" in title`} 
          tip="Including your focus keyword in the title helps search engines understand what your content is about."
        />
        
        <CheckItem 
          passed={checks.focusKeywordInFirstParagraph} 
          text={`Focus keyword "${focusKeyword}" in first paragraph`} 
          tip="Using your focus keyword early in your content signals its importance to search engines."
        />
        
        <CheckItem 
          passed={checks.focusKeywordInURL} 
          text={`Focus keyword "${focusKeyword}" in URL`} 
          tip="URLs with the focus keyword tend to rank better in search results."
        />
        
        <CheckItem 
          passed={checks.focusKeywordInMetaDescription} 
          text={`Focus keyword "${focusKeyword}" in meta description`} 
          tip="Including your focus keyword in the meta description can improve click-through rates from search results."
        />
        
        <CheckItem 
          passed={checks.titleLength} 
          text="Title length (40-60 characters ideal)" 
          tip="Titles that are too long may be truncated in search results. Titles that are too short may not be descriptive enough."
        />
        
        <CheckItem 
          passed={checks.metaDescriptionLength} 
          text="Meta description length (140-160 characters ideal)" 
          tip="Meta descriptions should be compelling and the right length to display fully in search results."
        />
        
        <CheckItem 
          passed={checks.contentLength} 
          text="Content length (at least 300 words)" 
          tip="Longer, comprehensive content tends to rank better for competitive keywords."
        />
        
        <CheckItem 
          passed={checks.internalLinks} 
          text="Internal links to other content" 
          tip="Internal linking helps search engines discover and understand the structure of your website."
        />
        
        <CheckItem 
          passed={checks.imageAlt} 
          text="Images with alt text" 
          tip="Alt text helps search engines understand images and improves accessibility."
        />
        
        <CheckItem 
          passed={checks.readability} 
          text="Content structure with headings" 
          tip="Well-structured content with headings improves readability and SEO."
        />
      </div>
    </div>
  );
};

const CheckItem = ({ passed, text, tip }) => {
  const [showTip, setShowTip] = useState(false);
  
  return (
    <div className="flex items-start gap-3">
      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
        passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
      }`}>
        {passed ? <FaCheck size={12} /> : <FaTimes size={12} />}
      </div>
      <div className="flex-grow">
        <div className="flex items-center gap-2">
          <span className={passed ? 'text-gray-300' : 'text-gray-400'}>{text}</span>
          <button 
            onClick={() => setShowTip(!showTip)}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            <FaInfoCircle size={14} />
          </button>
        </div>
        {showTip && (
          <p className="text-xs text-gray-500 mt-1">{tip}</p>
        )}
      </div>
    </div>
  );
};

export default SEOChecklist;
