import { motion } from 'framer-motion';
import { FaUserCog } from 'react-icons/fa';
import { GiCog } from 'react-icons/gi';
import { formatDate } from '@/utils/formatDates';

interface AccountCardProps {
  email: string;
  createdAt: string;
  paidUntil: string;
  onManageClick: () => void;
}

export const AccountCard = ({ email, createdAt, paidUntil, onManageClick }: AccountCardProps) => (
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
        <p className="font-bold hover:translate-x-1 transition-all text-amber-400">{email}</p>
      </li>
      <li>
        <p className="text-gray-400 text-xs">Member since:</p>
        <p className="font-bold hover:translate-x-1 transition-all text-amber-400">{formatDate(createdAt)}</p>
      </li>
      <li>
        <p className="text-gray-400 text-xs">Subscription expiry:</p>
        <p className="font-bold hover:translate-x-1 transition-all text-amber-400">{formatDate(paidUntil)}</p>
      </li>
    </ul>
    <div
      onClick={onManageClick}
      className='flex items-center justify-center gap-2 cursor-pointer bg-blue-500/20 mt-2 rounded-md p-2'
    >
      <GiCog className='text-amber-500' />
      <span className='text-sm font-bold'>Manage account information</span>
    </div>
  </motion.div>
);