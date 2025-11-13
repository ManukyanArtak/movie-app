export interface GenreFilterProps {
  selectedGenreId: number | null;
  onGenreSelect: (genreId: number | null) => void;
}

