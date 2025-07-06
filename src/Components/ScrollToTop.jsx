import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { saveScrollPosition, restoreScrollPosition, scrollToTop } from '../utils/scrollRestoration';

/**
 * Component that handles scroll restoration across the application
 * This component should be placed near the top of your component tree
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const prevPathRef = useRef('');

  useEffect(() => {
    // Save the scroll position of the current page before navigation
    if (prevPathRef.current) {
      saveScrollPosition(prevPathRef.current);
    }

    // Try to restore scroll position for the new page
    const restored = restoreScrollPosition(pathname);
    
    // If no saved position, scroll to top
    if (!restored) {
      scrollToTop();
    }

    // Update the previous path
    prevPathRef.current = pathname;
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default ScrollToTop;
