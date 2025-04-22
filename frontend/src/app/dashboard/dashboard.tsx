'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUserCog, FaChartPie, FaCloudUploadAlt, FaPen } from 'react-icons/fa';
import { userData } from './user';
import Modal from '@/components/modal';
import UpdateForm from './update-user';
import { GiCog } from 'react-icons/gi';

const Dashboard = () => {
  const user = userData
  const freeStorage = 0.1;
  const storageRate = 5;
  const billableStorage = Math.max(user.usedStorage - freeStorage, 0);
  const storageCost = (billableStorage * storageRate).toFixed(2);

  const rowsPerPage = 5;
  const [page, setPage] = useState(0);
  const paginatedPayments = user.payments.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const [isOpen, setIsOpen] = useState(false)


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold mb-2">
            Welcome, <span className="text-cyan-400">{user.name}</span>
          </h1>
          <p className="text-gray-300">Digital Time Capsule Dashboard</p>
        </motion.header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Account */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1e293b] p-6 rounded-2xl shadow-xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <FaUserCog className="text-cyan-400 text-2xl" />
              <h2 className="text-xl font-semibold">Account Overview</h2>
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <p className="text-gray-400 text-xs">Email:</p>
                <p className="font-bold hover:translate-x-1 transition-all text-amber-400">{user.email}</p>
              </li>

              <li>
                <p className="text-gray-400 text-xs">Member since:</p>
                <p className="font-bold hover:translate-x-1 transition-all text-amber-400">{new Date(user.createdAt).toLocaleDateString()}</p>
              </li>

              <li>
                <p className="text-gray-400 text-xs">Subscription expiry:</p>
                <p className="font-bold hover:translate-x-1 transition-all text-amber-400">{new Date(user.paidUntil).toLocaleDateString()}</p>
              </li>
            </ul>
            <div
              onClick={() => setIsOpen(true)}
              className='flex items-center gap-2 cursor-pointer bg-blue-500/20 mt-2 rounded-md p-2'>
              <GiCog className='text-amber-500' />
              <span className='text-sm font-bold'>Account settings</span>
            </div>
          </motion.div>

          {isOpen ?
            <Modal onClose={() => setIsOpen(false)}>
              {
                <UpdateForm />
              }
            </Modal>
            : ""}

          {/* Storage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#1e293b] p-6 rounded-2xl shadow-xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <FaCloudUploadAlt className="text-purple-400 text-2xl" />
              <h2 className="text-xl font-semibold">Storage</h2>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>{user.usedStorage.toFixed(2)} GB used</span>
                <span className={`${user.usedStorage > freeStorage ? 'text-pink-400' : 'text-green-400'}`}>
                  {user.usedStorage > freeStorage ? `+$${storageCost}` : 'Free'}
                </span>
              </div>
              <div className="w-full bg-gray-700 h-2 rounded-full">
                <div
                  className={`h-2 rounded-full ${user.usedStorage > freeStorage ? 'bg-pink-500' : 'bg-cyan-500'}`}
                  style={{ width: `${Math.min((user.usedStorage / freeStorage) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {freeStorage}GB free, billed at ${storageRate}/GB after
              </p>
              <div className="mt-4">
                <p className='text-sm mb-2 text-amber-600'>Billing information</p>
                <p className='text-xs '>Every user is allowed free 100 MBs of storage. Any other used storage used after that is charged with a rate of $5/GB. </p>
              </div>
            </div>
          </motion.div>

          {/* Capsules */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#1e293b] p-6 rounded-2xl shadow-xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <FaChartPie className="text-green-400 text-2xl" />
              <h2 className="text-xl font-semibold">Capsules</h2>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex-1 bg-purple-500/60 rounded-md p-4">
                Total:<span className='font-bold'> {user.capsules.total}</span>
              </div>
              <div className='flex gap-4 justify-between'>
                <div className="flex-1/3 bg-amber-500/60 rounded-md p-4">
                  Delivered:<span className='font-bold'> {user.capsules.delivered}</span>
                </div>
                <div className="flex-1/3 bg-purple-300/60 rounded-md p-4">
                  Pending:<span className='font-bold'> {user.capsules.pending}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Payments Table */}
        {user.payments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#1e293b] p-6 rounded-2xl shadow-xl"
          >
            <h2 className="text-xl font-semibold mb-4 text-cyan-300">Payments</h2>
            <div className="overflow-auto">
              <table className="w-full text-sm text-left text-white border-collapse">
                <thead className="border-b border-gray-700">
                  <tr>
                    <th className="py-2 px-3">ID</th>
                    <th className="py-2 px-3">Amount</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPayments.map(p => (
                    <tr key={p.id} className="border-b border-gray-700">
                      <td className="py-2 px-3 text-cyan-400">{p.id}</td>
                      <td className="py-2 px-3">${p.amount.toFixed(2)}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-1 font-bold text-xs ${p.status === 'SUCCESS' ? 'text-green-600' : p.status === 'PENDING' ? 'text-amber-600' : 'text-red-500'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-2 px-3">{new Date(p.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 text-sm text-gray-300">
              <span>Page {page + 1} of {Math.ceil(user.payments.length / rowsPerPage)}</span>
              <div className="space-x-2">
                <button
                  onClick={() => setPage(p => Math.max(p - 1, 0))}
                  disabled={page === 0}
                  className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-40"
                >
                  Prev
                </button>
                <button
                  onClick={() => setPage(p => (p + 1 < Math.ceil(user.payments.length / rowsPerPage) ? p + 1 : p))}
                  disabled={(page + 1) * rowsPerPage >= user.payments.length}
                  className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
