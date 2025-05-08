import { motion } from 'framer-motion';
import { FaRocket, FaCheckCircle, FaClock, FaChartLine, FaBoxes } from 'react-icons/fa';

interface CapsulesCardProps {
  total: number;
  delivered: number;
  pending: number;
}

export const CapsulesCard = ({ total, delivered, pending }: CapsulesCardProps) => {
  const successRate = total === 0 ? 0 : Math.round((delivered / total) * 100);
  const pendingRate = total === 0 ? 0 : Math.round((pending / total) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="relative bg-gradient-to-br from-slate-900 to-slate-800 px-6 pt-6 rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden group"
    >


      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 4 }}
            className="p-2 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl shadow-lg"
          >
            <FaRocket className="text-white text-lg" />
          </motion.div>
          <div>
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-teal-300">
              Capsules Stats
            </h2>
            <p className="text-xs text-gray-400">Real-time delivery metrics</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 gap-4 mb-6">
        {/* Total Capsules */}
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-gray-800/70 py-2 px-4  rounded-xl border border-gray-700/50 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between">
            <p className="text-gray-400 flex items-center gap-2 mb-1">
              <FaBoxes className="text-blue-400" />
              <span>Total</span>
            </p>
            <p className="text-3xl font-bold text-white">{total}</p>
          </div>
        </motion.div>
        <div className="flex justify-between gap-4">
          {/* Delivered */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-emerald-900/40 w-full p-2 rounded-xl border border-emerald-800/50 backdrop-blur-sm"
          >
            <div className="flex items-end justify-between">
              <p className="text-emerald-200 text-sm flex items-center gap-2">
                <FaCheckCircle />
                <span>Delivered</span>
              </p>
              <p className="text-xl font-bold text-white">{delivered}</p>
            </div>
          </motion.div>

          {/* Pending */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-violet-900/40 w-full p-2 rounded-xl border border-violet-800/50 backdrop-blur-sm"
          >
            <div className="flex items-end justify-between">
              <p className="text-violet-200 text-sm flex items-center gap-2">
                <FaClock />
                <span>Pending</span>
              </p>
              <p className="text-xl font-bold text-white">{pending}</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="relative z-10 space-y-4">
        <ProgressBar
          label="Delivery Progress"
          percentage={successRate}
          gradient="linear-gradient(to right, #34d399, #14b8a6)"
        />
        <ProgressBar
          label="Pending Completion"
          percentage={pendingRate}
          gradient="linear-gradient(to right, #a78bfa, #8b5cf6)"
        />
      </div>


      {/* Footer */}
      <div className="absolute bottom-0 w-full flex items-center justify-center p-4 border-t-2 border-slate-800 mt-2 text-xs text-gray-600 ">
        DTC Temporal Network Stats
      </div>
    </motion.div>
  );
};


const ProgressBar = ({ label, percentage, gradient }: { label: string, percentage: number, gradient: string }) => (
  <div>
    <div className="flex justify-between text-xs text-gray-400 mb-1">
      <span>{label}</span>
      <span>{percentage}%</span>
    </div>
    <div className={`h-2.5 bg-gray-700 rounded-full overflow-hidden relative`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ delay: 0.4, duration: 1, type: 'spring' }}
        className="absolute top-0 left-0 h-full"
        style={{
          backgroundImage: percentage > 0 ? gradient : undefined,
          backgroundColor: percentage === 0 ? 'rgba(255,255,255,0.1)' : undefined,
          width: percentage === 0 ? '100%' : undefined,
        }}
      />
    </div>
  </div>
);
