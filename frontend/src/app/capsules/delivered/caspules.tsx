'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockCapsules } from './data';
import { ColumnToggle } from '@/components/capsules/delivered/ColumnToggle';
import { SearchInput } from '@/components/capsules/delivered/SearchInput';
import { PaginationControls } from '@/components/capsules/delivered/PaginationControls';
import { CapsuleTable } from '@/components/capsules/delivered/CapsuleTable';
import { ColumnVisibility, SortConfig, SortableKey } from '@/types/customTypes/delivered';

const DeliveredCapsules = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [showColumns, setShowColumns] = useState<ColumnVisibility>({
        id: false,
        title: true,
        deliveryDate: true,
        readCount: true,
        attachments: false,
        attachmentsSize: false,
        createdAt: true
    });
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleColumnToggle = (column: keyof ColumnVisibility) => {
        setShowColumns((prev) => ({ ...prev, [column]: !prev[column] }));
    };

    const handleSort = (key: SortableKey) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setPage(1);
    };


    // Filter and sort data
    let filteredData = mockCapsules.filter((capsule) =>
        capsule.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortConfig !== null) {
        filteredData = [...filteredData].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue instanceof Date && bValue instanceof Date) {
                return sortConfig.direction === 'asc'
                    ? aValue.getTime() - bValue.getTime()
                    : bValue.getTime() - aValue.getTime();
            }

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    // Calculate pagination data
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);
    const visibleStart = (page - 1) * pageSize + 1;
    const visibleEnd = Math.min(page * pageSize, filteredData.length);

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
                    <SearchInput value={searchQuery} onChange={handleSearchChange} />
                </div>

                <div className="mb-6 p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                    <h3 className="text-sm font-semibold text-gray-300 mb-3">DISPLAY COLUMNS</h3>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(showColumns).map(([column, isVisible]) => (
                            <ColumnToggle
                                key={column}
                                column={column as keyof ColumnVisibility}
                                isVisible={isVisible}
                                onToggle={handleColumnToggle}
                            />
                        ))}
                    </div>
                </div>

                <CapsuleTable
                    capsules={paginatedData}
                    columnVisibility={showColumns}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    onRowClick={(id) => router.push(`/capsules/delivered/${id}`)}
                />

                <PaginationControls
                    page={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    pageSize={pageSize}
                    onPageSizeChange={handlePageSizeChange}
                    totalItems={filteredData.length}
                    visibleStart={visibleStart}
                    visibleEnd={visibleEnd}
                />
            </div>
        </div>
    );
};

export default DeliveredCapsules;