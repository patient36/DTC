'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { mockCapsules } from './capsules'
import {
    FiSearch,
    FiChevronLeft,
    FiChevronRight,
    FiCheck,
    FiImage,
    FiVideo,
    FiMusic,
    FiFileText
} from 'react-icons/fi'

const DeliveredCapsules = () => {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState('')
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [showColumns, setShowColumns] = useState({
        id: false,
        title: true,
        deliveryDate: true,
        readCount: true,
        attachments: true,
        attachmentsSize: true,
        createdAt: false,
    })
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
        setPage(1) // Reset to first page on new search
    }

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleColumnToggle = (column: string) => {
        // @ts-ignore
        setShowColumns((prev) => ({ ...prev, [column]: !prev[column] }))
    }

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc'
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({ key, direction })
    }

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(e.target.value))
        setPage(1) // Reset to first page when changing page size
    }

    // Filter and sort data
    let filteredData = mockCapsules.filter((capsule) =>
        capsule.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (sortConfig !== null) {
        filteredData = [...filteredData].sort((a, b) => {
            // @ts-ignore
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1
            }
            // @ts-ignore
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1
            }
            return 0
        })
    }

    // Calculate pagination data
    const totalPages = Math.ceil(filteredData.length / pageSize)
    const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize)

    // Format file size
    const formatSize = (size: number) => {
        return size < 1 ? `${(size * 1024).toFixed(0)}MB` : `${size.toFixed(1)}GB`
    }

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                            Delivered Capsules
                        </h1>
                        <p className="text-gray-400 mt-1">View all successfully delivered time capsules</p>
                    </div>
                    <div className="relative w-64">
                        <input
                            type="text"
                            placeholder="Search capsules..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <FiSearch className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    </div>
                </div>

                {/* Column Toggle */}
                <div className="mb-6 p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                    <h3 className="text-sm font-semibold text-gray-300 mb-3">DISPLAY COLUMNS</h3>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(showColumns).map(([col, isVisible]) => (
                            <button
                                key={col}
                                onClick={() => handleColumnToggle(col)}
                                className={`px-3 py-1.5 text-xs rounded-full flex items-center transition-all ${isVisible
                                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                                    : 'bg-gray-700/50 text-gray-400 border border-gray-600/30'
                                    } hover:bg-cyan-500/20 hover:text-cyan-300`}
                            >
                                {isVisible && <FiCheck className="w-3 h-3 mr-1" />}
                                {col.charAt(0).toUpperCase() + col.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-gray-700/50 bg-gray-800/25 backdrop-blur-sm shadow-2xl shadow-blue-900/10">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-800/70">
                                <tr>
                                    {showColumns.id && (
                                        <th
                                            className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700/50 transition"
                                            onClick={() => handleSort('id')}
                                        >
                                            <div className="flex items-center">
                                                ID
                                                {sortConfig?.key === 'id' && (
                                                    <span className="ml-1">
                                                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                    )}
                                    {showColumns.title && (
                                        <th
                                            className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700/50 transition"
                                            onClick={() => handleSort('title')}
                                        >
                                            <div className="flex items-center">
                                                Title
                                                {sortConfig?.key === 'title' && (
                                                    <span className="ml-1">
                                                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                    )}
                                    {showColumns.deliveryDate && (
                                        <th
                                            className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700/50 transition"
                                            onClick={() => handleSort('deliveryDate')}
                                        >
                                            <div className="flex items-center">
                                                Delivery Date
                                                {sortConfig?.key === 'deliveryDate' && (
                                                    <span className="ml-1">
                                                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                    )}
                                    {showColumns.readCount && (
                                        <th
                                            className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700/50 transition"
                                            onClick={() => handleSort('readCount')}
                                        >
                                            <div className="flex items-center">
                                                Reads
                                                {sortConfig?.key === 'readCount' && (
                                                    <span className="ml-1">
                                                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                    )}
                                    {showColumns.attachments && (
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Attachments
                                        </th>
                                    )}
                                    {showColumns.attachmentsSize && (
                                        <th
                                            className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700/50 transition"
                                            onClick={() => handleSort('attachmentsSize')}
                                        >
                                            <div className="flex items-center">
                                                Size
                                                {sortConfig?.key === 'attachmentsSize' && (
                                                    <span className="ml-1">
                                                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                    )}
                                    {showColumns.createdAt && (
                                        <th
                                            className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700/50 transition"
                                            onClick={() => handleSort('createdAt')}
                                        >
                                            <div className="flex items-center">
                                                Created
                                                {sortConfig?.key === 'createdAt' && (
                                                    <span className="ml-1">
                                                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/50">
                                {paginatedData.map((capsule) => (
                                    <tr
                                        key={capsule.id}
                                        onClick={() => router.push(`/capsules/delivered/${capsule.id}`)}
                                        className="bg-gray-800/30 hover:bg-gray-700/50 cursor-pointer transition-all duration-150"
                                    >
                                        {showColumns.id && (
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-cyan-400/90">
                                                {capsule.id}
                                            </td>
                                        )}
                                        {showColumns.title && (
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-white">{capsule.title}</div>
                                                <div className="text-xs text-gray-400 mt-1 line-clamp-1">{capsule.message}</div>
                                            </td>
                                        )}
                                        {showColumns.deliveryDate && (
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-white">
                                                    {new Date(capsule.deliveryDate).toLocaleDateString()}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {new Date(capsule.deliveryDate).toLocaleTimeString()}
                                                </div>
                                            </td>
                                        )}
                                        {showColumns.readCount && (
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
                                        {showColumns.attachments && (
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {capsule.attachments.map((file, i) => (
                                                        <div
                                                            key={i}
                                                            className="px-2 py-1 bg-gray-700/50 rounded text-xs flex items-center"
                                                        >
                                                            {file.type.startsWith('image/') && (
                                                                <FiImage className="w-3 h-3 mr-1 text-blue-400" />
                                                            )}
                                                            {file.type.startsWith('video/') && (
                                                                <FiVideo className="w-3 h-3 mr-1 text-purple-400" />
                                                            )}
                                                            {file.type.startsWith('audio/') && (
                                                                <FiMusic className="w-3 h-3 mr-1 text-green-400" />
                                                            )}
                                                            {file.type === 'application/pdf' && (
                                                                <FiFileText className="w-3 h-3 mr-1 text-red-400" />
                                                            )}
                                                            <span className="truncate max-w-[80px]">{file.path}</span>
                                                            <span className="text-gray-400 ml-1">{file.size}MB</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                        )}
                                        {showColumns.attachmentsSize && (
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                                {formatSize(capsule.attachmentsSize)}
                                            </td>
                                        )}
                                        {showColumns.createdAt && (
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

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-400">
                            Showing <span className="font-medium text-white">{(page - 1) * pageSize + 1}</span> to{' '}
                            <span className="font-medium text-white">
                                {Math.min(page * pageSize, filteredData.length)}
                            </span>{' '}
                            of <span className="font-medium text-white">{filteredData.length}</span> results
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-400">Rows per page:</span>
                            <select
                                value={pageSize}
                                onChange={handlePageSizeChange}
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
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className={`px-4 py-2 rounded-lg flex items-center ${page === 1
                                ? 'bg-gray-800/30 text-gray-500 cursor-not-allowed'
                                : 'bg-gray-800 hover:bg-gray-700 text-white'
                                } transition-all`}
                        >
                            <FiChevronLeft className="w-4 h-4 mr-2" />
                            Previous
                        </button>
                        <div className="flex space-x-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum
                                if (totalPages <= 5) {
                                    pageNum = i + 1
                                } else if (page <= 3) {
                                    pageNum = i + 1
                                } else if (page >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i
                                } else {
                                    pageNum = page - 2 + i
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`w-10 h-10 flex items-center justify-center rounded-lg ${page === pageNum
                                            ? 'bg-cyan-600 text-white'
                                            : 'bg-gray-800 hover:bg-gray-700 text-white'
                                            } transition-all`}
                                    >
                                        {pageNum}
                                    </button>
                                )
                            })}
                        </div>
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                            className={`px-4 py-2 rounded-lg flex items-center ${page === totalPages
                                ? 'bg-gray-800/30 text-gray-500 cursor-not-allowed'
                                : 'bg-gray-800 hover:bg-gray-700 text-white'
                                } transition-all`}
                        >
                            Next
                            <FiChevronRight className="w-4 h-4 ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeliveredCapsules