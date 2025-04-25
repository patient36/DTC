import { motion } from 'framer-motion';
import { Payment } from '@/types/payment';
import { formatDate } from '@/utils/formatDates';

interface PaymentsTableProps {
  payments: Payment[];
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
}

export const PaymentsTable = ({ payments, page, rowsPerPage, onPageChange }: PaymentsTableProps) => {
  const totalPages = Math.ceil(payments.length / rowsPerPage);
  const paginatedPayments = payments.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
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
            {paginatedPayments.map((p) => (
              <tr key={p.id} className="border-b border-gray-700">
                <td className="py-2 px-3 text-cyan-400">{p.id}</td>
                <td className="py-2 px-3">${p.amount.toFixed(2)}</td>
                <td className="py-2 px-3">
                  <span className={`px-2 py-1 font-bold text-xs ${p.status === 'SUCCESS' ? 'text-green-600' : p.status === 'PENDING' ? 'text-amber-600' : 'text-red-500'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="py-2 px-3">{formatDate(p.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4 text-sm text-gray-300">
        <span>Page {page + 1} of {totalPages}</span>
        <div className="space-x-2">
          <button
            onClick={() => onPageChange(Math.max(page - 1, 0))}
            disabled={page === 0}
            className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-40"
          >
            Prev
          </button>
          <button
            onClick={() => onPageChange(page + 1 < totalPages ? page + 1 : page)}
            disabled={(page + 1) * rowsPerPage >= payments.length}
            className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
};