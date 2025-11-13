export interface EmptyStateProps {
  query?: string;
  selectedGenreId?: number | null;
  onReset?: () => void;
  message?: string;
}

