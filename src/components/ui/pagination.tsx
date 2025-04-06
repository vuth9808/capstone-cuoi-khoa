'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = [];
  const maxPagesToShow = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  
  if (endPage - startPage + 1 < maxPagesToShow && startPage > 1) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center space-x-2 my-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md border border-border dark:border-[#383838] text-text-secondary dark:text-[#B0B0B0] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-bg-secondary dark:hover:bg-[#2A2A2A]"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      
      {startPage > 1 && (
        <>
          <button 
            onClick={() => onPageChange(1)}
            className={`h-10 w-10 rounded-md flex items-center justify-center text-text-secondary dark:text-[#B0B0B0] hover:bg-bg-secondary dark:hover:bg-[#2A2A2A]`}
          >
            1
          </button>
          {startPage > 2 && (
            <span className="text-text-secondary dark:text-[#B0B0B0]">...</span>
          )}
        </>
      )}
      
      {pages.map(page => (
        <button 
          key={page} 
          onClick={() => onPageChange(page)}
          className={`h-10 w-10 rounded-md flex items-center justify-center ${
            currentPage === page 
              ? 'bg-primary text-white' 
              : 'text-text-secondary dark:text-[#B0B0B0] hover:bg-bg-secondary dark:hover:bg-[#2A2A2A]'
          }`}
        >
          {page}
        </button>
      ))}
      
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="text-text-secondary dark:text-[#B0B0B0]">...</span>
          )}
          <button 
            onClick={() => onPageChange(totalPages)}
            className={`h-10 w-10 rounded-md flex items-center justify-center text-text-secondary dark:text-[#B0B0B0] hover:bg-bg-secondary dark:hover:bg-[#2A2A2A]`}
          >
            {totalPages}
          </button>
        </>
      )}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md border border-border dark:border-[#383838] text-text-secondary dark:text-[#B0B0B0] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-bg-secondary dark:hover:bg-[#2A2A2A]"
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
} 