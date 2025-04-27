import { Capsule } from "@/types/capsule";
import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiEye, FiEyeOff, FiFileText, FiImage, FiMusic, FiSettings, FiVideo } from "react-icons/fi";
import { motion } from 'framer-motion';
import { formatDate, formatTime } from "@/utils/formatDates";
import { formatSize } from "@/utils/formatSize";

interface CapsulesTableProps {
  capsules: Capsule[];
  page: number;
  rowsPerPage: number;
  total: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
  onRowClick: (id: string) => void
}

type ColumnKey = keyof Capsule

const CapsulesTable = ({ capsules, page, rowsPerPage, total, onPageChange, onRowsPerPageChange, onRowClick }: CapsulesTableProps) => {

  const totalPages = Math.ceil(total / rowsPerPage);
  const startItem = Math.max(1, (1 + (rowsPerPage * (page - 1))))
  const endItem = Math.min(page * rowsPerPage, total);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Record<ColumnKey, boolean>>({
    id: false,
    ownerId: false,
    title: true,
    message: false,
    attachments: true,
    attachmentsSize: false,
    delivered: false,
    deliveryDate: true,
    readCount: true,
    createdAt: true
  });

  const toggleColumn = (column: ColumnKey) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const AttachmentIcon = ({ type }: { type: string }) => {
    if (type.startsWith('image/')) return <FiImage className="w-3 h-3 mr-1 text-blue-400" />;
    if (type.startsWith('video/')) return <FiVideo className="w-3 h-3 mr-1 text-purple-400" />;
    if (type.startsWith('audio/')) return <FiMusic className="w-3 h-3 mr-1 text-green-400" />;
    return <FiFileText className="w-3 h-3 mr-1 text-gray-400" />;
  };

  const columns: { key: ColumnKey; label: string; width?: string }[] = [
    { key: 'id', label: 'ID', width: 'w-48' },
    { key: 'title', label: 'Title', width: 'w-32' },
    { key: 'message', label: 'Message', width: 'w-36' },
    { key: 'attachments', label: 'Memories', width: 'w-64' },
    { key: 'attachmentsSize', label: 'Memories size', width: 'w-40' },
    { key: 'readCount', label: 'ReadCount', width: 'w-48' },
    { key: 'createdAt', label: 'CreatedAt', width: 'w-48' },
    { key: 'deliveryDate', label: 'Delivered', width: 'w-40' },
  ];
  const defaultOptions = [5, 10, 25, 50, 100];
  const options = [rowsPerPage, ...defaultOptions]
    .filter((v, i, self) => v <= total && self.indexOf(v) === i)
    .sort((a, b) => a - b);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-900/80 backdrop-blur-lg p-6 rounded-xl border border-gray-800 shadow-2xl"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 relative">
        <div>
          <h2 className="text-xl font-bold text-cyan-400">DTC Network</h2>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Rows:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
              className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-md px-2 py-1 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              {options.map((size) => (
                <option key={size} value={size} className="bg-gray-800">
                  {size}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowColumnMenu(!showColumnMenu)}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-cyan-400 transition-colors relative"
          >
            <FiSettings className="w-5 h-5" />
          </button>

          {showColumnMenu && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 top-12 z-10 mt-2 w-56 origin-top-right rounded-lg bg-gray-800 border border-gray-700 shadow-lg py-2"
            >
              <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Visible Columns
              </div>
              {columns.map((column) => (
                <button
                  key={column.key}
                  onClick={() => toggleColumn(column.key)}
                  className="flex items-center w-full px-3 py-2 text-sm text-left text-gray-300 hover:bg-gray-700/50"
                >
                  {visibleColumns[column.key] ? (
                    <FiEye className="mr-2 text-cyan-400" />
                  ) : (
                    <FiEyeOff className="mr-2 text-gray-500" />
                  )}
                  {column.label}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-800/80">
            <tr>
              {columns.map((column) => (
                visibleColumns[column.key] && (
                  <th
                    key={column.key}
                    scope="col"
                    className={`px-4 py-3 text-left text-xs font-semibold text-cyan-400 uppercase tracking-wider ${column.width}`}
                  >
                    {column.label}
                  </th>
                )
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-900/50 divide-y divide-gray-800">
            {capsules.map((capsule) => (
              <tr
                onClick={() => onRowClick(capsule.id)}
                key={capsule.id}
                className="hover:bg-gray-800/30 transition-colors cursor-pointer">
                {visibleColumns.id && (
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-100 mb-1">{capsule.id}</div>
                  </td>
                )}
                {visibleColumns.title && (
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-100">
                      {capsule.title}
                    </div>
                  </td>
                )}
                {visibleColumns.message && (
                  <td className="px-4 py-4 whitespace-nowrap">
                    {capsule.message}
                  </td>
                )}
                {visibleColumns.attachments && (
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {capsule.attachments.length > 0 ?
                        capsule.attachments.map((file, i) => (
                          <div
                            key={i}
                            className="px-2 py-1 bg-gray-700/50 rounded text-xs flex items-center"
                          >
                            <AttachmentIcon type={file.type} />
                            <span className="truncate max-w-[80px]">{file.path}</span>
                            <span className="text-gray-400 ml-1">{file.size}MB</span>
                          </div>
                        )) : '-'
                      }
                    </div>
                  </td>
                )}
                {visibleColumns.attachmentsSize && (
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-300 max-w-xs truncate">
                      {formatSize(capsule.attachmentsSize)}
                    </div>
                  </td>
                )}
                {visibleColumns.readCount && (
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-300 max-w-xs truncate">
                      {capsule.readCount}
                    </div>
                  </td>
                )}
                {visibleColumns.createdAt && (
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold mb-1 text-gray-300">{formatDate(capsule.createdAt)}</div>
                    <div className="text-xs text-gray-300">{formatTime(capsule.createdAt)}</div>
                  </td>
                )}
                {visibleColumns.deliveryDate && (
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold mb-1 text-gray-300">{formatDate(capsule.deliveryDate)}</div>
                    <div className="text-xs text-gray-300">{formatTime(capsule.deliveryDate)}</div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 px-2 text-sm text-gray-400">
        <div className="mb-2 sm:mb-0">
          {startItem} to {endItem} of {total} capsules
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="inline-flex items-center px-3 py-1.5 rounded-md bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <FiChevronLeft className="mr-1" /> Previous
          </button>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="inline-flex items-center px-3 py-1.5 rounded-md bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Next <FiChevronRight className="ml-1" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default CapsulesTable;