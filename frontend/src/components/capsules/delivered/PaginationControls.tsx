import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  totalItems: number;
  visibleStart: number;
  visibleEnd: number;
}

export const PaginationControls = ({
  page,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  totalItems,
  visibleStart,
  visibleEnd,
}: PaginationControlsProps) => (
  <div className="mt-6 flex items-center justify-between">
    <div className="flex items-center space-x-4">
      <div className="text-sm text-gray-400">
        Showing <span className="font-medium text-white">{visibleStart}</span> to{' '}
        <span className="font-medium text-white">{visibleEnd}</span> of{' '}
        <span className="font-medium text-white">{totalItems}</span> results
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-400">Rows per page:</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="bg-gray-800 border border-gray-700 rounded-md px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size} className="bg-gray-800">
              {size}
            </option>
          ))}
        </select>
      </div>
    </div>
    <div className="flex space-x-2">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={`px-4 py-2 rounded-lg flex items-center ${
          page === 1
            ? 'bg-gray-800/30 text-gray-500 cursor-not-allowed'
            : 'bg-gray-800 hover:bg-gray-700 text-white'
        } transition-all`}
      >
        <FiChevronLeft className="w-4 h-4 mr-2" />
        Previous
      </button>
      <div className="flex space-x-1">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (page <= 3) {
            pageNum = i + 1;
          } else if (page >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = page - 2 + i;
          }

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                page === pageNum
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-800 hover:bg-gray-700 text-white'
              } transition-all`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className={`px-4 py-2 rounded-lg flex items-center ${
          page === totalPages
            ? 'bg-gray-800/30 text-gray-500 cursor-not-allowed'
            : 'bg-gray-800 hover:bg-gray-700 text-white'
        } transition-all`}
      >
        Next
        <FiChevronRight className="w-4 h-4 ml-2" />
      </button>
    </div>
  </div>
);