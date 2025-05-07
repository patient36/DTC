import { motion } from 'framer-motion';
import { FaCloudUploadAlt, FaDatabase, FaDollarSign } from 'react-icons/fa';

interface StorageCardProps {
  usedStorage: number;
  freeStorage: number;
  storageRate: number;
}

export const StorageCard = ({ usedStorage, freeStorage, storageRate }: StorageCardProps) => {
  const billableStorage = Math.max(usedStorage - freeStorage, 0);
  const storageCost = (billableStorage * storageRate).toFixed(2);
  const usedPercentage = Math.min((usedStorage / freeStorage) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-[#1e293b] p-6 rounded-2xl shadow-xl text-white"
    >
      <div className="flex items-center gap-4 mb-4">
        <FaCloudUploadAlt className="text-purple-400 text-3xl" />
        <h2 className="text-xl font-semibold">Storage Overview</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div className="flex items-center gap-2">
          <FaDatabase className="text-cyan-400" />
          <span>{usedStorage.toFixed(2)} GB used</span>
        </div>
        <div className="flex items-center gap-2">
          <FaDollarSign className={`${billableStorage > 0 ? 'text-pink-400' : 'text-green-400'}`} />
          <span>{billableStorage > 0 ? `+$${storageCost}` : 'Free'}</span>
        </div>
      </div>

      <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden relative mb-2">
        <div
          className="h-full bg-cyan-500"
          style={{ width: `${Math.min((Math.min(usedStorage, freeStorage) / freeStorage) * 100, 100)}%` }}
        />
        {billableStorage > 0 && (
          <div
            className="h-full bg-pink-500 absolute top-0"
            style={{ left: `${usedPercentage}%`, width: `${Math.min((billableStorage / usedStorage) * 100, 100)}%` }}
          />
        )}
      </div>

      <p className="text-xs text-gray-400 mb-4">
        You have {freeStorage} GB free. Extra usage costs ${storageRate}/GB.
      </p>

      <div className="bg-gray-800 p-4 rounded-xl">
        <p className="text-sm font-medium text-amber-500 mb-1">Billing Information</p>
        <p className="text-xs text-gray-300">
          Every user gets <span className="text-white font-semibold">100 MB</span> free. After that, storage is billed at
          <span className="text-white font-semibold"> ${storageRate}/GB</span>. Your current billable storage is 
          <span className="text-white font-semibold"> {billableStorage.toFixed(2)} GB</span>.
        </p>
      </div>
    </motion.div>
  );
};