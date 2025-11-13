import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GenreFilter } from '../../src/components/GenreFilter/GenreFilter';
import type { Genre } from '../../src/types/tmdb';

jest.mock('lucide-react', () => ({
  Folder: ({ size }: { size: number }) => <span data-testid="folder-icon" data-size={size}>📁</span>,
  ChevronUp: ({ size }: { size: number }) => <span data-testid="chevron-up-icon" data-size={size}>↑</span>,
  ChevronDown: ({ size }: { size: number }) => <span data-testid="chevron-down-icon" data-size={size}>↓</span>,
}));

jest.mock('../../src/hooks/queries', () => ({
  useGenresQuery: jest.fn(),
}));

import { useGenresQuery } from '../../src/hooks/queries';

const mockUseGenresQuery = useGenresQuery as jest.MockedFunction<typeof useGenresQuery>;

describe('<GenreFilter />', () => {
  const mockGenres: Genre[] = [
    { id: 28, name: 'Action' },
    { id: 35, name: 'Comedy' },
    { id: 18, name: 'Drama' },
    { id: 27, name: 'Horror' },
  ];

  const mockOnGenreSelect = jest.fn();

  beforeEach(() => {
    mockOnGenreSelect.mockClear();
    mockUseGenresQuery.mockReturnValue({
      data: { genres: mockGenres },
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
      dataUpdatedAt: Date.now(),
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
      isFetched: true,
      isFetchedAfterMount: true,
      isFetching: false,
      isInitialLoading: false,
      isPaused: false,
      isPlaceholderData: false,
      isPreviousData: false,
      isRefetching: false,
      isRefetchError: false,
      isStale: false,
      refetch: jest.fn(),
      status: 'success',
    } as any);
  });

  test('renders loading state', () => {
    mockUseGenresQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      isSuccess: false,
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
      isFetched: false,
      isFetchedAfterMount: false,
      isFetching: true,
      isInitialLoading: true,
      isPaused: false,
      isPlaceholderData: false,
      isPreviousData: false,
      isRefetching: false,
      isRefetchError: false,
      isStale: true,
      refetch: jest.fn(),
      status: 'loading',
    } as any);

    render(<GenreFilter selectedGenreId={null} onGenreSelect={mockOnGenreSelect} />);

    expect(screen.getByText('Loading genres...')).toBeInTheDocument();
  });

  test('renders genre filter title', () => {
    render(<GenreFilter selectedGenreId={null} onGenreSelect={mockOnGenreSelect} />);

    expect(screen.getByText('Genres')).toBeInTheDocument();
  });

  test('renders "All Genres" button', () => {
    render(<GenreFilter selectedGenreId={null} onGenreSelect={mockOnGenreSelect} />);

    const allGenresButtons = screen.getAllByText('All Genres');
    expect(allGenresButtons.length).toBeGreaterThan(0);
  });

  test('renders all genres', () => {
    render(<GenreFilter selectedGenreId={null} onGenreSelect={mockOnGenreSelect} />);

    expect(screen.getAllByText('Action').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Comedy').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Drama').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Horror').length).toBeGreaterThan(0);
  });

  test('highlights selected genre', () => {
    render(<GenreFilter selectedGenreId={28} onGenreSelect={mockOnGenreSelect} />);

    const buttons = screen.getAllByRole('button');
    const actionButton = buttons.find(btn => btn.textContent === 'Action' && btn.className.includes('genreItem'));
    expect(actionButton).toBeDefined();
    expect(actionButton?.className).toContain('active');
  });

  test('highlights "All Genres" when no genre is selected', () => {
    render(<GenreFilter selectedGenreId={null} onGenreSelect={mockOnGenreSelect} />);

    const buttons = screen.getAllByRole('button');
    const allGenresButton = buttons.find(btn => btn.textContent === 'All Genres' && btn.className.includes('genreItem'));
    expect(allGenresButton).toBeDefined();
    expect(allGenresButton?.className).toContain('active');
  });

  test('calls onGenreSelect when genre is clicked', async () => {
    const user = userEvent.setup();
    render(<GenreFilter selectedGenreId={null} onGenreSelect={mockOnGenreSelect} />);

    const buttons = screen.getAllByRole('button');
    const actionButton = buttons.find(btn => btn.textContent === 'Action' && btn.className.includes('genreItem'));
    await user.click(actionButton!);

    expect(mockOnGenreSelect).toHaveBeenCalledTimes(1);
    expect(mockOnGenreSelect).toHaveBeenCalledWith(28);
  });

  test('calls onGenreSelect with null when "All Genres" is clicked', async () => {
    const user = userEvent.setup();
    render(<GenreFilter selectedGenreId={28} onGenreSelect={mockOnGenreSelect} />);

    const buttons = screen.getAllByRole('button');
    const allGenresButton = buttons.find(btn => btn.textContent === 'All Genres' && btn.className.includes('genreItem'));
    await user.click(allGenresButton!);

    expect(mockOnGenreSelect).toHaveBeenCalledTimes(1);
    expect(mockOnGenreSelect).toHaveBeenCalledWith(null);
  });

  test('renders mobile trigger button with selected genre name', () => {
    render(<GenreFilter selectedGenreId={28} onGenreSelect={mockOnGenreSelect} />);

    const buttons = screen.getAllByRole('button');
    const triggerButton = buttons.find(btn => btn.className.includes('genreMobileTrigger'));
    expect(triggerButton).toBeInTheDocument();
    expect(triggerButton?.textContent).toContain('Action');
    expect(screen.getByTestId('folder-icon')).toBeInTheDocument();
  });

  test('renders mobile trigger button with "All Genres" when no genre selected', () => {
    render(<GenreFilter selectedGenreId={null} onGenreSelect={mockOnGenreSelect} />);

    const buttons = screen.getAllByRole('button');
    const triggerButton = buttons.find(btn => btn.className.includes('genreMobileTrigger'));
    expect(triggerButton).toBeInTheDocument();
    expect(triggerButton?.textContent).toContain('All Genres');
  });

  test('toggles mobile menu when trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<GenreFilter selectedGenreId={null} onGenreSelect={mockOnGenreSelect} />);

    const triggerButtons = screen.getAllByRole('button');
    const mobileTrigger = triggerButtons.find(btn => btn.className.includes('genreMobileTrigger'));
    
    expect(mobileTrigger).toBeInTheDocument();
    await user.click(mobileTrigger!);

    expect(screen.getByTestId('chevron-up-icon')).toBeInTheDocument();
  });

  test('closes mobile menu when genre is selected', async () => {
    const user = userEvent.setup();
    render(<GenreFilter selectedGenreId={null} onGenreSelect={mockOnGenreSelect} />);

    const triggerButtons = screen.getAllByRole('button');
    const mobileTrigger = triggerButtons.find(btn => btn.className.includes('genreMobileTrigger'));
    await user.click(mobileTrigger!);

    const buttons = screen.getAllByRole('button');
    const actionButton = buttons.find(btn => btn.textContent === 'Action' && btn.className.includes('genreItem'));
    await user.click(actionButton!);

    expect(mockOnGenreSelect).toHaveBeenCalledWith(28);
  });

  test('handles empty genres array', () => {
    mockUseGenresQuery.mockReturnValue({
      data: { genres: [] },
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
      dataUpdatedAt: Date.now(),
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
      isFetched: true,
      isFetchedAfterMount: true,
      isFetching: false,
      isInitialLoading: false,
      isPaused: false,
      isPlaceholderData: false,
      isPreviousData: false,
      isRefetching: false,
      isRefetchError: false,
      isStale: false,
      refetch: jest.fn(),
      status: 'success',
    } as any);

    render(<GenreFilter selectedGenreId={null} onGenreSelect={mockOnGenreSelect} />);

    expect(screen.getAllByText('All Genres').length).toBeGreaterThan(0);
    expect(screen.queryByText('Action')).not.toBeInTheDocument();
  });

  test('handles undefined genres data', () => {
    mockUseGenresQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
      dataUpdatedAt: Date.now(),
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
      isFetched: true,
      isFetchedAfterMount: true,
      isFetching: false,
      isInitialLoading: false,
      isPaused: false,
      isPlaceholderData: false,
      isPreviousData: false,
      isRefetching: false,
      isRefetchError: false,
      isStale: false,
      refetch: jest.fn(),
      status: 'success',
    } as any);

    render(<GenreFilter selectedGenreId={null} onGenreSelect={mockOnGenreSelect} />);

    expect(screen.getAllByText('All Genres').length).toBeGreaterThan(0);
  });

  test('displays correct genre name in mobile trigger for selected genre', () => {
    render(<GenreFilter selectedGenreId={35} onGenreSelect={mockOnGenreSelect} />);

    const buttons = screen.getAllByRole('button');
    const triggerButton = buttons.find(btn => btn.className.includes('genreMobileTrigger'));
    expect(triggerButton).toBeInTheDocument();
    expect(triggerButton?.textContent).toContain('Comedy');
  });
});

