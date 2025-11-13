import { renderHook, act } from '@testing-library/react';
import { useFavorites } from '../../src/hooks/useFavorites';
import { favoritesService } from '../../src/services/FavoritesService';
import type { Movie } from '../../src/types/tmdb';

jest.mock('../../src/services/FavoritesService');

const mockFavoritesService = favoritesService as jest.Mocked<typeof favoritesService>;

describe('useFavorites', () => {
  const mockMovie: Movie = {
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
    popularity: 100,
    adult: false,
    video: false,
  };

  const mockFavoriteMovie = {
    id: 550,
    title: 'Fight Club',
    poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    release_date: '1999-10-15',
    vote_average: 8.4,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFavoritesService.getFavorites.mockReturnValue([]);
    mockFavoritesService.isFavorite.mockReturnValue(false);
    mockFavoritesService.addFavorite.mockReturnValue([mockFavoriteMovie]);
    mockFavoritesService.deleteFavorite.mockReturnValue([]);
  });

  test('initializes with favorites from service', () => {
    const initialFavorites = [mockFavoriteMovie];
    mockFavoritesService.getFavorites.mockReturnValue(initialFavorites);

    const { result } = renderHook(() => useFavorites());

    expect(result.current.favorites).toEqual(initialFavorites);
    expect(mockFavoritesService.getFavorites).toHaveBeenCalledTimes(1);
  });

  test('initializes with empty array when no favorites exist', () => {
    mockFavoritesService.getFavorites.mockReturnValue([]);

    const { result } = renderHook(() => useFavorites());

    expect(result.current.favorites).toEqual([]);
  });

  test('toggleFavorite adds movie when not favorite', () => {
    mockFavoritesService.isFavorite.mockReturnValue(false);
    mockFavoritesService.addFavorite.mockReturnValue([mockFavoriteMovie]);

    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite(mockMovie);
    });

    expect(mockFavoritesService.isFavorite).toHaveBeenCalledWith(mockMovie.id);
    expect(mockFavoritesService.addFavorite).toHaveBeenCalledWith(mockFavoriteMovie);
    expect(mockFavoritesService.deleteFavorite).not.toHaveBeenCalled();
    expect(result.current.favorites).toEqual([mockFavoriteMovie]);
  });

  test('toggleFavorite removes movie when already favorite', () => {
    const existingFavorites = [mockFavoriteMovie];
    mockFavoritesService.getFavorites.mockReturnValue(existingFavorites);
    mockFavoritesService.isFavorite.mockReturnValue(true);
    mockFavoritesService.deleteFavorite.mockReturnValue([]);

    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite(mockMovie);
    });

    expect(mockFavoritesService.isFavorite).toHaveBeenCalledWith(mockMovie.id);
    expect(mockFavoritesService.deleteFavorite).toHaveBeenCalledWith(mockMovie.id);
    expect(mockFavoritesService.addFavorite).not.toHaveBeenCalled();
    expect(result.current.favorites).toEqual([]);
  });

  test('isFavorite calls service method', () => {
    mockFavoritesService.isFavorite.mockReturnValue(true);

    const { result } = renderHook(() => useFavorites());

    const isFavorite = result.current.isFavorite(550);

    expect(mockFavoritesService.isFavorite).toHaveBeenCalledWith(550);
    expect(isFavorite).toBe(true);
  });

  test('isFavorite returns false when movie is not favorite', () => {
    mockFavoritesService.isFavorite.mockReturnValue(false);

    const { result } = renderHook(() => useFavorites());

    const isFavorite = result.current.isFavorite(550);

    expect(isFavorite).toBe(false);
  });

  test('toggleFavorite handles multiple movies', () => {
    const movie1 = { ...mockMovie, id: 1, title: 'Movie 1' };
    const movie2 = { ...mockMovie, id: 2, title: 'Movie 2' };
    const favorite1 = { ...mockFavoriteMovie, id: 1, title: 'Movie 1' };
    const favorite2 = { ...mockFavoriteMovie, id: 2, title: 'Movie 2' };

    mockFavoritesService.isFavorite
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false);
    mockFavoritesService.addFavorite
      .mockReturnValueOnce([favorite1])
      .mockReturnValueOnce([favorite1, favorite2]);

    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite(movie1);
    });

    expect(result.current.favorites).toEqual([favorite1]);

    act(() => {
      result.current.toggleFavorite(movie2);
    });

    expect(result.current.favorites).toEqual([favorite1, favorite2]);
  });

  test('toggleFavorite correctly transforms Movie to FavoriteMovie', () => {
    const movieWithNullPoster: Movie = {
      ...mockMovie,
      poster_path: null,
    };

    mockFavoritesService.isFavorite.mockReturnValue(false);
    mockFavoritesService.addFavorite.mockReturnValue([
      {
        id: movieWithNullPoster.id,
        title: movieWithNullPoster.title,
        poster_path: null,
        release_date: movieWithNullPoster.release_date,
        vote_average: movieWithNullPoster.vote_average,
      },
    ]);

    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite(movieWithNullPoster);
    });

    expect(mockFavoritesService.addFavorite).toHaveBeenCalledWith({
      id: movieWithNullPoster.id,
      title: movieWithNullPoster.title,
      poster_path: null,
      release_date: movieWithNullPoster.release_date,
      vote_average: movieWithNullPoster.vote_average,
    });
  });

  test('favorites state persists across multiple toggles', () => {
    mockFavoritesService.isFavorite
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);
    mockFavoritesService.addFavorite.mockReturnValue([mockFavoriteMovie]);
    mockFavoritesService.deleteFavorite.mockReturnValue([]);

    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite(mockMovie);
    });
    expect(result.current.favorites).toEqual([mockFavoriteMovie]);

    act(() => {
      result.current.toggleFavorite(mockMovie);
    });
    expect(result.current.favorites).toEqual([]);

    act(() => {
      result.current.toggleFavorite(mockMovie);
    });
    expect(result.current.favorites).toEqual([mockFavoriteMovie]);
  });
});

