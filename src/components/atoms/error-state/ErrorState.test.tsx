import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import ErrorState from './ErrorState';

describe('ErrorState', () => {
  const renderWithRouter = (ui: React.ReactElement) =>
    render(<MemoryRouter>{ui}</MemoryRouter>);

  it('renders 404 error state by default', () => {
    renderWithRouter(<ErrorState type="404" />);
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  it('renders 500 error state', () => {
    renderWithRouter(<ErrorState type="500" />);
    expect(screen.getByText('Server Error')).toBeInTheDocument();
  });

  it('renders network error state', () => {
    renderWithRouter(<ErrorState type="network" />);
    expect(screen.getByText('Connection Lost')).toBeInTheDocument();
  });

  it('renders custom title and message', () => {
    renderWithRouter(
      <ErrorState type="generic" title="Custom Title" message="Custom message" />
    );
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom message')).toBeInTheDocument();
  });

  it('renders retry button when showRetryButton is true', () => {
    renderWithRouter(<ErrorState type="500" showRetryButton retryButtonText="Try Again" />);
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('renders navigation button when navigateTo is provided', () => {
    renderWithRouter(
      <ErrorState type="404" navigateTo="/" navigateButtonText="Go Home" />
    );
    expect(screen.getByText('Go Home')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = renderWithRouter(
      <ErrorState type="generic" className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
