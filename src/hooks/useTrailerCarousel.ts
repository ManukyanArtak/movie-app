import { useState, useMemo } from "react";
import type { Video } from "../types/tmdb";

export const useTrailerCarousel = (videos: Video[]) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const trailers = useMemo(
    () =>
      videos.filter(
        (video) =>
          video.site === "YouTube" &&
          (video.type === "Trailer" || video.type === "Teaser")
      ),
    [videos]
  );

  const currentTrailer = trailers[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? trailers.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === trailers.length - 1 ? 0 : prev + 1));
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  return {
    trailers,
    currentTrailer,
    currentIndex,
    handlePrev,
    handleNext,
    goToIndex,
  };
};
