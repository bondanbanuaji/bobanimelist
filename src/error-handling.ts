import { handleVercelError } from './utils/vercel-error-handler';
import { type ErrorType } from './components/atoms/error-state';

/**
 * Global error handler for production environments
 * Captures unhandled errors and displays appropriate error pages
 */
export const setupGlobalErrorHandler = (): void => {
  // Handle uncaught errors
  window.addEventListener('error', (event: ErrorEvent) => {
    console.error('Global error caught:', event.error);
    
    // Determine the error type based on the error
    const errorType: ErrorType = handleVercelError(event.error);
    
    // Log the error to an error reporting service in production
    // For example, with Sentry:
    // Sentry.captureException(event.error);
    
    // In a real production app, you might want to redirect to an error page
    // For now, we'll just log the error type
    console.log('Error type detected:', errorType);
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    const errorType: ErrorType = handleVercelError(event.reason);
    
    // Log the error to an error reporting service in production
    // For example, with Sentry:
    // Sentry.captureException(event.reason);
    
    console.log('Unhandled rejection error type:', errorType);
  });
};