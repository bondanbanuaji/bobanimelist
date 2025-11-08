import { useEffect } from 'react';

/**
 * Custom hook to lock/unlock page scrolling
 * @param isLocked - Whether scrolling should be locked
 */
const useScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (isLocked) {
      // Store the original overflow value
      const originalOverflow = document.body.style.overflow;
      
      // Lock scroll by setting overflow to hidden
      document.body.style.overflow = 'hidden';
      
      // Preserve scroll position when locking
      if (window.innerWidth > document.documentElement.clientWidth) {
        // Calculate the scrollbar width and apply padding to compensate
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      
      // Clean up function to restore original state
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = '';
      };
    }
    
    // If not locked, don't do anything
    return () => {};
  }, [isLocked]);
};

export default useScrollLock;