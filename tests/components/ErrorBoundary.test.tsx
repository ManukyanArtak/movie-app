import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary } from '../../src/components/ErrorBoundary/ErrorBoundary';

jest.mock('lucide-react', () => ({
  AlertCircle: ({ size }: { size: number }) => (
    <span data-testid="alert-icon" data-size={size}>⚠️</span>
  ),
}));

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>No error</div>;
};

describe('<ErrorBoundary />', () => {
  const originalError = console.error;
  const originalLocation = window.location;

  beforeAll(() => {
    console.error = jest.fn();
    delete (window as any).location;
    (window as any).location = { href: '' };
  });

  afterAll(() => {
    console.error = originalError;
    window.location = originalLocation;
  });

  test('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
    expect(screen.queryByText('Oops! Something went wrong')).not.toBeInTheDocument();
  });

  test('renders error UI when child throws error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
  });

  test('renders error description', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(
      screen.getByText("We're sorry for the inconvenience. The app encountered an unexpected error.")
    ).toBeInTheDocument();
  });

  test('renders error details when error is available', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Error details')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  test('renders back button', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const backButton = screen.getByRole('button', { name: /back to home/i });
    expect(backButton).toBeInTheDocument();
  });

  test('redirects to home when back button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const backButton = screen.getByRole('button', { name: /back to home/i });
    await user.click(backButton);

    expect(window.location.href).toBe('http://localhost/');
  });

  test('logs error to console', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalled();
  });

  test('renders custom fallback when provided', () => {
    const customFallback = <div>Custom error fallback</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error fallback')).toBeInTheDocument();
    expect(screen.queryByText('Oops! Something went wrong')).not.toBeInTheDocument();
  });

  test('handles error state correctly', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    expect(screen.queryByText('No error')).not.toBeInTheDocument();
  });

  test('handles different error messages', () => {
    const DifferentError = () => {
      throw new Error('Different error message');
    };

    render(
      <ErrorBoundary>
        <DifferentError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Different error message')).toBeInTheDocument();
  });

  test('error details are collapsible', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const detailsElement = screen.getByText('Error details').closest('details');
    expect(detailsElement).toBeInTheDocument();
  });

  test('renders correctly with complex children', () => {
    render(
      <ErrorBoundary>
        <div>
          <h1>Title</h1>
          <p>Content</p>
          <button>Click me</button>
        </div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });
});

