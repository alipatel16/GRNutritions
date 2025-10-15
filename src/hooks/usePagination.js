// ==================== usePagination.js ====================
import { useState, useMemo } from 'react';

export const usePagination = (items, itemsPerPage = 12) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Get current page items
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  // Go to specific page
  const goToPage = (page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  // Go to next page
  const nextPage = () => {
    goToPage(currentPage + 1);
  };

  // Go to previous page
  const previousPage = () => {
    goToPage(currentPage - 1);
  };

  // Reset to first page
  const reset = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages,
    currentItems,
    goToPage,
    nextPage,
    previousPage,
    reset,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    startIndex: (currentPage - 1) * itemsPerPage + 1,
    endIndex: Math.min(currentPage * itemsPerPage, items.length),
    totalItems: items.length
  };
};