import { renderHook, act } from '@testing-library/react';
import { useTrailerCarousel } from '../../src/hooks/useTrailerCarousel';
import type { Video } from '../../src/types/tmdb';

describe('useTrailerCarousel', () => {
  const mockVideos: Video[] = [
    {
      id: '1',
      key: 'abc123',
      name: 'Trailer 1',
      site: 'YouTube',
      type: 'Trailer',
      official: true,
    },
    {
      id: '2',
      key: 'def456',
      name: 'Teaser 1',
      site: 'YouTube',
      type: 'Teaser',
      official: true,
    },
    {
      id: '3',
      key: 'ghi789',
      name: 'Behind the Scenes',
      site: 'YouTube',
      type: 'Behind the Scenes',
      official: false,
    },
    {
      id: '4',
      key: 'jkl012',
      name: 'Trailer 2',
      site: 'Vimeo',
      type: 'Trailer',
      official: true,
    },
  ];

  test('filters only YouTube trailers and teasers', () => {
    const { result } = renderHook(() => useTrailerCarousel(mockVideos));

    expect(result.current.trailers).toHaveLength(2);
    expect(result.current.trailers[0].id).toBe('1');
    expect(result.current.trailers[1].id).toBe('2');
  });

  test('returns first trailer as current by default', () => {
    const { result } = renderHook(() => useTrailerCarousel(mockVideos));

    expect(result.current.currentTrailer).toEqual(mockVideos[0]);
    expect(result.current.currentIndex).toBe(0);
  });

  test('returns null currentTrailer when no trailers exist', () => {
    const { result } = renderHook(() => useTrailerCarousel([]));

    expect(result.current.trailers).toHaveLength(0);
    expect(result.current.currentTrailer).toBeUndefined();
    expect(result.current.currentIndex).toBe(0);
  });

  test('handleNext moves to next trailer', () => {
    const { result } = renderHook(() => useTrailerCarousel(mockVideos));

    act(() => {
      result.current.handleNext();
    });

    expect(result.current.currentIndex).toBe(1);
    expect(result.current.currentTrailer).toEqual(mockVideos[1]);
  });

  test('handleNext wraps to first trailer at end', () => {
    const { result } = renderHook(() => useTrailerCarousel(mockVideos));

    act(() => {
      result.current.handleNext();
      result.current.handleNext();
    });

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.currentTrailer).toEqual(mockVideos[0]);
  });

  test('handlePrev moves to previous trailer', () => {
    const { result } = renderHook(() => useTrailerCarousel(mockVideos));

    act(() => {
      result.current.handleNext();
      result.current.handlePrev();
    });

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.currentTrailer).toEqual(mockVideos[0]);
  });

  test('handlePrev wraps to last trailer at start', () => {
    const { result } = renderHook(() => useTrailerCarousel(mockVideos));

    act(() => {
      result.current.handlePrev();
    });

    expect(result.current.currentIndex).toBe(1);
    expect(result.current.currentTrailer).toEqual(mockVideos[1]);
  });

  test('goToIndex sets specific index', () => {
    const { result } = renderHook(() => useTrailerCarousel(mockVideos));

    act(() => {
      result.current.goToIndex(1);
    });

    expect(result.current.currentIndex).toBe(1);
    expect(result.current.currentTrailer).toEqual(mockVideos[1]);
  });

  test('goToIndex can set to first trailer', () => {
    const { result } = renderHook(() => useTrailerCarousel(mockVideos));

    act(() => {
      result.current.goToIndex(1);
      result.current.goToIndex(0);
    });

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.currentTrailer).toEqual(mockVideos[0]);
  });

  test('handles single trailer', () => {
    const singleTrailer = [mockVideos[0]];
    const { result } = renderHook(() => useTrailerCarousel(singleTrailer));

    expect(result.current.trailers).toHaveLength(1);
    expect(result.current.currentTrailer).toEqual(singleTrailer[0]);

    act(() => {
      result.current.handleNext();
    });

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.currentTrailer).toEqual(singleTrailer[0]);

    act(() => {
      result.current.handlePrev();
    });

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.currentTrailer).toEqual(singleTrailer[0]);
  });

  test('filters out non-YouTube videos', () => {
    const { result } = renderHook(() => useTrailerCarousel(mockVideos));

    expect(result.current.trailers.every((v) => v.site === 'YouTube')).toBe(
      true
    );
  });

  test('filters out non-trailer/teaser types', () => {
    const { result } = renderHook(() => useTrailerCarousel(mockVideos));

    expect(
      result.current.trailers.every(
        (v) => v.type === 'Trailer' || v.type === 'Teaser'
      )
    ).toBe(true);
  });

  test('updates trailers when videos prop changes', () => {
    const { result, rerender } = renderHook(
      ({ videos }) => useTrailerCarousel(videos),
      {
        initialProps: { videos: mockVideos },
      }
    );

    expect(result.current.trailers).toHaveLength(2);

    const newVideos: Video[] = [
      {
        id: '5',
        key: 'new123',
        name: 'New Trailer',
        site: 'YouTube',
        type: 'Trailer',
        official: true,
      },
    ];

    rerender({ videos: newVideos });

    expect(result.current.trailers).toHaveLength(1);
    expect(result.current.trailers[0].id).toBe('5');
  });

  test('maintains index when videos change if index is still valid', () => {
    const { result, rerender } = renderHook(
      ({ videos }) => useTrailerCarousel(videos),
      {
        initialProps: { videos: mockVideos },
      }
    );

    act(() => {
      result.current.goToIndex(1);
    });

    expect(result.current.currentIndex).toBe(1);

    const newVideos: Video[] = [
      {
        id: '5',
        key: 'new123',
        name: 'New Trailer',
        site: 'YouTube',
        type: 'Trailer',
        official: true,
      },
      {
        id: '6',
        key: 'new456',
        name: 'New Teaser',
        site: 'YouTube',
        type: 'Teaser',
        official: true,
      },
    ];

    rerender({ videos: newVideos });

    expect(result.current.currentIndex).toBe(1);
  });

  test('handles rapid navigation', () => {
    const { result } = renderHook(() => useTrailerCarousel(mockVideos));

    act(() => {
      result.current.handleNext();
    });
    expect(result.current.currentIndex).toBe(1);

    act(() => {
      result.current.handleNext();
    });
    expect(result.current.currentIndex).toBe(0);

    act(() => {
      result.current.handlePrev();
    });
    expect(result.current.currentIndex).toBe(1);

    act(() => {
      result.current.handleNext();
    });
    expect(result.current.currentIndex).toBe(0);
  });

  test('goToIndex with same index does not change state', () => {
    const { result } = renderHook(() => useTrailerCarousel(mockVideos));

    act(() => {
      result.current.goToIndex(0);
    });

    const currentTrailer = result.current.currentTrailer;

    act(() => {
      result.current.goToIndex(0);
    });

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.currentTrailer).toEqual(currentTrailer);
  });
});

