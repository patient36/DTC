import { motion } from 'framer-motion';
import { FaCloudUploadAlt, FaDatabase, FaDollarSign, FaChartLine } from 'react-icons/fa';

interface StorageCardProps {
  usedStorage: number;
  freeStorage: number;
  storageRate: number;
}

export const StorageCard = ({ usedStorage, freeStorage, storageRate }: StorageCardProps) => {
  const billableStorage = Math.max(usedStorage - freeStorage, 0);
  const storageCost = (billableStorage * storageRate).toFixed(2);
  const usedPercentage = Math.min((usedStorage / freeStorage) * 100, 100);
  const freePercentage = Math.min((freeStorage / usedStorage) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      whileHover={{ scale: 1.02 }}
      className="relative bg-gradient-to-br from-[#1e293b]/90 to-[#0f172a]/90 p-6 rounded-2xl backdrop-blur-xl border border-gray-700/50 shadow-2xl overflow-hidden transition-all"
    >

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gradient-to-br from-cyan-600 to-cyan-400 rounded-xl shadow-lg">
              <FaCloudUploadAlt className="text-white text-2xl" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-200 bg-clip-text text-transparent">
              Storage Overview
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-2 bg-gray-800/50 rounded-xl border border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <FaDatabase className="text-cyan-400 text-lg" />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Used Storage</p>
                <p className="text-md font-semibold">{usedStorage.toFixed(2)}<span className="text-xs text-gray-400 ml-1">GB</span></p>
              </div>
            </div>
          </div>

          <div className="p-2 bg-gray-800/50 rounded-xl border border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className={`p-2 ${billableStorage > 0 ? 'bg-pink-500/10' : 'bg-green-500/10'} rounded-lg`}>
                <FaDollarSign className={`${billableStorage > 0 ? 'text-pink-400' : 'text-green-400'} text-lg`} />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Current Cost</p>
                <p className="text-md font-semibold">
                  {billableStorage > 0 ? `$${storageCost}` : <span className="text-green-400">Free</span>}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-cyan-400">{Math.min(usedStorage, freeStorage).toFixed(2)} GB Free Tier</span>
            <span className="text-pink-400">{billableStorage > 0 ? `${billableStorage.toFixed(2)} GB Billable` : ''}</span>
          </div>
          <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((Math.min(usedStorage, freeStorage) / freeStorage) * 100, 100)}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 relative"
            >
              <div className="absolute inset-0 bg-cyan-500/30 animate-pulse" />
            </motion.div>
            {billableStorage > 0 && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((billableStorage / usedStorage) * 100, 100)}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500 absolute top-0"
              />
            )}
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-4 rounded-xl border border-gray-700/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-1.5 bg-amber-500/10 rounded-lg">
              <FaDollarSign className="text-amber-400 text-sm" />
            </div>
            <p className="text-sm font-medium text-amber-400">Billing Details</p>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            <span className="text-white font-medium">{freeStorage} GB Free Tier</span> included.
            Beyond that, <span className="text-white font-medium">${storageRate}/GB</span> applies.
            Current billable storage: <span className="text-pink-400 font-medium">{billableStorage.toFixed(2)} GB</span>.
          </p>
        </div>
      </div>
    </motion.div>
  );
};