"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  paginated?: boolean;
  itemsPerPage?: number;
  serverPagination?: boolean;
  totalItems?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export function DataTable<T>({
  columns,
  data,
  paginated = false,
  itemsPerPage = 10,
  serverPagination = false,
  totalItems = 0,
  currentPage: externalCurrentPage = 1,
  onPageChange,
}: DataTableProps<T>) {
  const [internalPage, setInternalPage] = useState(1);

  // Sync internal page with external page if server pagination is used
  useEffect(() => {
    if (serverPagination) {
      setInternalPage(externalCurrentPage);
    }
  }, [serverPagination, externalCurrentPage]);

  const currentPage = serverPagination ? externalCurrentPage : internalPage;

  const totalPages = serverPagination 
    ? Math.ceil(totalItems / itemsPerPage)
    : Math.ceil(data.length / itemsPerPage);
  
  const currentData = (paginated && !serverPagination)
    ? data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : data;

  const handlePrev = () => {
    if (currentPage > 1) {
      if (serverPagination && onPageChange) {
        onPageChange(currentPage - 1);
      } else {
        setInternalPage(currentPage - 1);
      }
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      if (serverPagination && onPageChange) {
        onPageChange(currentPage + 1);
      } else {
        setInternalPage(currentPage + 1);
      }
    }
  };

  const getShowingStart = () => {
    if (data.length === 0) return 0;
    return (currentPage - 1) * itemsPerPage + 1;
  };

  const getShowingEnd = () => {
    if (serverPagination) {
      return Math.min(currentPage * itemsPerPage, totalItems);
    }
    return Math.min(currentPage * itemsPerPage, data.length);
  };

  const getTotalCount = () => {
    return serverPagination ? totalItems : data.length;
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-900 dark:bg-black border-b border-gray-800">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="px-6 py-4 text-sm font-semibold text-white tracking-wide whitespace-nowrap"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {currentData.length > 0 ? (
              currentData.map((item, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors group"
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300"
                    >
                      {col.render ? col.render(item) : (item as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 text-sm"
                >
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {paginated && totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/20">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Showing {getShowingStart()} to {getShowingEnd()} of {getTotalCount()} entries
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
