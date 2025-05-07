import { useState } from "react"
import Modal from '@/components/gloabal/modal';
import { FaUser, FaEnvelope, FaShieldAlt, FaDatabase, FaCalendarCheck, FaRocket, FaBoxOpen, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';

const SearchById = () => {
    const [id, setId] = useState('')
    const [data, setData] = useState<any>(null)
    const handleGetData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/users/${id}`, { credentials: 'include' })
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const result = await response.json()
            console.log(result)
            setData(result)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1e293b] p-6 rounded-2xl shadow-xl"
        >
            <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-center text-white tracking-wide">
                    Search User by ID
                </h2>
                <input
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    onFocus={() => setId('')}
                    placeholder="Enter User ID"
                    className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleGetData}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                    Search
                </button>
                {
                    data && (
                        <Modal onClose={() => setData(null)}>
                            <motion.div
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                                className="bg-gray-900 rounded-xl p-6 w-full max-w-2xl"
                            >
                                <div className="border-b border-gray-700 pb-4 mb-6">
                                    <h2 className="text-2xl font-bold flex items-center gap-2">
                                        <FaUser className="text-blue-400" />
                                        {data.user.name}
                                        <span className="text-sm bg-blue-900 text-blue-300 px-3 py-1 rounded-full ml-2">
                                            {data.user.role}
                                        </span>
                                    </h2>
                                    <p className="text-gray-400 flex items-center gap-2 mt-2">
                                        <FaEnvelope className="text-purple-400" />
                                        {data.user.email}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gray-800 p-4 rounded-lg">
                                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                                            <FaDatabase className="text-green-400" />
                                            Storage Usage
                                        </h3>

                                        <div className="flex items-center justify-between text-sm text-gray-400">
                                            <span>{Math.round(data.user.usedStorage * 100) / 100} GB Used</span>
                                            <span className="text-blue-400">{(Math.max(0.1 - data.user.usedStorage, 0)).toFixed(2)} GB Free</span>
                                        </div>

                                        <div className="h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-green-400 to-blue-500"
                                                style={{ width: `${Math.min((data.user.usedStorage / 0.1) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-gray-800 p-4 rounded-lg">
                                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                                            <FaCalendarCheck className="text-yellow-400" />
                                            Subscription Status
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded-full text-sm ${new Date(data.user.paidUntil) > new Date()
                                                ? 'bg-green-900 text-green-300'
                                                : 'bg-red-900 text-red-300'}`}>
                                                {new Date(data.user.paidUntil) > new Date() ? 'Active' : 'Expired'}
                                            </span>
                                            <p className="text-sm text-gray-400">
                                                Until {new Date(data.user.paidUntil).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 bg-gray-800 p-4 rounded-lg">
                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                        <FaRocket className="text-purple-400" />
                                        Capsule Statistics
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center p-4 bg-gray-700 rounded-lg">
                                            <FaBoxOpen className="text-3xl mx-auto text-green-400" />
                                            <p className="text-2xl font-bold mt-2">{data.capsules.delivered}</p>
                                            <p className="text-sm text-gray-400">Delivered</p>
                                        </div>
                                        <div className="text-center p-4 bg-gray-700 rounded-lg">
                                            <FaClock className="text-3xl mx-auto text-yellow-400" />
                                            <p className="text-2xl font-bold mt-2">{data.capsules.pending}</p>
                                            <p className="text-sm text-gray-400">Pending</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 text-sm text-gray-400 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <FaShieldAlt className="text-red-400" />
                                        User ID: {data.user.id}
                                    </div>
                                    <p>Joined: {new Date(data.user.createdAt).toLocaleDateString()}</p>
                                </div>
                            </motion.div>
                        </Modal>
                    )
                }
            </div>
        </motion.div>
    )
}

export default SearchById