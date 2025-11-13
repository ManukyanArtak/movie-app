export interface FavoriteMovie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

class FavoritesService {
  private readonly STORAGE_KEY = "tmdb_favorites";

  getFavorites(): FavoriteMovie[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return [];
    } catch (error) {
      console.error("Error getting favorites:", error);
      return [];
    }
  }

  addFavorite(movie: FavoriteMovie): FavoriteMovie[] {
    try {
      const favorites = this.getFavorites();
      const isAlreadyFavorite = this.isFavorite(movie.id);

      if (!isAlreadyFavorite) {
        const updatedFavorites = [...favorites, movie];
        localStorage.setItem(
          this.STORAGE_KEY,
          JSON.stringify(updatedFavorites)
        );
        return updatedFavorites;
      }

      return favorites;
    } catch (error) {
      console.error("Error adding favorite:", error);
      return this.getFavorites();
    }
  }

  deleteFavorite(movieId: number): FavoriteMovie[] {
    try {
      const favorites = this.getFavorites();
      const updatedFavorites = favorites.filter((f) => f.id !== movieId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedFavorites));
      return updatedFavorites;
    } catch (error) {
      console.error("Error deleting favorite:", error);
      return this.getFavorites();
    }
  }

  isFavorite(movieId: number): boolean {
    const favorites = this.getFavorites();
    return favorites.some((f) => f.id === movieId);
  }
}

export const favoritesService = new FavoritesService();
