/**
 * usePagination Hook
 * Reusable pagination state management
 */

import { useState, useMemo } from 'react';

export interface UsePaginationOptions {
  totalItems: number;
  itemsPerPage?: number;
  initialPage?: number;
}

export interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  startIndex: number;
  endIndex: number;
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  pageNumbers: number[];
}

export function usePagination({
  totalItems,
  itemsPerPage = 10,
  initialPage = 1,
}: UsePaginationOptions): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / itemsPerPage);
  }, [totalItems, itemsPerPage]);

  const startIndex = useMemo(() => {
    return (currentPage - 1) * itemsPerPage;
  }, [currentPage, itemsPerPage]);

  const endIndex = useMemo(() => {
    return Math.min(startIndex + itemsPerPage - 1, totalItems - 1);
  }, [startIndex, itemsPerPage, totalItems]);

  const canGoNext = currentPage < totalPages;
  const canGoPrevious = currentPage > 1;

  const nextPage = () => {
    if (canGoNext) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const previousPage = () => {
    if (canGoPrevious) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  // Generate page numbers for pagination UI
  const pageNumbers = useMemo(() => {
    const delta = 2; // Number of pages to show on each side of current page
    const range: number[] = [];
    const rangeWithDots: number[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, -1); // -1 represents "..."
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push(-2, totalPages); // -2 represents "..."
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  }, [currentPage, totalPages]);

  return {
    currentPage,
    totalPages,
    itemsPerPage,
    startIndex,
    endIndex,
    nextPage,
    previousPage,
    goToPage,
    canGoNext,
    canGoPrevious,
    pageNumbers,
  };
}

/**
 * Example Usage:
 *
 * function ItemList({ items }: { items: Item[] }) {
 *   const {
 *     currentPage,
 *     totalPages,
 *     startIndex,
 *     endIndex,
 *     nextPage,
 *     previousPage,
 *     goToPage,
 *     pageNumbers,
 *   } = usePagination({
 *     totalItems: items.length,
 *     itemsPerPage: 10,
 *   });
 *
 *   const currentItems = items.slice(startIndex, endIndex + 1);
 *
 *   return (
 *     <div>
 *       {currentItems.map(item => <ItemCard key={item.id} item={item} />)}
 *
 *       <div className="pagination">
 *         <button onClick={previousPage}>Previous</button>
 *         {pageNumbers.map((page, i) =>
 *           page < 0 ? (
 *             <span key={i}>...</span>
 *           ) : (
 *             <button key={page} onClick={() => goToPage(page)}>
 *               {page}
 *             </button>
 *           )
 *         )}
 *         <button onClick={nextPage}>Next</button>
 *       </div>
 *     </div>
 *   );
 * }
 */
