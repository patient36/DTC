import { FiImage, FiVideo, FiMusic, FiFileText } from 'react-icons/fi';
import { Capsule, ColumnVisibility, SortConfig, SortableKey } from '@/types/customTypes/delivered';

interface CapsuleTableProps {
  capsules: Capsule[];
  columnVisibility: ColumnVisibility;
  sortConfig: SortConfig | null;
  onSort: (key: SortableKey) => void;
  onRowClick: (id: string) => void;
}

const AttachmentIcon = ({ type }: { type: string }) => {
  if (type.startsWith('image/')) return <FiImage className="w-3 h-3 mr-1 text-blue-400" />;
  if (type.startsWith('video/')) return <FiVideo className="w-3 h-3 mr-1 text-purple-400" />;
  if (type.startsWith('audio/')) return <FiMusic className="w-3 h-3 mr-1 text-green-400" />;
  if (type === 'application/pdf') return <FiFileText className="w-3 h-3 mr-1 text-red-400" />;
  return <FiFileText className="w-3 h-3 mr-1 text-gray-400" />;
};

const formatSize = (size: number) => (size < 1 ? `${(size * 1024).toFixed(0)}MB` : `${size.toFixed(1)}GB`);

export const CapsuleTable = ({
  capsules,
  columnVisibility,
  sortConfig,
  onSort,
  onRowClick,
}: CapsuleTableProps) => (
  <div className="overflow-hidden rounded-xl border border-gray-700/50 bg-gray-800/25 backdrop-blur-sm shadow-2xl shadow-blue-900/10">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-800/70">
          <tr>
            {Object.entries(columnVisibility).map(([column, isVisible]) => (
              isVisible && (
                <th
                  key={column}
                  className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700/50 transition"
                  onClick={() => onSort(column as SortableKey)}
                >
                  <div className="flex items-center">
                    {column.charAt(0).toUpperCase() + column.slice(1)}
                    {sortConfig?.key === column && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              )
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700/50">
          {capsules.map((capsule) => (
            <tr
              key={capsule.id}
              onClick={() => onRowClick(capsule.id)}
              className="bg-gray-800/30 hover:bg-gray-700/50 cursor-pointer transition-all duration-150"
            >
              {columnVisibility.id && (
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-cyan-400/90">
                  {capsule.id}
                </td>
              )}
              {columnVisibility.title && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">{capsule.title}</div>
                  <div className="text-xs text-gray-400 mt-1 line-clamp-1">{capsule.message}</div>
                </td>
              )}
              {columnVisibility.deliveryDate && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="text-sm text-white">
                    {new Date(capsule.deliveryDate).toLocaleDateString()}
                  </p>
                  <div className="text-xs text-gray-400">
                    {new Date(capsule.deliveryDate).toLocaleTimeString()}
                  </div>
                </td>
              )}
              {columnVisibility.readCount && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-white mr-2">
                      {capsule.readCount}
                    </span>
                    <div className="h-1.5 bg-gray-700 rounded-full flex-1 max-w-[60px]">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: `${Math.min(100, (capsule.readCount / 50) * 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </td>
              )}
              {columnVisibility.attachments && (
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {capsule.attachments.map((file, i) => (
                      <div
                        key={i}
                        className="px-2 py-1 bg-gray-700/50 rounded text-xs flex items-center"
                      >
                        <AttachmentIcon type={file.type} />
                        <span className="truncate max-w-[80px]">{file.path}</span>
                        <span className="text-gray-400 ml-1">{file.size}MB</span>
                      </div>
                    ))}
                  </div>
                </td>
              )}
              {columnVisibility.attachmentsSize && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {formatSize(capsule.attachmentsSize)}
                </td>
              )}
              {columnVisibility.createdAt && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {new Date(capsule.createdAt).toLocaleDateString()}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);