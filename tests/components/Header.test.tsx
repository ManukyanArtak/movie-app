import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from '../../src/components/Header/Header';

jest.mock('lucide-react', () => ({
  Film: ({ size }: { size: number }) => <span data-testid="film-icon" data-size={size}>🎬</span>,
  X: ({ size }: { size: number }) => <span data-testid="x-icon" data-size={size}>✕</span>,
}));

jest.mock('../../src/components/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme Toggle</div>,
}));

describe('<Header />', () => {
  const mockOnSearchChange = jest.fn();
  const mockOnClearSearch = jest.fn();

  beforeEach(() => {
    mockOnSearchChange.mockClear();
    mockOnClearSearch.mockClear();
  });

  test('renders title with film icon', () => {
    render(<Header query="" onSearchChange={mockOnSearchChange} onClearSearch={mockOnClearSearch} />);

    expect(screen.getByText('Movie Explorer')).toBeInTheDocument();
    expect(screen.getByTestId('film-icon')).toBeInTheDocument();
  });

  test('renders search input with placeholder', () => {
    render(<Header query="" onSearchChange={mockOnSearchChange} onClearSearch={mockOnClearSearch} />);

    const searchInput = screen.getByPlaceholderText('Search movies...');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveValue('');
  });

  test('displays query value in search input', () => {
    render(<Header query="batman" onSearchChange={mockOnSearchChange} onClearSearch={mockOnClearSearch} />);

    const searchInput = screen.getByPlaceholderText('Search movies...');
    expect(searchInput).toHaveValue('batman');
  });

  test('calls onSearchChange when input value changes', async () => {
    const user = userEvent.setup();
    render(<Header query="" onSearchChange={mockOnSearchChange} onClearSearch={mockOnClearSearch} />);

    const searchInput = screen.getByPlaceholderText('Search movies...');
    await user.type(searchInput, 'test');

    expect(mockOnSearchChange).toHaveBeenCalledTimes(4);
  });

  test('renders clear button when query is not empty', () => {
    render(<Header query="batman" onSearchChange={mockOnSearchChange} onClearSearch={mockOnClearSearch} />);

    const clearButton = screen.getByRole('button');
    expect(clearButton).toBeInTheDocument();
    expect(screen.getByTestId('x-icon')).toBeInTheDocument();
  });

  test('does not render clear button when query is empty', () => {
    render(<Header query="" onSearchChange={mockOnSearchChange} onClearSearch={mockOnClearSearch} />);

    const clearButton = screen.queryByTestId('x-icon');
    expect(clearButton).not.toBeInTheDocument();
  });

  test('calls onClearSearch when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<Header query="batman" onSearchChange={mockOnSearchChange} onClearSearch={mockOnClearSearch} />);

    const clearButton = screen.getByRole('button');
    await user.click(clearButton);

    expect(mockOnClearSearch).toHaveBeenCalledTimes(1);
  });

  test('renders theme toggle', () => {
    render(<Header query="" onSearchChange={mockOnSearchChange} onClearSearch={mockOnClearSearch} />);

    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
  });

  test('handles empty string query', () => {
    render(<Header query="" onSearchChange={mockOnSearchChange} onClearSearch={mockOnClearSearch} />);

    const searchInput = screen.getByPlaceholderText('Search movies...');
    expect(searchInput).toHaveValue('');
    expect(screen.queryByTestId('x-icon')).not.toBeInTheDocument();
  });

  test('handles long query strings', () => {
    const longQuery = 'a'.repeat(100);
    render(<Header query={longQuery} onSearchChange={mockOnSearchChange} onClearSearch={mockOnClearSearch} />);

    const searchInput = screen.getByPlaceholderText('Search movies...');
    expect(searchInput).toHaveValue(longQuery);
    expect(screen.getByTestId('x-icon')).toBeInTheDocument();
  });

  test('handles special characters in query', () => {
    const specialQuery = 'test@#$%^&*()';
    render(<Header query={specialQuery} onSearchChange={mockOnSearchChange} onClearSearch={mockOnClearSearch} />);

    const searchInput = screen.getByPlaceholderText('Search movies...');
    expect(searchInput).toHaveValue(specialQuery);
  });

  test('renders all elements together', () => {
    render(<Header query="test" onSearchChange={mockOnSearchChange} onClearSearch={mockOnClearSearch} />);

    expect(screen.getByText('Movie Explorer')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search movies...')).toBeInTheDocument();
    expect(screen.getByTestId('x-icon')).toBeInTheDocument();
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
  });
});

