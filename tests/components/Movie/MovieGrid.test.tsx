import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router';
import { MovieGrid } from '../../../src/components/Movie/MovieGrid/MovieGrid';
import type { Movie } from '../../../src/types/tmdb';

jest.mock('lucide-react', () => ({
  Star: () => <span data-testid="star-icon">★</span>,
  Heart: () => <span data-testid="heart-icon">♥</span>,
}));

jest.mock('../../../src/services/tmdb', () => ({
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/w500',
  BACKDROP_BASE_URL: 'https://image.tmdb.org/t/p/original',
}));

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('<MovieGrid />', () => {
  const mockMovies: Movie[] = [
    {
      id: 550,
      title: 'Fight Club',
      original_title: 'Fight Club',
      original_language: 'en',
      poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
      backdrop_path: '/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg',
      overview: 'A ticking-time-bomb insomniac...',
      release_date: '1999-10-15',
      vote_average: 8.4,
      vote_count: 26280,
    },
    {
      id: 13,
      title: 'Forrest Gump',
      original_title: 'Forrest Gump',
      original_language: 'en',
      poster_path: '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
      backdrop_path: '/3h1JZGDhZ8nzxdgvkxha0qBqi05.jpg',
      overview: 'A man with a low IQ...',
      release_date: '1994-07-06',
      vote_average: 8.5,
      vote_count: 25547,
    },
    {
      id: 155,
      title: 'The Dark Knight',
      original_title: 'The Dark Knight',
      original_language: 'en',
      poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      backdrop_path: '/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg',
      overview: 'Batman raises the stakes...',
      release_date: '2008-07-16',
      vote_average: 8.5,
      vote_count: 31155,
    },
  ];

  const mockIsFavorite = jest.fn((movieId: number) => movieId === 550);
  const mockOnToggleFavorite = jest.fn();

  beforeEach(() => {
    mockIsFavorite.mockClear();
    mockOnToggleFavorite.mockClear();
  });

  test('renders all movies in the grid', () => {
    renderWithRouter(
      <MovieGrid
        movies={mockMovies}
        isFavorite={mockIsFavorite}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    expect(screen.getByText('Fight Club')).toBeInTheDocument();
    expect(screen.getByText('Forrest Gump')).toBeInTheDocument();
    expect(screen.getByText('The Dark Knight')).toBeInTheDocument();
  });

  test('renders correct number of movie cards', () => {
    renderWithRouter(
      <MovieGrid
        movies={mockMovies}
        isFavorite={mockIsFavorite}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);
  });

  test('renders empty grid when no movies provided', () => {
    const { container } = renderWithRouter(
      <MovieGrid movies={[]} isFavorite={mockIsFavorite} onToggleFavorite={mockOnToggleFavorite} />
    );

    expect(screen.queryByText('Fight Club')).not.toBeInTheDocument();
    const gridElement = container.querySelector('div');
    expect(gridElement?.children).toHaveLength(0);
  });

  test('calls isFavorite for each movie', () => {
    renderWithRouter(
      <MovieGrid
        movies={mockMovies}
        isFavorite={mockIsFavorite}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    expect(mockIsFavorite).toHaveBeenCalledWith(550);
    expect(mockIsFavorite).toHaveBeenCalledWith(13);
    expect(mockIsFavorite).toHaveBeenCalledWith(155);
    expect(mockIsFavorite).toHaveBeenCalledTimes(3);
  });

  test('passes correct isFavorite state to each MovieCard', () => {
    renderWithRouter(
      <MovieGrid
        movies={mockMovies}
        isFavorite={mockIsFavorite}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    const favoriteButtons = screen.getAllByRole('button');
    
    expect(favoriteButtons[0]).toHaveAttribute('aria-label', 'Remove from favorites');
    expect(favoriteButtons[1]).toHaveAttribute('aria-label', 'Add to favorites');
    expect(favoriteButtons[2]).toHaveAttribute('aria-label', 'Add to favorites');
  });

  test('calls onToggleFavorite with correct movie when favorite button clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <MovieGrid
        movies={mockMovies}
        isFavorite={mockIsFavorite}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    const favoriteButtons = screen.getAllByRole('button');
    await user.click(favoriteButtons[1]);

    expect(mockOnToggleFavorite).toHaveBeenCalledTimes(1);
    expect(mockOnToggleFavorite).toHaveBeenCalledWith(mockMovies[1]);
  });

  test('renders movies in correct order', () => {
    renderWithRouter(
      <MovieGrid
        movies={mockMovies}
        isFavorite={mockIsFavorite}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/movie/550');
    expect(links[1]).toHaveAttribute('href', '/movie/13');
    expect(links[2]).toHaveAttribute('href', '/movie/155');
  });

  test('handles single movie', () => {
    const singleMovie = [mockMovies[0]];
    
    renderWithRouter(
      <MovieGrid
        movies={singleMovie}
        isFavorite={mockIsFavorite}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    expect(screen.getByText('Fight Club')).toBeInTheDocument();
    expect(screen.queryByText('Forrest Gump')).not.toBeInTheDocument();
    expect(screen.queryByText('The Dark Knight')).not.toBeInTheDocument();
  });

  test('renders large number of movies', () => {
    const largeMovieList: Movie[] = Array.from({ length: 20 }, (_, index) => ({
      id: index + 1,
      title: `Movie ${index + 1}`,
      original_title: `Movie ${index + 1}`,
      original_language: 'en',
      poster_path: `/poster${index}.jpg`,
      backdrop_path: `/backdrop${index}.jpg`,
      overview: `Overview for movie ${index + 1}`,
      release_date: '2023-01-01',
      vote_average: 7.5,
      vote_count: 1000,
    }));

    renderWithRouter(
      <MovieGrid
        movies={largeMovieList}
        isFavorite={mockIsFavorite}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    expect(screen.getByText('Movie 1')).toBeInTheDocument();
    expect(screen.getByText('Movie 20')).toBeInTheDocument();
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(20);
  });

  test('each movie card has unique key', () => {
    renderWithRouter(
      <MovieGrid
        movies={mockMovies}
        isFavorite={mockIsFavorite}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    expect(screen.getByText('Fight Club')).toBeInTheDocument();
    expect(screen.getByText('Forrest Gump')).toBeInTheDocument();
    expect(screen.getByText('The Dark Knight')).toBeInTheDocument();
  });

  test('handles movies with different favorite states', () => {
    const customIsFavorite = (movieId: number) => movieId === 13 || movieId === 155;
    
    renderWithRouter(
      <MovieGrid
        movies={mockMovies}
        isFavorite={customIsFavorite}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    const favoriteButtons = screen.getAllByRole('button');
    expect(favoriteButtons[0]).toHaveAttribute('aria-label', 'Add to favorites');
    expect(favoriteButtons[1]).toHaveAttribute('aria-label', 'Remove from favorites');
    expect(favoriteButtons[2]).toHaveAttribute('aria-label', 'Remove from favorites');
  });

  test('can toggle multiple movies to favorites', async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <MovieGrid
        movies={mockMovies}
        isFavorite={mockIsFavorite}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    const favoriteButtons = screen.getAllByRole('button');
    
    await user.click(favoriteButtons[0]);
    await user.click(favoriteButtons[1]);
    await user.click(favoriteButtons[2]);

    expect(mockOnToggleFavorite).toHaveBeenCalledTimes(3);
    expect(mockOnToggleFavorite).toHaveBeenNthCalledWith(1, mockMovies[0]);
    expect(mockOnToggleFavorite).toHaveBeenNthCalledWith(2, mockMovies[1]);
    expect(mockOnToggleFavorite).toHaveBeenNthCalledWith(3, mockMovies[2]);
  });
});

