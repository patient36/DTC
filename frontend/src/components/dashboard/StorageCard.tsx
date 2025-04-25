import { motion } from 'framer-motion';
import { FaCloudUploadAlt } from 'react-icons/fa';

interface StorageCardProps {
  usedStorage: number;
  freeStorage: number;
  storageRate: number;
}

export const StorageCard = ({ usedStorage, freeStorage, storageRate }: StorageCardProps) => {
  const billableStorage = Math.max(usedStorage - freeStorage, 0);
  const storageCost = (billableStorage * storageRate).toFixed(2);

  return (
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
          <span>{usedStorage.toFixed(2)} GB used</span>
          <span className={`${usedStorage > freeStorage ? 'text-pink-400' : 'text-green-400'}`}>
            {usedStorage > freeStorage ? `+$${storageCost}` : 'Free'}
          </span>
        </div>
        <div className="w-full bg-gray-700 h-2 rounded-full">
          <div
            className={`h-2 rounded-full ${usedStorage > freeStorage ? 'bg-pink-500' : 'bg-cyan-500'}`}
            style={{ width: `${Math.min((usedStorage / freeStorage) * 100, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {freeStorage}GB free, billed at ${storageRate}/GB after
        </p>
        <div className="mt-4">
          <p className='text-sm mb-2 text-amber-600'>Billing information</p>
          <p className='text-xs'>Every user is allowed free 100 MBs of storage. Any other used storage after that is charged at ${storageRate}/GB.</p>
        </div>
      </div>
    </motion.div>
  );
};