import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router';
import { MovieCard } from '../../../src/components/Movie/MovieCard/MovieCard';
import type { Movie } from '../../../src/types/tmdb';

jest.mock('lucide-react', () => ({
  Star: ({ size, fill }: { size: number; fill: string }) => (
    <span data-testid="star-icon" data-size={size} data-fill={fill}>
      ★
    </span>
  ),
  Heart: ({ size, fill }: { size: number; fill: string }) => (
    <span data-testid="heart-icon" data-size={size} data-fill={fill}>
      ♥
    </span>
  ),
}));

jest.mock('../../../src/services/tmdb', () => ({
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/w500',
  BACKDROP_BASE_URL: 'https://image.tmdb.org/t/p/original',
}));

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('<MovieCard />', () => {
  const mockMovie: Movie = {
    id: 550,
    title: 'Fight Club',
    original_title: 'Fight Club',
    original_language: 'en',
    poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    backdrop_path: '/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg',
    overview: 'A ticking-time-bomb insomniac and a slippery soap salesman...',
    release_date: '1999-10-15',
    vote_average: 8.4,
    vote_count: 26280,
  };

  const mockOnToggleFavorite = jest.fn();

  beforeEach(() => {
    mockOnToggleFavorite.mockClear();
  });

  test('renders movie title', () => {
    renderWithRouter(
      <MovieCard movie={mockMovie} isFavorite={false} onToggleFavorite={mockOnToggleFavorite} />
    );

    expect(screen.getByText('Fight Club')).toBeInTheDocument();
  });

  test('renders movie poster with correct src and alt', () => {
    renderWithRouter(
      <MovieCard movie={mockMovie} isFavorite={false} onToggleFavorite={mockOnToggleFavorite} />
    );

    const img = screen.getByAltText('Fight Club');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', expect.stringContaining(mockMovie.poster_path!));
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  test('renders rating with correct formatting', () => {
    renderWithRouter(
      <MovieCard movie={mockMovie} isFavorite={false} onToggleFavorite={mockOnToggleFavorite} />
    );

    expect(screen.getByText('8.4')).toBeInTheDocument();
    expect(screen.getByTestId('star-icon')).toBeInTheDocument();
  });

  test('renders release year', () => {
    renderWithRouter(
      <MovieCard movie={mockMovie} isFavorite={false} onToggleFavorite={mockOnToggleFavorite} />
    );

    expect(screen.getByText('1999')).toBeInTheDocument();
  });

  test('renders as a link to movie details page', () => {
    renderWithRouter(
      <MovieCard movie={mockMovie} isFavorite={false} onToggleFavorite={mockOnToggleFavorite} />
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/movie/550');
  });

  test('renders favorite button with correct aria-label when not favorite', () => {
    renderWithRouter(
      <MovieCard movie={mockMovie} isFavorite={false} onToggleFavorite={mockOnToggleFavorite} />
    );

    const favoriteBtn = screen.getByRole('button', { name: /add to favorites/i });
    expect(favoriteBtn).toBeInTheDocument();
  });

  test('renders favorite button with correct aria-label when favorite', () => {
    renderWithRouter(
      <MovieCard movie={mockMovie} isFavorite={true} onToggleFavorite={mockOnToggleFavorite} />
    );

    const favoriteBtn = screen.getByRole('button', { name: /remove from favorites/i });
    expect(favoriteBtn).toBeInTheDocument();
  });

  test('calls onToggleFavorite when favorite button clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <MovieCard movie={mockMovie} isFavorite={false} onToggleFavorite={mockOnToggleFavorite} />
    );

    const favoriteBtn = screen.getByRole('button', { name: /add to favorites/i });
    await user.click(favoriteBtn);

    expect(mockOnToggleFavorite).toHaveBeenCalledTimes(1);
    expect(mockOnToggleFavorite).toHaveBeenCalledWith(mockMovie);
  });

  test('prevents navigation when favorite button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <MovieCard movie={mockMovie} isFavorite={false} onToggleFavorite={mockOnToggleFavorite} />
    );

    const favoriteBtn = screen.getByRole('button', { name: /add to favorites/i });
    await user.click(favoriteBtn);

    expect(window.location.pathname).toBe('/');
  });

  test('displays heart icon filled when movie is favorite', () => {
    renderWithRouter(
      <MovieCard movie={mockMovie} isFavorite={true} onToggleFavorite={mockOnToggleFavorite} />
    );

    const heartIcon = screen.getByTestId('heart-icon');
    expect(heartIcon).toHaveAttribute('data-fill', 'currentColor');
  });

  test('displays heart icon not filled when movie is not favorite', () => {
    renderWithRouter(
      <MovieCard movie={mockMovie} isFavorite={false} onToggleFavorite={mockOnToggleFavorite} />
    );

    const heartIcon = screen.getByTestId('heart-icon');
    expect(heartIcon).toHaveAttribute('data-fill', 'none');
  });

  test('formats rating to one decimal place', () => {
    const movieWithPreciseRating: Movie = {
      ...mockMovie,
      vote_average: 7.666666,
    };

    renderWithRouter(
      <MovieCard
        movie={movieWithPreciseRating}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    expect(screen.getByText('7.7')).toBeInTheDocument();
  });

  test('handles movies with null poster_path', () => {
    const movieWithoutPoster: Movie = {
      ...mockMovie,
      poster_path: null,
    };

    renderWithRouter(
      <MovieCard
        movie={movieWithoutPoster}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    const img = screen.getByAltText('Fight Club');
    expect(img).toHaveAttribute('src', expect.stringContaining('null'));
  });

  test('handles movies with very long titles', () => {
    const movieWithLongTitle: Movie = {
      ...mockMovie,
      title:
        'A Very Long Movie Title That Goes On And On And Should Be Truncated Or Wrapped Properly',
    };

    renderWithRouter(
      <MovieCard
        movie={movieWithLongTitle}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    expect(
      screen.getByText(
        'A Very Long Movie Title That Goes On And On And Should Be Truncated Or Wrapped Properly'
      )
    ).toBeInTheDocument();
  });

  test('extracts year correctly from release_date', () => {
    const movieWith2023Release: Movie = {
      ...mockMovie,
      release_date: '2023-07-21',
    };

    renderWithRouter(
      <MovieCard
        movie={movieWith2023Release}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    expect(screen.getByText('2023')).toBeInTheDocument();
  });
});

