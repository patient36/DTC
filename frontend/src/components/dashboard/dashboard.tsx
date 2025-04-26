'use client'

import React, { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import Modal from '@/components/gloabal/modal';
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { AccountCard } from '@/components/dashboard/AccountCard';
import { StorageCard } from '@/components/dashboard/StorageCard';
import { CapsulesCard } from '@/components/dashboard/CapsulesCard';
import { PaymentsTable } from '@/components/dashboard/PaymentsTable';
import { usePayment } from '@/hooks/payments/usePayments';
import AccountSettingsPage from './settings/AccountSettings';

const Dashboard = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const { paymentsData } = usePayment(page, rowsPerPage)
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated]);


  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]">
        <FaSpinner className="animate-spin text-4xl text-cyan-400" />
      </div>
    );
  }

  const freeStorage = 0.1;
  const storageRate = 5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white px-6 py-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        <DashboardHeader name={user.name} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AccountCard
            email={user.email}
            createdAt={user.createdAt}
            paidUntil={user.paidUntil}
            onManageClick={() => setIsOpen(true)}
          />

          <StorageCard
            usedStorage={user.usedStorage}
            freeStorage={freeStorage}
            storageRate={storageRate}
          />

          <CapsulesCard
            total={user.capsules.total}
            delivered={user.capsules.delivered}
            pending={user.capsules.pending}
          />
        </div>

        {paymentsData?.payments && paymentsData.payments.length > 0 ? (
          <PaymentsTable
            payments={paymentsData.payments}
            total={paymentsData.total}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={setPage}
            onRowsPerPageChange={setRowsPerPage}
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
    </div>
  );
};

export default Dashboard;