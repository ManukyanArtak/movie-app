import { HttpClient } from "./HttpClient";
import type {
  MoviesResponse,
  GenresResponse,
  MovieDetails,
  CreditsResponse,
  VideosResponse,
} from "../types/tmdb";

const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

class TMDBService extends HttpClient {
  constructor() {
    super(BASE_URL, {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    });
  }

  async getPopularMovies(page: number = 1): Promise<MoviesResponse> {
    return this.get<MoviesResponse>("/movie/popular", {
      params: { page },
    });
  }

  async searchMovies(query: string, page: number = 1): Promise<MoviesResponse> {
    return this.get<MoviesResponse>("/search/movie", {
      params: { query, page },
    });
  }

  async getMoviesByGenre(
    genreId: number,
    page: number = 1
  ): Promise<MoviesResponse> {
    return this.get<MoviesResponse>("/discover/movie", {
      params: { with_genres: genreId, page },
    });
  }

  async getGenres(): Promise<GenresResponse> {
    return this.get<GenresResponse>("/genre/movie/list");
  }

  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    return this.get<MovieDetails>(`/movie/${movieId}`);
  }

  async getMovieCredits(movieId: number): Promise<CreditsResponse> {
    return this.get<CreditsResponse>(`/movie/${movieId}/credits`);
  }

  async getMovieVideos(movieId: number): Promise<VideosResponse> {
    return this.get<VideosResponse>(`/movie/${movieId}/videos`);
  }
}

export const tmdbService = new TMDBService();

export const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;
export const BACKDROP_BASE_URL = import.meta.env.VITE_BACKDROP_BASE_URL;
