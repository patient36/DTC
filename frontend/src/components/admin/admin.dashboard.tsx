"use client";

import TokenCard from "@/components/admin/TokenCard";
import UsersTable from '@/components/admin/UsersTable'
import { useAdmin } from "@/hooks/admin/useAdmin";
import { useAuth } from "@/hooks/auth/useAuth";
import { useEffect, useState } from "react";
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { AccountCard } from '@/components/dashboard/AccountCard';
import { StorageCard } from '@/components/dashboard/StorageCard';
import { useRouter } from "next/navigation";
import { CapsulesCard } from '@/components/dashboard/CapsulesCard';
import Modal from '@/components/gloabal/modal';
import LoadingSpinner from '@/components/gloabal/Spinner';
import AccountSettingsPage from "@/components/dashboard/settings/AccountSettings";
import { PaymentsTable } from '@/components/dashboard/PaymentsTable';
import SeachById from "@/components/admin/SearchById";


const AdminDashboard = () => {
    const [page, setPage] = useState(1)
    const [isOpen, setIsOpen] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const { usersData } = useAdmin(page, rowsPerPage)
    const { paymentsData } = useAdmin(page, rowsPerPage)
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();

    const handlePageSizeChange = (limit: number) => {
        setPage(1)
        setRowsPerPage(limit)
    }

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/');
        }
    }, [isLoading, isAuthenticated]);


    if (isLoading || !user) {
        return (
            <LoadingSpinner />
        );
    }

    const freeStorage = 0.1;
    const storageRate = 5;

    return (
        <div className="min-h-screen flex flex-col gap-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 text-white">
            <DashboardHeader name={user.name} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <AccountCard
                    email={user.email}
                    createdAt={user.createdAt}
                    paidUntil={user.paidUntil}
                    onManageClick={() => setIsOpen(true)}
                />

                <StorageCard
                    usedStorage={20}
                    freeStorage={freeStorage}
                    storageRate={storageRate}
                />

                <CapsulesCard
                    total={user.capsules.total}
                    delivered={user.capsules.delivered}
                    pending={user.capsules.pending}
                />
                <TokenCard />
                <SeachById />
            </div>
            {usersData?.admins && usersData.admins.total > 0 ? (
                <UsersTable
                    tableTitle="System Admins"
                    users={usersData.admins.users}
                    total={usersData.admins.total}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={setPage}
                    onRowsPerPageChange={handlePageSizeChange}
                />) : (
                <div className="text-gray-400 py-4 text-center">No admins found</div>
            )}
            {usersData?.users && usersData.users.total > 0 ? (
                <UsersTable
                    tableTitle="Ordinary users"
                    users={usersData.users.users}
                    total={usersData.users.total}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={setPage}
                    onRowsPerPageChange={handlePageSizeChange}
                />) : (
                <div className="text-gray-400 py-4 text-center">No users found</div>
            )}

            {paymentsData?.payments && paymentsData.payments.length > 0 ? (
                <PaymentsTable
                    payments={paymentsData.payments}
                    total={paymentsData.total}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={setPage}
                    onRowsPerPageChange={handlePageSizeChange}
                />
            ) : (
                <div className="text-gray-400 py-4 text-center">No payments found</div>
            )}

            {isOpen && (
                <Modal onClose={() => setIsOpen(false)}>
                    <AccountSettingsPage onClose={() => setIsOpen(false)} />
                </Modal>
            )}
        </div>
    );
};

export default AdminDashboard;