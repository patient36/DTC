import { useState } from 'react'
import { User } from '@/types/user'
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiEye, FiEyeOff, FiSettings } from 'react-icons/fi';
import { formatDate, formatTime } from '@/utils/formatDates';

interface UsersTableProps {
    users: User[];
    tableTitle: string;
    page: number;
    rowsPerPage: number;
    total: number;
    onPageChange: (newPage: number) => void;
    onRowsPerPageChange: (newRowsPerPage: number) => void;
    onRowClick: (id: string) => void;
}

type ColumnKey = keyof User

const UsersTable = ({ users, page, rowsPerPage, total, tableTitle, onPageChange, onRowsPerPageChange, onRowClick }: UsersTableProps) => {
    const totalPages = Math.ceil(total / rowsPerPage);
    const startItem = Math.max(1, (1 + (rowsPerPage * (page - 1))))
    const endItem = Math.min(page * rowsPerPage, total);

    const [showColumnMenu, setShowColumnMenu] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState<Record<ColumnKey, boolean>>({
        id: true,
        name: true,
        email: true,
        role: true,
        usedStorage: true,
        customerId: true,
        subscriptionId: true,
        paidUntil: true,
        createdAt: true,
    });

    const toggleColumn = (column: ColumnKey) => {
        setVisibleColumns(prev => ({
            ...prev,
            [column]: !prev[column]
        }));
    };

    const columns: { key: ColumnKey; label: string; width: string }[] = [
        { key: 'id', label: 'User Id', width: 'w-48' },
        { key: 'name', label: 'Name', width: 'w-48' },
        { key: 'email', label: 'Email', width: 'w-48' },
        { key: 'role', label: 'Role', width: 'w-48' },
        { key: 'usedStorage', label: 'Used Storage', width: 'w-48' },
        { key: 'paidUntil', label: 'Paid Until', width: 'w-48' },
        { key: 'createdAt', label: 'Created At', width: 'w-48' },
    ]

    const defaultOptions = [5, 10, 25, 50, 100]
    const options = [...new Set([
        ...defaultOptions.filter(v => v <= total),
        ...(total < Math.min(...defaultOptions) ? [total] : [])
    ])].sort((a, b) => a - b);


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-900/80 backdrop-blur-lg p-6 rounded-xl border border-gray-800 shadow-2xl"
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 relative">
                <div>
                    <h2 className="text-xl font-bold text-cyan-400">{tableTitle}</h2>
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
                        {users.map((user) => (
                            <tr
                                onClick={() => onRowClick(user.id)}
                                key={user.id}
                                className="hover:bg-gray-800/30 transition-colors cursor-pointer">
                                {visibleColumns.id && (
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-gray-100 mb-1">{user.id}</div>
                                    </td>
                                )}
                                {visibleColumns.name && (
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className="text-sm text-gray-200 capitalize">
                                                {user.name}
                                            </span>
                                        </div>
                                    </td>
                                )}
                                {visibleColumns.email && (
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-100">
                                            <span className="text-xs text-gray-400 mr-2">{user.email}</span>
                                        </div>
                                    </td>
                                )}
                                {visibleColumns.role && (
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-gray-300">{user.role}</div>
                                    </td>
                                )}
                                {visibleColumns.usedStorage && (
                                    <td className="px-4 py-4">
                                        <div className="text-sm text-gray-300 max-w-xs truncate">
                                            {user.usedStorage}
                                        </div>
                                    </td>
                                )}
                                {visibleColumns.paidUntil && (
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold mb-1 text-gray-300">{formatDate(user.paidUntil)}</div>
                                        <div className="text-xs text-gray-300">{formatTime(user.paidUntil)}</div>
                                    </td>
                                )}
                                {visibleColumns.createdAt && (
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold mb-1 text-gray-300">{formatDate(user.createdAt)}</div>
                                        <div className="text-xs text-gray-300">{formatTime(user.createdAt)}</div>
                                    </td>
                                )
                                }
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 px-2 text-sm text-gray-400">
                <div className="mb-2 sm:mb-0">
                    {startItem} to {endItem} of {total} users
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

export default UsersTable
