import { motion } from 'framer-motion';
import { JSX, useState } from 'react';
import { Payment } from '@/types/payment';
import { formatDate, formatTime } from '@/utils/formatDates';
import {
  FiChevronLeft,
  FiChevronRight,
  FiCreditCard,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiDollarSign,
  FiSettings,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';

interface PaymentsTableProps {
  payments: Payment[];
  page: number;
  rowsPerPage: number;
  total: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
}

type ColumnKey = keyof Payment | 'combinedId';

export const PaymentsTable = ({
  payments,
  page,
  rowsPerPage,
  total,
  onPageChange,
  onRowsPerPageChange
}: PaymentsTableProps) => {
  const totalPages = Math.ceil(total / rowsPerPage);
  const startItem = page === 0 ? page * rowsPerPage + 1 : page * rowsPerPage;
  const endItem = Math.min((page + 1) * rowsPerPage, total);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Record<ColumnKey, boolean>>({
    id: true,
    payerId: false,
    method: false,
    amount: true,
    currency: true,
    paymentId: false,
    description: true,
    status: true,
    createdAt: true,
    updatedAt: false,
    combinedId: false
  });

  const toggleColumn = (column: ColumnKey) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  // Payment method icon component
  const PaymentMethodIcon = ({ method }: { method: string }) => {
    const icons: Record<string, JSX.Element> = {
      CARD: <FiCreditCard className="inline mr-1 text-purple-400" />,
    };

    return icons[method] || <FiDollarSign className="inline mr-1 text-blue-400" />;
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium";

    const statusConfig = {
      PENDING: {
        class: "bg-yellow-900/30 text-yellow-300",
        icon: <FiClock className="mr-1.5" />
      },
      COMPLETED: {
        class: "bg-green-900/30 text-green-300",
        icon: <FiCheckCircle className="mr-1.5" />
      },
      FAILED: {
        class: "bg-red-900/30 text-red-300",
        icon: <FiXCircle className="mr-1.5" />
      }
    }[status] || {
      class: "bg-gray-700 text-gray-300",
      icon: null
    };

    return (
      <span className={`${baseClasses} ${statusConfig.class}`}>
        {statusConfig.icon}
        {status}
      </span>
    );
  };

  const columns: { key: ColumnKey; label: string; width?: string }[] = [
    { key: 'combinedId', label: 'Transaction', width: 'w-48' },
    { key: 'method', label: 'Method', width: 'w-32' },
    { key: 'amount', label: 'Amount', width: 'w-32' },
    { key: 'status', label: 'Status', width: 'w-36' },
    { key: 'description', label: 'Description', width: 'w-64' },
    { key: 'createdAt', label: 'Created', width: 'w-40' },
    { key: 'updatedAt', label: 'Updated', width: 'w-40' },
    { key: 'payerId', label: 'Payer ID', width: 'w-48' },
  ];

  const defaultOptions = [5, 10, 25, 50, 100, 200];
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
          <h2 className="text-xl font-bold text-cyan-400">Payment Transactions</h2>
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
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-800/30 transition-colors">
                {visibleColumns.combinedId && (
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono font-medium text-gray-100">{payment.id}</div>
                    <div className="text-xs font-mono text-gray-400">{payment.paymentId}</div>
                  </td>
                )}
                {visibleColumns.method && (
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <PaymentMethodIcon method={payment.method} />
                      <span className="text-sm text-gray-200 capitalize">
                        {payment.method.toLowerCase()}
                      </span>
                    </div>
                  </td>
                )}
                {visibleColumns.amount && (
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-100">
                      <span className="text-xs text-gray-400 mr-2">{payment.currency}</span>
                      {payment.amount.toFixed(2)}
                    </div>
                  </td>
                )}
                {visibleColumns.status && (
                  <td className="px-4 py-4 whitespace-nowrap">
                    <StatusBadge status={payment.status} />
                  </td>
                )}
                {visibleColumns.description && (
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-300 max-w-xs truncate">
                      {payment.description}
                    </div>
                  </td>
                )}
                {visibleColumns.createdAt && (
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold mb-1 text-gray-300">{formatDate(payment.createdAt)}</div>
                    <div className="text-xs text-gray-300">{formatTime(payment.createdAt)}</div>
                  </td>
                )}
                {visibleColumns.updatedAt && (
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold mb-1 text-gray-300">{formatDate(payment.updatedAt)}</div>
                    <div className="text-xs text-gray-300">{formatTime(payment.updatedAt)}</div>
                  </td>
                )}

                {visibleColumns.payerId && (
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-400">{payment.payerId}</div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 px-2 text-sm text-gray-400">
        <div className="mb-2 sm:mb-0">
          Showing {startItem} to {endItem} of {total} entries
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 0}
            className="inline-flex items-center px-3 py-1.5 rounded-md bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <FiChevronLeft className="mr-1" /> Previous
          </button>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages - 1}
            className="inline-flex items-center px-3 py-1.5 rounded-md bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Next <FiChevronRight className="ml-1" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};