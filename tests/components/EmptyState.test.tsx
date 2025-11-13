import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyState } from '../../src/components/EmptyState/EmptyState';

describe('<EmptyState />', () => {
  const mockOnReset = jest.fn();

  beforeEach(() => {
    mockOnReset.mockClear();
  });

  test('renders default message', () => {
    render(<EmptyState />);

    expect(screen.getByText('No movies found')).toBeInTheDocument();
  });

  test('renders custom message', () => {
    const customMessage = 'Custom empty state message';
    render(<EmptyState message={customMessage} />);

    expect(screen.getByText(customMessage)).toBeInTheDocument();
    expect(screen.queryByText('No movies found')).not.toBeInTheDocument();
  });

  test('does not render reset button when no query or selectedGenreId', () => {
    render(<EmptyState />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('does not render reset button when onReset is not provided', () => {
    render(<EmptyState query="test" />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('renders reset button when query is provided and onReset exists', () => {
    render(<EmptyState query="test" onReset={mockOnReset} />);

    const resetButton = screen.getByRole('button', { name: /view all movies/i });
    expect(resetButton).toBeInTheDocument();
  });

  test('renders reset button when selectedGenreId is provided and onReset exists', () => {
    render(<EmptyState selectedGenreId={28} onReset={mockOnReset} />);

    const resetButton = screen.getByRole('button', { name: /view all movies/i });
    expect(resetButton).toBeInTheDocument();
  });

  test('renders reset button when both query and selectedGenreId are provided', () => {
    render(<EmptyState query="test" selectedGenreId={28} onReset={mockOnReset} />);

    const resetButton = screen.getByRole('button', { name: /view all movies/i });
    expect(resetButton).toBeInTheDocument();
  });

  test('calls onReset when reset button is clicked', async () => {
    const user = userEvent.setup();
    render(<EmptyState query="test" onReset={mockOnReset} />);

    const resetButton = screen.getByRole('button', { name: /view all movies/i });
    await user.click(resetButton);

    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  test('does not render reset button when selectedGenreId is 0 (falsy)', () => {
    render(<EmptyState selectedGenreId={0} onReset={mockOnReset} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('does not render reset button when selectedGenreId is null', () => {
    render(<EmptyState selectedGenreId={null} onReset={mockOnReset} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('handles empty query string', () => {
    render(<EmptyState query="" onReset={mockOnReset} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('handles long messages', () => {
    const longMessage = 'This is a very long empty state message that should be displayed properly even if it extends beyond the normal width';
    render(<EmptyState message={longMessage} />);

    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  test('handles special characters in message', () => {
    const specialMessage = 'Empty: @#$%^&*()_+{}|:"<>?[]\\;\',./';
    render(<EmptyState message={specialMessage} />);

    expect(screen.getByText(specialMessage)).toBeInTheDocument();
  });

  test('renders message and button together when conditions are met', () => {
    render(<EmptyState query="batman" message="No results" onReset={mockOnReset} />);

    expect(screen.getByText('No results')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view all movies/i })).toBeInTheDocument();
  });

  test('handles multiple reset button clicks', async () => {
    const user = userEvent.setup();
    render(<EmptyState query="test" onReset={mockOnReset} />);

    const resetButton = screen.getByRole('button', { name: /view all movies/i });
    await user.click(resetButton);
    await user.click(resetButton);
    await user.click(resetButton);

    expect(mockOnReset).toHaveBeenCalledTimes(3);
  });
});

