import { Link } from 'react-router';
import { Label } from '../label';
import styles from './ErrorState.module.scss';
import classNames from 'classnames';
import WarningIcon from '../icons/WarningIcon';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetryButton?: boolean;
  retryButtonText?: string;
  navigateTo?: string;
  navigateButtonText?: string;
  className?: string;
  role?: string;
}

function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error has occurred.',
  onRetry,
  showRetryButton = true,
  retryButtonText = 'Try Again',
  navigateTo,
  navigateButtonText = 'Go Home',
  className,
  role = 'alert'
}: ErrorStateProps) {
  const retryButton = showRetryButton && onRetry && (
    <button 
      className={styles['error-state__button']} 
      onClick={onRetry}
      aria-label={retryButtonText}
    >
      <Label as='p' font='typo-primary-m-medium'>{retryButtonText}</Label>
    </button>
  );

  const navigateButton = navigateTo && (
    <Link to={navigateTo} className={styles['error-state__button']}>
      <Label as='p' font='typo-primary-m-medium'>{navigateButtonText}</Label>
    </Link>
  );

  return (
    <div 
      className={classNames(styles['error-state'], className)} 
      role={role}
      aria-live="polite"
    >
      <div className={styles['error-state__icon']}>
        <WarningIcon size={48} color="s-color-fg-error" />
      </div>
      <div className={styles['error-state__content']}>
        <Label as='h3' font='typo-primary-l-semibold' className={styles['error-state__title']}>
          {title}
        </Label>
        <Label as='p' font='typo-primary-m-regular' className={styles['error-state__message']}>
          {message}
        </Label>
      </div>
      {(retryButton || navigateButton) && (
        <div className={styles['error-state__actions']}>
          {retryButton}
          {navigateButton}
        </div>
      )}
    </div>
  );
}

export default ErrorState;