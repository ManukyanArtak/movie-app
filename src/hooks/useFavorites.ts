import { useState, useEffect } from "react";
import {
  favoritesService,
  type FavoriteMovie,
} from "../services/FavoritesService";
import type { Movie } from "../types/tmdb";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);

  useEffect(() => {
    const storedFavorites = favoritesService.getFavorites();
    setFavorites(storedFavorites);
  }, []);

  const toggleFavorite = (movie: Movie) => {
    const favoriteMovie: FavoriteMovie = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
    };

    let updatedFavorites: FavoriteMovie[];
    if (favoritesService.isFavorite(movie.id)) {
      updatedFavorites = favoritesService.deleteFavorite(movie.id);
    } else {
      updatedFavorites = favoritesService.addFavorite(favoriteMovie);
    }
    setFavorites(updatedFavorites);
  };

  const isFavorite = (movieId: number): boolean => {
    return favoritesService.isFavorite(movieId);
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  };
};
