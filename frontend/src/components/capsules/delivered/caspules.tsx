'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CapsulesTable from '@/components/capsules/delivered/CapsuleTable';
import { useCapsules } from '@/hooks/queries/useCapsules';
import LoadingSpinner from '@/components/gloabal/Spinner';
import { useAuth } from '@/hooks/auth/useAuth';

const DeliveredCapsules = () => {
    const { isAuthenticated } = useAuth()
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const { capsulesData, capsulesLoading, capsulesError, capsulesErrorDetail } = useCapsules(page, rowsPerPage)

    const handlePageSizeChange = (limit: number) => {
        setPage(1)
        setRowsPerPage(limit)
    }
    useEffect(() => {
        if (!capsulesLoading && !isAuthenticated) {
            router.push('/');
        }
        if (!capsulesLoading && capsulesError) {
            const isPaymentRequired = capsulesErrorDetail instanceof Error &&
                capsulesErrorDetail.message === 'Payment required';

            if (isPaymentRequired) {
                router.push('/payment');
            } else {
                console.error('Error fetching capsules:', capsulesErrorDetail);
            }
        }
    }, [capsulesLoading, isAuthenticated, capsulesError, capsulesErrorDetail]);

    if (capsulesError) {
        const isPaymentRequired =
            capsulesErrorDetail instanceof Error &&
            capsulesErrorDetail.message === 'Payment required';

        if (!isPaymentRequired) {
            console.error('Error fetching capsules:', capsulesErrorDetail);
        }

        return null;
    }

    if (capsulesLoading || !isAuthenticated) {
        return <LoadingSpinner />
    }

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                            Delivered Capsules
                        </h1>
                    </div>
                </div>

                {capsulesData?.delivered.capsules && capsulesData.delivered.capsules.length > 0 ? (
                    <CapsulesTable
                        capsules={capsulesData.delivered.capsules}
                        total={capsulesData.delivered.total}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={setPage}
                        onRowsPerPageChange={handlePageSizeChange}
                        onRowClick={(id: string) => router.push(`/capsules/delivered/${id}`)}
                    />
                ) : (
                    <div className="text-gray-400 py-4 text-center">No delivered capsules found</div>
                )}
            </div>
        </div>
    );
};

export default DeliveredCapsules;