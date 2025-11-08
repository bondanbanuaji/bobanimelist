/**
 * Translation Helper Utilities
 * Simplifies integration of translation across all components
 */

import { useJikanTranslation } from '../hooks/useJikanTranslation';

/**
 * Auto-translate any Jikan query result based on heading/context
 * Smart detection of content type
 */
export function useAutoTranslate<T>(data: T | undefined, context?: string): T | undefined {
  // Determine data type from context or data structure
  let dataType: 'anime' | 'manga' | 'character' | 'review' = 'anime';
  
  if (context) {
    const lowerContext = context.toLowerCase();
    if (lowerContext.includes('manga') || lowerContext.includes('manhwa') || lowerContext.includes('manhua')) {
      dataType = 'manga';
    } else if (lowerContext.includes('character')) {
      dataType = 'character';
    } else if (lowerContext.includes('review')) {
      dataType = 'review';
    }
  }
  
  return useJikanTranslation(data, { dataType });
}

/**
 * Helper to determine data type from context string
 */
export function getDataTypeFromContext(context?: string): 'anime' | 'manga' | 'character' | 'review' {
  if (!context) return 'anime';
  
  const lowerContext = context.toLowerCase();
  if (lowerContext.includes('manga') || lowerContext.includes('manhwa') || lowerContext.includes('manhua')) {
    return 'manga';
  } else if (lowerContext.includes('character')) {
    return 'character';
  } else if (lowerContext.includes('review')) {
    return 'review';
  }
  return 'anime';
}
