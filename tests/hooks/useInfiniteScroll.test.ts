import { renderHook } from '@testing-library/react';
import { useInfiniteScroll } from '../../src/hooks/useInfiniteScroll';

describe('useInfiniteScroll', () => {
  let mockIntersectionObserver: jest.Mock;
  let observeSpy: jest.Mock;
  let disconnectSpy: jest.Mock;

  beforeEach(() => {
    observeSpy = jest.fn();
    disconnectSpy = jest.fn();

    mockIntersectionObserver = jest.fn((callback) => ({
      observe: observeSpy,
      disconnect: disconnectSpy,
      root: null,
      rootMargin: '',
      thresholds: [],
      takeRecords: jest.fn(),
    }));

    global.IntersectionObserver = mockIntersectionObserver as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns loadMoreRef', () => {
    const { result } = renderHook(() =>
      useInfiniteScroll({
        isLoading: false,
        hasMore: true,
        onLoadMore: jest.fn(),
      })
    );

    expect(result.current.loadMoreRef).toBeDefined();
    expect(result.current.loadMoreRef.current).toBeNull();
  });

  test('creates IntersectionObserver when not loading and has more', () => {
    const onLoadMore = jest.fn();

    renderHook(() =>
      useInfiniteScroll({
        isLoading: false,
        hasMore: true,
        onLoadMore,
      })
    );

    expect(mockIntersectionObserver).toHaveBeenCalled();
  });

  test('does not create IntersectionObserver when loading', () => {
    renderHook(() =>
      useInfiniteScroll({
        isLoading: true,
        hasMore: true,
        onLoadMore: jest.fn(),
      })
    );

    expect(mockIntersectionObserver).not.toHaveBeenCalled();
  });

  test('does not create IntersectionObserver when no more items', () => {
    renderHook(() =>
      useInfiniteScroll({
        isLoading: false,
        hasMore: false,
        onLoadMore: jest.fn(),
      })
    );

    expect(mockIntersectionObserver).not.toHaveBeenCalled();
  });

  test('observes loadMoreRef element when it exists', () => {
    const mockElement = document.createElement('div');
    
    const { result, rerender } = renderHook(
      ({ isLoading, hasMore, onLoadMore }) => {
        const hookResult = useInfiniteScroll({ isLoading, hasMore, onLoadMore });
        if (hookResult.loadMoreRef.current === null) {
          hookResult.loadMoreRef.current = mockElement;
        }
        return hookResult;
      },
      {
        initialProps: {
          isLoading: false,
          hasMore: true,
          onLoadMore: jest.fn(),
        },
      }
    );

    rerender({
      isLoading: false,
      hasMore: true,
      onLoadMore: jest.fn(),
    });

    expect(observeSpy).toHaveBeenCalledWith(mockElement);
  });

  test('calls onLoadMore when element intersects', () => {
    const onLoadMore = jest.fn();
    let intersectionCallback: (entries: IntersectionObserverEntry[]) => void;

    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback;
      return {
        observe: observeSpy,
        disconnect: disconnectSpy,
        root: null,
        rootMargin: '',
        thresholds: [],
        takeRecords: jest.fn(),
      };
    });

    renderHook(() =>
      useInfiniteScroll({
        isLoading: false,
        hasMore: true,
        onLoadMore,
      })
    );

    const mockEntry: IntersectionObserverEntry = {
      isIntersecting: true,
      intersectionRatio: 1,
      boundingClientRect: {} as DOMRectReadOnly,
      rootBounds: null,
      target: document.createElement('div'),
      time: Date.now(),
    };

    intersectionCallback!([mockEntry]);

    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  test('does not call onLoadMore when not intersecting', () => {
    const onLoadMore = jest.fn();
    let intersectionCallback: (entries: IntersectionObserverEntry[]) => void;

    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback;
      return {
        observe: observeSpy,
        disconnect: disconnectSpy,
        root: null,
        rootMargin: '',
        thresholds: [],
        takeRecords: jest.fn(),
      };
    });

    renderHook(() =>
      useInfiniteScroll({
        isLoading: false,
        hasMore: true,
        onLoadMore,
      })
    );

    const mockEntry: IntersectionObserverEntry = {
      isIntersecting: false,
      intersectionRatio: 0,
      boundingClientRect: {} as DOMRectReadOnly,
      rootBounds: null,
      target: document.createElement('div'),
      time: Date.now(),
    };

    intersectionCallback!([mockEntry]);

    expect(onLoadMore).not.toHaveBeenCalled();
  });

  test('does not call onLoadMore when loading', () => {
    const onLoadMore = jest.fn();
    let intersectionCallback: (entries: IntersectionObserverEntry[]) => void;

    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback;
      return {
        observe: observeSpy,
        disconnect: disconnectSpy,
        root: null,
        rootMargin: '',
        thresholds: [],
        takeRecords: jest.fn(),
      };
    });

    renderHook(() =>
      useInfiniteScroll({
        isLoading: true,
        hasMore: true,
        onLoadMore,
      })
    );

    const mockEntry: IntersectionObserverEntry = {
      isIntersecting: true,
      intersectionRatio: 1,
      boundingClientRect: {} as DOMRectReadOnly,
      rootBounds: null,
      target: document.createElement('div'),
      time: Date.now(),
    };

    if (intersectionCallback) {
      intersectionCallback([mockEntry]);
    }

    expect(onLoadMore).not.toHaveBeenCalled();
  });

  test('does not call onLoadMore when no more items', () => {
    const onLoadMore = jest.fn();
    let intersectionCallback: (entries: IntersectionObserverEntry[]) => void;

    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback;
      return {
        observe: observeSpy,
        disconnect: disconnectSpy,
        root: null,
        rootMargin: '',
        thresholds: [],
        takeRecords: jest.fn(),
      };
    });

    renderHook(() =>
      useInfiniteScroll({
        isLoading: false,
        hasMore: false,
        onLoadMore,
      })
    );

    const mockEntry: IntersectionObserverEntry = {
      isIntersecting: true,
      intersectionRatio: 1,
      boundingClientRect: {} as DOMRectReadOnly,
      rootBounds: null,
      target: document.createElement('div'),
      time: Date.now(),
    };

    if (intersectionCallback) {
      intersectionCallback([mockEntry]);
    }

    expect(onLoadMore).not.toHaveBeenCalled();
  });

  test('uses custom threshold', () => {
    renderHook(() =>
      useInfiniteScroll({
        isLoading: false,
        hasMore: true,
        onLoadMore: jest.fn(),
        threshold: 0.5,
      })
    );

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold: 0.5 }
    );
  });

  test('uses default threshold of 0.1', () => {
    renderHook(() =>
      useInfiniteScroll({
        isLoading: false,
        hasMore: true,
        onLoadMore: jest.fn(),
      })
    );

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold: 0.1 }
    );
  });

  test('disconnects observer on cleanup', () => {
    const { unmount } = renderHook(() =>
      useInfiniteScroll({
        isLoading: false,
        hasMore: true,
        onLoadMore: jest.fn(),
      })
    );

    unmount();

    expect(disconnectSpy).toHaveBeenCalled();
  });

  test('disconnects previous observer when dependencies change', () => {
    const { rerender } = renderHook(
      ({ isLoading, hasMore, onLoadMore }) =>
        useInfiniteScroll({ isLoading, hasMore, onLoadMore }),
      {
        initialProps: {
          isLoading: false,
          hasMore: true,
          onLoadMore: jest.fn(),
        },
      }
    );

    rerender({
      isLoading: false,
      hasMore: true,
      onLoadMore: jest.fn(),
    });

    expect(disconnectSpy).toHaveBeenCalled();
  });
});

