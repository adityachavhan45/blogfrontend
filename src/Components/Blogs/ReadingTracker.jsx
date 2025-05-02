import React, { useState, useEffect, useRef } from 'react';

/**
 * Component that tracks user reading activity on a blog post
 * This is a hidden component that doesn't render anything visible
 */
const ReadingTracker = ({ blogId }) => {
  const [startTime, setStartTime] = useState(null);
  const [readPercentage, setReadPercentage] = useState(0);
  const [lastTracked, setLastTracked] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const trackingIntervalRef = useRef(null);
  const timeSpentRef = useRef(0);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Start tracking when component mounts
  useEffect(() => {
    if (blogId) {
      // Record start time
      setStartTime(Date.now());
      
      // Set up scroll tracking
      window.addEventListener('scroll', handleScroll);
      
      // Set up interval to periodically track time spent
      trackingIntervalRef.current = setInterval(() => {
        if (document.visibilityState === 'visible') {
          timeSpentRef.current += 5;
          
          // Track activity every 30 seconds
          if (timeSpentRef.current % 30 === 0) {
            trackActivity();
          }
        }
      }, 5000); // Check every 5 seconds
      
      // Track initial view
      incrementViewCount();
    }
    
    return () => {
      // Clean up event listeners and intervals
      window.removeEventListener('scroll', handleScroll);
      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
      }
      
      // Track final activity when component unmounts
      if (timeSpentRef.current > 0) {
        trackActivity();
      }
    };
  }, [blogId]);

  // Track scroll position to determine read percentage
  const handleScroll = () => {
    if (!blogId) return;
    
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    
    // Calculate how far down the page the user has scrolled
    const scrollPercentage = Math.min(
      100,
      Math.round((scrollTop / (documentHeight - windowHeight)) * 100)
    );
    
    // Update read percentage if user has scrolled further than before
    if (scrollPercentage > readPercentage) {
      setReadPercentage(scrollPercentage);
    }
  };

  // Track user activity
  const trackActivity = async () => {
    if (!isLoggedIn || !blogId || timeSpentRef.current <= lastTracked) return;
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/recommendations/track-activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          blogId,
          timeSpent: timeSpentRef.current - lastTracked,
          readPercentage
        })
      });
      
      if (response.ok) {
        setLastTracked(timeSpentRef.current);
      }
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  };

  // Increment view count for the blog
  const incrementViewCount = async () => {
    if (!blogId) return;
    
    try {
      await fetch(`http://localhost:5000/api/interactions/blogs/${blogId}/view`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  // This component doesn't render anything visible
  return null;
};

export default ReadingTracker;
