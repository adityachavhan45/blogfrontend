/**
 * Scroll restoration utility for maintaining scroll positions across page navigations
 */

// Store for scroll positions by path
const scrollPositions = new Map();

// Save the current scroll position for a specific path
export const saveScrollPosition = (path) => {
  scrollPositions.set(path, window.scrollY);
};

// Get the saved scroll position for a specific path
export const getSavedScrollPosition = (path) => {
  return scrollPositions.get(path) || 0;
};

// Restore scroll position for a path
export const restoreScrollPosition = (path, delay = 100) => {
  const savedPosition = getSavedScrollPosition(path);
  
  if (savedPosition) {
    setTimeout(() => {
      window.scrollTo(0, savedPosition);
    }, delay);
    return true;
  }
  
  return false;
};

// Clear a saved scroll position
export const clearScrollPosition = (path) => {
  scrollPositions.delete(path);
};

// Scroll to top of page
export const scrollToTop = (delay = 0) => {
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, delay);
};
