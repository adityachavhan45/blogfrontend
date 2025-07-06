import React, { useState, useEffect } from 'react';
import { FaLightbulb, FaSpinner, FaCheck } from 'react-icons/fa';

const KeywordSuggestions = ({ title, content, onSelectKeyword }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedKeywords, setSelectedKeywords] = useState([]);

  useEffect(() => {
    if (title && title.length > 5) {
      generateKeywordSuggestions();
    }
  }, [title]);

  const generateKeywordSuggestions = async () => {
    if (!title || title.length < 5) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Extract potential keywords from title
      const words = title.toLowerCase().split(/\s+/);
      const filteredWords = words.filter(word => 
        word.length > 3 && 
        !['and', 'the', 'for', 'with', 'that', 'this', 'from', 'what', 'how', 'when', 'where', 'which'].includes(word)
      );
      
      // Generate keyword combinations
      let keywordSuggestions = [...filteredWords];
      
      // Add two-word combinations
      for (let i = 0; i < words.length - 1; i++) {
        if (words[i].length > 2 && words[i+1].length > 2) {
          keywordSuggestions.push(`${words[i]} ${words[i+1]}`);
        }
      }
      
      // Add three-word combinations if title is long enough
      if (words.length >= 3) {
        for (let i = 0; i < words.length - 2; i++) {
          if (words[i].length > 2 && words[i+1].length > 2 && words[i+2].length > 2) {
            keywordSuggestions.push(`${words[i]} ${words[i+1]} ${words[i+2]}`);
          }
        }
      }
      
      // Add some common prefixes to make long-tail keywords
      const prefixes = ['how to', 'best', 'top', 'guide to', 'tutorial for'];
      const mainKeywords = filteredWords.filter(word => word.length > 4);
      
      if (mainKeywords.length > 0) {
        prefixes.forEach(prefix => {
          mainKeywords.forEach(keyword => {
            keywordSuggestions.push(`${prefix} ${keyword}`);
          });
        });
      }
      
      // Remove duplicates and limit to 15 suggestions
      const uniqueSuggestions = [...new Set(keywordSuggestions)];
      setSuggestions(uniqueSuggestions.slice(0, 15));
      
    } catch (error) {
      console.error('Error generating keyword suggestions:', error);
      setError('Failed to generate keyword suggestions');
    } finally {
      setLoading(false);
    }
  };

  const handleKeywordSelect = (keyword) => {
    if (selectedKeywords.includes(keyword)) {
      setSelectedKeywords(selectedKeywords.filter(k => k !== keyword));
      onSelectKeyword(selectedKeywords.filter(k => k !== keyword));
    } else {
      const newSelectedKeywords = [...selectedKeywords, keyword];
      setSelectedKeywords(newSelectedKeywords);
      onSelectKeyword(newSelectedKeywords);
    }
  };

  if (!title || title.length < 5) {
    return (
      <div className="mt-4 p-4 bg-gray-800/30 rounded-lg">
        <div className="flex items-center gap-2 text-amber-400 mb-2">
          <FaLightbulb />
          <h3 className="font-medium">SEO Keyword Suggestions</h3>
        </div>
        <p className="text-gray-400 text-sm">Enter a title with at least 5 characters to get keyword suggestions.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 bg-gray-800/30 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-amber-400">
          <FaLightbulb />
          <h3 className="font-medium">SEO Keyword Suggestions</h3>
        </div>
        <button
          onClick={generateKeywordSuggestions}
          disabled={loading}
          className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 transition-colors"
        >
          Refresh
        </button>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <FaSpinner className="animate-spin text-amber-400 mr-2" />
          <span className="text-gray-300">Generating suggestions...</span>
        </div>
      ) : error ? (
        <p className="text-red-400 text-sm">{error}</p>
      ) : (
        <>
          <p className="text-gray-400 text-xs mb-3">
            Select keywords to optimize your blog for search engines. These will be added as tags.
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((keyword, index) => (
              <button
                key={index}
                onClick={() => handleKeywordSelect(keyword)}
                className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 transition-colors ${
                  selectedKeywords.includes(keyword)
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-gray-700 text-gray-300 border border-gray-700 hover:border-gray-600'
                }`}
              >
                {selectedKeywords.includes(keyword) && <FaCheck className="text-amber-400 w-3 h-3" />}
                {keyword}
              </button>
            ))}
          </div>
          {selectedKeywords.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-700">
              <p className="text-gray-400 text-xs mb-2">Selected keywords:</p>
              <div className="flex flex-wrap gap-2">
                {selectedKeywords.map((keyword, index) => (
                  <span key={index} className="text-xs px-2 py-1 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default KeywordSuggestions;
