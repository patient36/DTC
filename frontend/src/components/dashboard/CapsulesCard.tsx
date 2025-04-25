import { motion } from 'framer-motion';
import { FaChartPie } from 'react-icons/fa';

interface CapsulesCardProps {
  total: number;
  delivered: number;
  pending: number;
}

export const CapsulesCard = ({ total, delivered, pending }: CapsulesCardProps) => (
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
        Total:<span className='font-bold'> {total}</span>
      </div>
      <div className='flex gap-4 justify-between'>
        <div className="flex-1 bg-amber-500/60 rounded-md p-4">
          Delivered:<span className='font-bold'> {delivered}</span>
        </div>
        <div className="flex-1 bg-purple-300/60 rounded-md p-4">
          Pending:<span className='font-bold'> {pending}</span>
        </div>
      </div>
    </div>
  </motion.div>
);