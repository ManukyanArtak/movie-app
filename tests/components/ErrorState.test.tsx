import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorState } from '../../src/components/ErrorState/ErrorState';

describe('<ErrorState />', () => {
  const mockOnBack = jest.fn();

  beforeEach(() => {
    mockOnBack.mockClear();
  });

  test('renders default title', () => {
    render(<ErrorState onBack={mockOnBack} />);

    expect(screen.getByText('Oops!')).toBeInTheDocument();
  });

  test('renders default message', () => {
    render(<ErrorState onBack={mockOnBack} />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  test('renders custom message', () => {
    const customMessage = 'Custom error message';
    render(<ErrorState message={customMessage} onBack={mockOnBack} />);

    expect(screen.getByText(customMessage)).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  test('renders back button', () => {
    render(<ErrorState onBack={mockOnBack} />);

    const backButton = screen.getByRole('button', { name: /back to home/i });
    expect(backButton).toBeInTheDocument();
  });

  test('calls onBack when back button is clicked', async () => {
    const user = userEvent.setup();
    render(<ErrorState onBack={mockOnBack} />);

    const backButton = screen.getByRole('button', { name: /back to home/i });
    await user.click(backButton);

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  test('renders all elements together', () => {
    render(<ErrorState message="Test error" onBack={mockOnBack} />);

    expect(screen.getByText('Oops!')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to home/i })).toBeInTheDocument();
  });

  test('handles empty message string', () => {
    render(<ErrorState message="" onBack={mockOnBack} />);

    const messageElement = screen.getByRole('paragraph');
    expect(messageElement).toBeInTheDocument();
    expect(messageElement).toHaveTextContent('');
  });

  test('handles long error messages', () => {
    const longMessage = 'This is a very long error message that should be displayed properly even if it extends beyond the normal width of the container and wraps to multiple lines';
    render(<ErrorState message={longMessage} onBack={mockOnBack} />);

    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  test('handles special characters in message', () => {
    const specialMessage = 'Error: @#$%^&*()_+{}|:"<>?[]\\;\',./';
    render(<ErrorState message={specialMessage} onBack={mockOnBack} />);

    expect(screen.getByText(specialMessage)).toBeInTheDocument();
  });
});

