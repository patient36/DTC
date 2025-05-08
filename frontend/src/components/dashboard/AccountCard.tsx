import { motion } from 'framer-motion';
import { FaUserCog } from 'react-icons/fa';
import { GiCog } from 'react-icons/gi';
import { formatDate } from '@/utils/formatDates';
import { FiZap } from 'react-icons/fi';

interface AccountCardProps {
  email: string;
  createdAt: string;
  paidUntil: string;
  onManageClick: () => void;
}

export const AccountCard = ({ email, createdAt, paidUntil, onManageClick }: AccountCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2, type: 'spring' }}
    className="relative bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 p-6 rounded-2xl backdrop-blur-xl border border-gray-700/50 shadow-2xl overflow-hidden"
  >
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#334155_0%,transparent_70%)] opacity-20" />

    <div className="relative z-10">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-4 mb-6 cursor-pointer"
        onClick={onManageClick}
      >
        <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-full">
          <FaUserCog className="text-2xl text-amber-500 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text" />
          <FiZap className="absolute -top-1 -right-2 text-amber-400 text-xs animate-pulse" />
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Account Overview
        </h2>
      </motion.div>

      <motion.ul className="space-y-4 text-sm">
        {[
          { label: 'Email', value: email },
          { label: 'Member since', value: formatDate(createdAt) },
          { label: 'Subscription expiry', value: formatDate(paidUntil) },
        ].map((item, index) => (
          <motion.li
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="group relative p-2 rounded-xl bg-gradient-to-r from-gray-800/30 to-gray-900/20 hover:from-gray-800/50 transition-all"
          >
            <div className="absolute inset-0 border-l-2 border-cyan-400/30 group-hover:border-cyan-400/50 transition-all" />
            <p className="text-sm font-mono text-cyan-300/80 ml-1">{item.label}:</p>
            <motion.p
              whileHover={{ x: 5 }}
              className="font-semibold text-transparent bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text"
            >
              {item.value}
            </motion.p>
          </motion.li>
        ))}
      </motion.ul>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onManageClick}
        className="mt-6 flex items-center justify-center gap-3 cursor-pointer bg-gradient-to-r from-blue-600/30 to-cyan-500/20 p-3 rounded-xl border border-cyan-400/20 hover:border-cyan-400/40 transition-all group"
      >
        <GiCog className="text-amber-400 group-hover:rotate-90 transition-transform duration-300" />
        <span className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Manage Account Settings
        </span>
      </motion.div>
    </div>

    <div className="absolute inset-0 rounded-2xl pointer-events-none border-[1px] border-cyan-400/10 animate-pulse" />
  </motion.div>
);