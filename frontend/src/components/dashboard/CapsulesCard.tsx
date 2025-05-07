import { motion } from 'framer-motion';
import { FaChartPie } from 'react-icons/fa';

interface CapsulesCardProps {
  total: number;
  delivered: number;
  pending: number;
}

const statBoxBase =
  'flex-1 rounded-md p-4 hover:scale-105 transition-transform duration-300 ease-in-out text-white';

export const CapsulesCard = ({ total, delivered, pending }: CapsulesCardProps) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.4 }}
    className="bg-[#1e293b] p-6 rounded-2xl shadow-2xl text-white"
  >
    <div className="flex items-center gap-3 mb-6">
      <FaChartPie className="text-green-400 text-2xl" />
      <h2 className="text-xl font-semibold">Capsules</h2>
    </div>

    <div className="flex flex-col gap-4">
      <div className={`${statBoxBase} bg-gradient-to-r from-slate-600 to-gray-700`}>
        <span>Total: </span><span className="font-bold">{total}</span>
      </div>

      <div className="flex gap-4">
        <div className={`${statBoxBase} bg-gradient-to-r from-emerald-700 to-emerald-900`}>
          <span>Delivered: </span><span className="font-bold">{delivered}</span>
        </div>
        <div className={`${statBoxBase} bg-gradient-to-r from-violet-800 to-violet-950`}>
          <span>Pending: </span><span className="font-bold">{pending}</span>
        </div>
      </div>
    </div>
  </motion.div>
);
