import { useState, useEffect, useRef, useCallback } from "react";

type InfiniteScrollProps<T> = {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemsPerPage?: number;
  loader?: React.ReactNode;
  endMessage?: React.ReactNode;
  className?: string;
  isTable?: boolean;
};

export function InfiniteScroll<T>({
  data,
  renderItem,
  itemsPerPage = 10,
  loader = <p>Loading...</p>,
  endMessage = <p>No more items to load</p>,
  className = "",
  isTable = false,
}: InfiniteScrollProps<T>) {
  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null); // observe the user scrolls to bottom.

  // Initialize visible items
  useEffect(() => {
    if (data.length > 0) {
      const initialItems = data.slice(0, itemsPerPage);
      setVisibleItems(initialItems);
      setHasMore(data.length > initialItems.length);
    } else {
      setVisibleItems([]);
      setHasMore(false);
    }
    setPage(1);
  }, [data, itemsPerPage]);

  // Load more items when reaching the end
  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    const nextItems = data.slice(0, nextPage * itemsPerPage);

    setVisibleItems(nextItems);
    setPage(nextPage);
    setHasMore(nextItems.length < data.length);
  }, [page, data, itemsPerPage]);

  // Set up intersection observer
  useEffect(() => {
    if (!hasMore) return;

    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    }, options);

    if (loaderRef.current) {
      observer.current.observe(loaderRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loadMore, hasMore]);

  if (isTable) {
    return (
      <>
        {visibleItems.map((item, index) => renderItem(item, index))}
        <tr ref={loaderRef as React.RefObject<HTMLTableRowElement>}>
          <td>
            {hasMore ? loader : endMessage}
          </td>
        </tr>
      </>
    );
  }

  return (
    <>
      {visibleItems.map((item, index) => renderItem(item, index))}
      <div ref={loaderRef as React.RefObject<HTMLDivElement>}>
        {hasMore ? loader : endMessage}
      </div>
    </>
  );
}
